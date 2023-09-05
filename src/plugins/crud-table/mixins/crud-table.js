export default {
  methods: {
    updateList(className = 'btn-refresh-list') {
      if (document.getElementsByClassName(className)) {
        for (const item of document.getElementsByClassName(className)) {
          item.dispatchEvent(new window.Event('click', { cancelable: true }));
        }
      }
    },
    /**
     * @function addEventKeydown
     * @description Funcion nativa, vue no reconoce keydown solo keyup
     * @link  https://vuejs.org/v2/guide/events.html
     * @param name index
     */
    addEventKeydown(elem) {
      const element = elem;
      let typingTimer;
      const doneTypingInterval = 1000;
      if (element) {
        element.onkeydown = () => {
          clearTimeout(typingTimer);
          typingTimer = setTimeout(async () => {
            this.activeSearch = true;
          }, doneTypingInterval);
          return true;
        };
      }
    },
    getQuery({ options, search, tipo, refresh }) {
      const { sortBy, sortDesc, pagina, itemsPerPage } = options;
      const query = {
        limite: itemsPerPage,
        pagina,
      };
      const sort = Array.isArray(sortBy) && sortBy.length > 0
        ? sortBy[0]
        : sortBy;
      const desc = Array.isArray(sortDesc) && sortDesc.length > 0
        ? sortDesc[0]
        : sortDesc;
      if ((sort || '').length > 0 && !refresh) {
        query.orden = (desc ? '-' : '') + sort;
      }
      if (tipo) {
        query.tipo = tipo;
      }
      if (Object.keys(search).length) {
        for (const key in search) {
          if (search[key] !== '' && (search[key] || '').length > 0) {
            query[key] = encodeURI(search[key]);
          }
        }
      }
      return query;
    },
    filtrar() {
      this.showFilter = !this.showFilter;
      if (this.showFilter) {
        for (const key in this.search) {
          this.search[key] = '';
        }
        setTimeout(() => {
          for (const elem of this.$refs.searchTextField) {
            this.addEventKeydown(elem.$el);
          }
        }, 300);
      }
    },
  }
};
