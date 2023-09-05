const appName = process.env.VUE_APP_SITENAME || 'app';

const userMethods = {
  setUser(user) {
    storageMethods.set('user', user);
  },

  getUser() {
    return storageMethods.get('user');
  },

  existUser() {
    return storageMethods.exist('user');
  },

  removeUser() {
    storageMethods.remove('user');
  },
};

const storageMethods = {
  set(key, value) {
    window.localStorage.setItem(`${appName}_${key}`, JSON.stringify(value));
  },

  get(key) {
    const data = window.localStorage.getItem(`${appName}_${key}`);
    try {
      return JSON.parse(data);
    } catch (Exception) {
      return data;
    }
  },

  remove(key) {
    window.localStorage.removeItem(`${appName}_${key}`);
  },

  destroy(key) {
    this.remove(key);
  },

  exist(key) {
    const value = window.localStorage.getItem(`${appName}_${key}`);
    return (
      value !== null
      && value !== 'null'
      && value !== '[]'
    );
  },

  removeAll() {
    window.localStorage.clear();
  },
};

const sessionMethods = {
  setSession(key, value) {
    window.sessionStorage.setItem(`${appName}_${key}`, JSON.stringify(value));
  },

  getSession(key) {
    return JSON.parse(window.sessionStorage.getItem(`${appName}_${key}`));
  },

  removeSession(key) {
    window.sessionStorage.removeItem(`${appName}_${key}`);
  },

  existSession(key) {
    const value = window.sessionStorage.getItem(`${appName}_${key}`);
    return (
      value !== null
      && value !== 'null'
      && value !== '[]'
    );
  },
};

export default {
  install: Vue => {
    const Storage = {
      ...userMethods,

      // window.LocalStorage
      ...storageMethods,

      // window.SessionStorage
      ...sessionMethods,

      // Flash Data
      flash(key) {
        if (this.exist(key)) {
          const value = this.get(key);
          this.remove(key);
          return value;
        }
        return false;
      },
    };
    Vue.prototype.$storage = Storage;
  },
};
