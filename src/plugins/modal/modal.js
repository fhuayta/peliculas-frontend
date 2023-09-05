/* eslint-disable no-new */
import store from '@/store';

const modalDialog = {
  alert({
    text,
    callback,
    title = 'Alerta'
  }) {
    const { alert } = store.state;
    alert.show = true;
    alert.title = title;
    alert.text = text;

    if (typeof callback === 'function') {
      alert.callback = callback;
    }
  },

  confirm({
    text,
    callbackOk,
    callbackCancel,
    textOk = 'Aceptar',
    textCancel = 'Cancelar',
    width = 360,
  }) {
    const { confirm } = store.state;
    confirm.show = true;
    confirm.text = text;
    confirm.width = width;
    confirm.textOk = textOk;
    confirm.textCancel = textCancel;

    if (typeof callbackOk === 'function') {
      confirm.callbackOk = callbackOk;
    }

    if (typeof callbackCancel === 'function') {
      confirm.callbackCancel = callbackCancel;
    }
  },
};

const modalTemplate = {
  modal({
    template,
    callbackOk,
    callbackCancel,
    textOk = 'Aceptar',
    textCancel = 'Cancelar',
    width = 360,
    title = 'Llene los siguientes datos',
    body,
  }) {
    const pantallaEmergente = store.state.globalModal;
    pantallaEmergente.template = template;
    pantallaEmergente.show = true;
    pantallaEmergente.textOk = textOk;
    pantallaEmergente.callbackOk = callbackOk;
    pantallaEmergente.textCancel = textCancel;
    pantallaEmergente.callbackCancel = callbackCancel;
    pantallaEmergente.width = width;
    pantallaEmergente.title = title;
    pantallaEmergente.body = body;
  },
};

export default {
  store,
  install(Vue) {
    const Modal = {
      ...modalDialog,
      ...modalTemplate,
    };

    Vue.prototype.$alert = Modal.alert;
    Vue.prototype.$confirm = Modal.confirm;
    Vue.prototype.$modal = Modal.modal;
  },
};
