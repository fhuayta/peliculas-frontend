export default {
  methods: {
    getHeaders() {
      return [
        { text: 'Rol', align: 'center', value: 'rol' },
        { text: 'Nombre', align: 'center', value: 'nombre' },
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
        rol: null,
        nombre: null,
      };
    },
    async createRol(data) {
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
    async updateRol(data) {
      try {
        const updateData = JSON.parse(JSON.stringify(data));
        delete updateData.active;
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
