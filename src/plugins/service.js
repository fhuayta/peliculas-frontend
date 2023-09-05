/* eslint-disable max-lines-per-function */
import axios from 'axios';
import Auth from '@/components/auth/mixins/auth';
import router from '@/router';
import Store from '@/store';

const protocol = window.location.protocol.replace(':', '');
const PATERN_HOST = protocol === 'https'
  ? /(https:\/\/|www\.)\S+/i
  : /(http:\/\/|www\.)\S+/i;

axios.defaults.withCredentials = true;

let apiUrl;
let authToken;
let baseServer;
let Util;
let Progress;
let Message;
let Storage;
let Confirm;
let Waiting;
let instance;

const request = axios.create({
  withCredentials: true,
});

const getUrl = (url, id) => {
  id = typeof id === 'string' || typeof id === 'number' ? `${id}` : '';
  if (url && url[url.length - 1] !== '/' && id.length > 1) {
    id = `/${id}`;
  }
  return PATERN_HOST.test(url) ? url + id : baseServer + url + id;
};

const getPayload = token => {
  const jwtStr = token.split('.')[1];
  return JSON.parse(atob(jwtStr));
};

const expiredToken = (ttl, t) => {
  const actualDate = Math.round(new Date().getTime() / 1000);
  return actualDate - t > ttl;
};

const filterResponse = response => {
  Progress.close();
  if (!response.hasOwnProperty('isOK')) response.isOK = true;
  return response;
};

const _http = (method, url, data) => {
  Progress.start();
  url = getUrl(url, data);
  if (
    process.env.VUE_APP_DEBUG_MODE
    && process.env.NODE_ENV === 'development'
  ) {
    console.info('URL:', method.toUpperCase(), url);
  }

  const setting = {
    method,
    url,
  };

  if (typeof data === 'object' && Object.keys(data).length) {
    setting.data = data;
  }

  // Set token in headers
  if (Storage.exist('token')) {
    setting.headers = {
      Authorization: `${authToken} ${Storage.get('token')}`,
    };
  }

  return request(setting)
    .then(response => filterResponse(response.data))
    .catch(error => handlingErrors(error))
    .finally(() => Progress.close());
};

async function handleFileRequest(resolve, reject) {
  const { url, type, forceDownload, responseData, method, data } = this;

  const response = await request({
    url,
    baseURL: baseServer,
    method,
    data,
    timeout: 10000,
    withCredentials: false,
    headers: {
      Authorization: `${authToken} ${Storage.get('token')}`,
    },
  });

  if (!response) {
    reject(new Error('Error al tratar de procesar el archivo'));
  }
  const file = new window.Blob([response.data], {
    type,
  });
  const fileURL = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute(
    'download',
    `${new Date().toLocaleDateString()}.${type.split('/')[1]}`,
  );
  if (forceDownload) {
    document.body.appendChild(link); link.click();
    resolve('Archivo exitosamente descargado');
  } else if (responseData) {
    resolve(response.data);
  } else {
    Confirm({
      text: '¿Desea descargar el archivo?',
      callbackOk: () => {
        document.body.appendChild(link);
        link.click();
        resolve('Archivo exitosamente generado');
      },
      callbackCancel: () => {
        resolve(response.data);
      },
      textOk: 'Descargar',
      textCancel: 'No descargar',
      time: 600,
    });
  }
  URL.revokeObjectURL(fileURL);
}

const Services = {
  options(url) {
    return _http('get', `${url}/fields`);
  },

  get(url, id) {
    return _http('get', url, id);
  },

  post(url, data) {
    return _http('post', url, data);
  },

  put(url, data) {
    return _http('put', url, data);
  },

  patch(url, data) {
    return _http('patch', url, data);
  },

  delete(url, id) {
    return _http('delete', url, id);
  },

  remove(url, id) {
    return this.delete(url, id);
  },

  list(url, query) {
    query = query ? '?' + Util.serialize(query) : '';
    return _http('get', url + query);
  },

  save(url, data) {
    return _http(data.id ? 'put' : 'post', url, data);
  },

  file(
    url,
    method = 'GET',
    {
      type = 'application/pdf',
      forceDownload = false,
      responseData = true,
      data = {},
    },
  ) {
    try {
      return new Promise(
        handleFileRequest.bind({
          url,
          type,
          forceDownload,
          responseData,
          method,
          data,
        }),
      );
    } catch (err) {
      Message.error(err.message);
    }
  },
};

