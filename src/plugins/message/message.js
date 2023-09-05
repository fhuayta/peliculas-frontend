import store from '@/store';

export default {
  store,
  install(Vue) {
    const message = {
      add({ text, title, icon, theme }) {
        const { snackbar } = store.state;
        snackbar.message = text;
        snackbar.title = title;
        snackbar.icon = icon;
        snackbar.theme = theme;
        snackbar.status = true;
      },
      success(text, {
        title, icon, theme
      } = {
        title: 'La operación se realizó correctamente.',
        icon: 'check',
        theme: 'success'
      }) {
        this.add({ text, title, icon, theme });
      },
      info(text, {
        title, icon, theme
      } = { title: 'Información', icon: 'info', theme: 'info' }) {
        this.add(text, title, icon, theme);
      },
      warning(text, {
        title, icon, theme
      } = { title: 'Advertencia', icon: 'warning', theme: 'warning' }) {
        this.add({ text, title, icon, theme });
      },
      error(text, {
        title, icon, theme
      } = { title: 'Error', icon: 'error', theme: 'error' }) {
        this.add({ text, title, icon, theme });
      },
    };
    Vue.prototype.$message = message;
  },
};
