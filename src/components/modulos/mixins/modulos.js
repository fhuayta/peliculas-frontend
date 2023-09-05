export default {
  methods: {
    getHeaders() {
      return [
        { text: 'Icono', align: 'center', value: 'propiedades.icono' },
        { text: 'Nombre', align: 'center', value: 'label' },
        { text: 'Descripción', sortable: false, value: 'propiedades.descripcion' },
        { text: 'URL', align: 'center', value: 'url' },
        { text: 'Estado', sortable: false, value: 'estado' },
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
        label: null,
        nombre: null,
        url: null,
        propiedades: {
          descripcion: null,
          icono: null
        },
        fidModulo: {
          id: null,
        },
      };
    },
    async createParametro(data) {
      delete data.id;
      try {
        const response = await this.$service.post(this.url, data);
        if (response.finalizado) {
          this.$store.commit('closeModal');
          this.updateList();
          this.$message.success('El registro fue agregado correctamente');
        } else {
          throw new Error(response.mensaje);
        }
      } catch (error) {
        this.$message.error(
          error.message ?? 'Ocurrio un error al tratar de enviar la data'
        );
      }
    },
    async updateParametro(data) {
      try {
        const updateData = JSON.parse(JSON.stringify(data));
        delete updateData.estado;
        await this.$service.patch(this.url, updateData);
        this.closeModal();
        this.updateList();
        this.$message.success('Se actualizó el registro correctamente');
      } catch (error) {
        this.$message.error(
          error.mensaje ?? 'Ocurrio un error al tratar de enviar la data'
        );
      }
    },
  },
};