const handlingErrors = error => {
  Progress.close();
  if (error.response) {
    const { data } = error.response;
    if (data?.datos?.errores?.length > 0) {
      let errores = '<ul>';
      for (const msjError of data.datos.errores) {
        errores += `<li>${msjError}</li>`;
      }
      errores += '</ul>';
      data.mensaje = `${data.mensaje} ${errores}`;
    }
    throw data;
  } else if (error.message) {
    if (error.message === 'Network Error') {
      Message.error('Network Error');
    } else {
      Message.error(error.message);
    }
  } else {
    Message.error('Network Error');
  }
};

const responseInterceptor = error => {
  if (error.message === 'Network Error') {
    if (window.location.hash !== '#/login') {
      Message.error('Ocurrio un error');
      Storage.removeAll();
      router.push('/login');
      return;
    }
  }
  if (error.response) {
    if ([400, 500, 412].includes(error.response.status)) {
      const message = error.response.data.mensaje
        || error.message
        || 'Ocurrio un error';
      Waiting(false);
      Message.error(message);
    }
    if (error.response?.status === 401) {
      if (window.location.hash !== '#/login') {
        Message.error('Terminó la sesión');
        instance.logout(router, Store);
      }
    }
    if (error.response?.status === 402) {
      const message = error.response.data.mensaje;
      Message.error(message);
    }
    if (error.response?.status === 403) {
      Store.commit('setState403', true);
      router.push({
        name: 'forbidden',
        params: {
          mensaje: error.response.data?.message
            ?? error.response.data?.mensaje
            ?? 'No tienes permisos para realizar esta acción',
        }
      });
    }
    if (error.response?.status === 404) {
      router.push('/404');
    }
  }
  // Adicionando la propiedad isOK para indicar que es de tipo ERROR
  error.response.data.isOK = false;
  if (error?.response?.data?.datos?.errores.length > 0) {
    const { errores } = error.response.data.datos;
    let listErrors = '<ul>';
    for (const msjError of errores) {
      listErrors += `<li>${msjError}</li>`;
    }
    listErrors += '</ul>';
    error.response.data.mensaje += listErrors;
  }
  return error.response;
};

const requestInterceptor = async config => {
  if (
    !config.url.includes('/auth')
    && !config.url.includes('/logout')
    && !config.url.includes('/perfil')
    && config.headers?.Authorization
    && expiredToken(Storage.get('ttl'), Storage.get('t'))
  ) {
    // renovamos access token
    try {
      const reqToken = axios.create();
      const resp = await reqToken.post(getUrl('token'), {});
      const response = resp.data;
      const { datos } = response;
      if (datos?.access_token) {
        Storage.set('token', datos.access_token);
        const payload = getPayload(datos.access_token);
        const actualDate = Math.round(new Date().getTime() / 1000);
        Storage.set('ttl', payload.exp - payload.iat);
        Storage.set('t', actualDate);
        config.headers.Authorization = `${authToken} ${Storage.get('token')}`;
      }
    } catch (error) {
      Message.error('Terminó la sesión');
      instance.logout(router, Store);
    }
  }
  return config;
};

export default {
  Store,
  router,
  install: (Vue, config) => {
    // Config
    apiUrl = config && config.apiUrl ? config.apiUrl : '';
    authToken = config && config.authToken ? config.authToken : 'Bearer';
    baseServer = config && config.baseServer ? config.baseServer : '';
    // Plugins
    instance = new Vue({
      mixins: [Auth],
    });

    Util = instance.$util;
    Progress = instance.$progress;
    Message = instance.$message;
    Storage = instance.$storage;
    Confirm = instance.$confirm;
    Waiting = instance.$waiting;

    // Add a response interceptor
    request.interceptors.response.use(
      response => response,
      responseInterceptor,
    );

    // Interceptor para renovar access token en request
    request.interceptors.request.use(
      requestInterceptor,
      error => Promise.reject(error)
    );
    Vue.prototype.$service = Services;
    Vue.prototype.$http = request;
    Vue.prototype.$apiUrl = apiUrl;
    Vue.prototype.$authToken = authToken;
    Vue.prototype.$baseServer = baseServer;
  },
};
