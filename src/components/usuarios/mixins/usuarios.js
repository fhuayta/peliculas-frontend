import zxcvbn from 'zxcvbn';
import moment from 'dayjs';

const customParseFormat = require('dayjs/plugin/customParseFormat');

moment.extend(customParseFormat);

export default {
  methods: {
    // perfil.vue
    initPerfil() {
      return {
        nroDocumento: null,
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        fechaNacimiento: null,
        tipoDocumento: null,
      };
    },
    getRules(minLengthPass, minStrengthPass) {
      return {
        oldPassword: [v => !!v || 'Este campo es requerido.'],
        newPassword1: [
          v => !!v || 'Este campo es requerido.',
          v => (v && v.length >= minLengthPass)
            || `La contraseña debe ser de al menos ${minLengthPass} caracteres`,
          v => (!!v && zxcvbn(v).score >= minStrengthPass)
            || 'La contraseña debe ser segura',
        ],
        newPassword2: [
          v => !!v || 'Este campo es requerido.',
          v => (!!v && v === this.newPassword1)
            || 'Las contraseñas no coinciden.',
        ],
      };
    },
    getPasswordLevels() {
      return [
        {
          color: '#EFEFEF',
          text: '',
        },
        {
          color: '#F42D45',
          text: 'Contraseña muy débil',
        },
        {
          color: '#FFC107',
          text: 'Contraseña débil',
        },
        {
          color: '#8FD300',
          text: 'Contraseña segura',
        },
        {
          color: '#8FD300',
          text: 'Contraseña muy segura',
        },
      ];
    },
    // usuarios.vue
    getUserHeaders() {
      return [
        {
          text: 'Nro. Documento',
          align: 'center',
          value: 'nroDocumento',
        },
        {
          text: 'Persona',
          align: 'center',
          value: 'nombre',
        },
        {
          text: 'Usuario',
          align: 'center',
          value: 'nombre',
        },
        {
          text: 'Rol',
          align: 'center',
          value: 'usuario',
        },
        {
          text: 'Estado',
          sortable: false,
          value: 'estado',
        },
        {
          text: 'Acciones',
          divider: false,
          sortable: false,
          align: 'center',
          value: 'ACTIONS',
        },
      ];
    },
    initializeForm() {
      return {
        id: null,
        usuario: null,
        persona: {
          nombres: null,
          primerApellido: null,
          segundoApellido: null,
          nroDocumento: null,
          fechaNacimiento: null,
        },
        ciudadaniaDigital: false,
        roles: [],
        estado: 'ACTIVO',
      };
    },
    getTouched() {
      return {
        roles: false,
        nombres: false,
        correoElectronico: false,
        primerApellido: false,
        segundoApellido: false,
        nroDocumento: false,
        fechaNacimiento: false,
      };
    },
    async passwordRecovery(id) {
      this.$confirm({
        text: '¿Está seguro de restablecer la contraseña de este usuario?',
        callbackOk: async () => {
          try {
            const response = await this.$service.patch(
              `${this.url}/${id}/restauracion`,
              {},
            );
            if (response.finalizado) {
              this.$message.success(response.mensaje);
              return;
            }
            this.$message.error(response.mensaje
              ?? 'Error al restablecer contraseña');
          } catch (error) {
            this.$message.error(
              error.mensaje
                ?? error.message
                ?? 'Error al restablecer contraseña'
            );
          } finally {
            this.closeModal();
            this.updateList();
          }
        },
      });
    },
    closeModal() {
      this.reset();
      this.modalUsuario = false;
    },
    async oModal({ items }) {
      await this.setTouched(false);
      console.log('usuario>>>>>>>>>>>>>>> ', items);
      if (items && items.id) {
        this.form = JSON.parse(JSON.stringify(items));

        this.form.persona.fechaNacimiento = moment(
          items.persona.fechaNacimiento,
        ).format('DD-MM-YYYY');

        this.form.roles = [];
        items.usuarioRol.forEach(rol => {
          this.form.roles.push(rol.rol.id);
        });
      } else {
        this.reset();
      }
      this.modalUsuario = true;
    },
    async createUser(data) {
      delete data.id;
      try {
        if (this.usarCiudadaniaCheckBox) {
          data.usuario = data.persona.nroDocumento;
          delete data.id;
          delete data.estado;
          delete data.persona;
        }
        const newUser = await this.$service.post(
          `${this.url}${this.usarCiudadaniaCheckBox
            ? '/cuenta/ciudadania'
            : ''}`,
          data,
        );
        if (newUser && newUser.isOK) {
          this.closeModal();
          this.updateList();
          this.$message.success('El registro fue agregado correctamente');
        } else {
          throw new Error(newUser.mensaje);
        }
      } catch (error) {
        this.$message.error(
          error.message ?? 'Ocurrio un error al tratar de enviar la data'
        );
      }
    },
    async updateUser(data) {
      try {
        const updateData = JSON.parse(JSON.stringify(data));
        delete updateData.active;
        delete updateData.ciudadaniaDigital;
        delete updateData.estado;
        delete updateData.id;
        delete updateData.persona;
        delete updateData.usuario;
        delete updateData.usuarioRol;
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
