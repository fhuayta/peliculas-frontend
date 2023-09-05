export default {
  methods: {
    getTabs() {
      return [
        {
          name: 'Políticas Frontend',
          value: 'frontend',
        },
        {
          name: 'Políticas Backend',
          value: 'backend',
        },
      ];
    },
    getActions() {
      return [
        'create',
        'read',
        'update',
        'delete',
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
      ];
    },
    getPolicyHeaders() {
      return [
        { text: 'Sujeto', align: 'center', value: 'sujeto' },
        { text: 'Objeto', align: 'center', value: 'objeto' },
        { text: 'Acción', align: 'center', value: 'accion' },
        { text: 'App', sortable: false, value: 'app' },
        {
          text: 'Acciones',
          divider: false,
          sortable: false,
          align: 'center',
          value: 'ACTIONS',
        },
      ];
    },
    initForm() {
      return {
        sujeto: null,
        objeto: null,
        accion: null,
        app: null,
      };
    },
  },
};
