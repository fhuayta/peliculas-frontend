export default {
  methods: {
    getHeaders() {
      return [
        { text: 'Código', align: 'center', value: 'codigo' },
        { text: 'Nombre', align: 'center', value: 'nombre' },
        { text: 'Grupo', align: 'center', value: 'grupo' },
        { text: 'Descripción', sortable: false, value: 'descripcion' },
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
        codigo: null,
        nombre: null,
        grupo: null,
        descripcion: null,
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
        delete updateData.id;
        await this.$service.patch(`${this.url}/${data.id}`, updateData);
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
