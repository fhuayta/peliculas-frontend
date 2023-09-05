export default {
  install: Vue => {
    const instance = new Vue();
    const { $waiting } = instance;
    Vue.directive('generate', {
      bind: el => {
        const message = 'Espere mientras se genera el documento...';
        el.addEventListener('click', () => {
          $waiting(true, message);
        });
      },
    });

    Vue.directive('uppercase', {
      bind: (el, binding, vnode) => {
        vnode.elm.dispatchEvent(new CustomEvent('input'));
        const handler = e => {
          if (e.target.value) {
            e.target.value = e.target.value.toUpperCase();
          }
        };
        el.addEventListener('input', handler);
      },
    });

    Vue.directive('border-animated-over', {
      bind: el => {
        el.addEventListener('mouseover', () => {
          el.style.transition = 'border 0.3s';
          el.style.backgroundColor = 'transparent';
          el.style.borderBottom = '2px solid #3F1929';
        });
      },
    });

    Vue.directive('border-animated-out', {
      bind: el => {
        el.addEventListener('mouseout', () => {
          el.style.transition = 'border 0.3s';
          el.style.borderBottom = 'none';
        });
      },
    });
  },
};
