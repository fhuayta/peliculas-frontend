<template>
  <v-card elevation="0">
    <app-dialog
      :dialog.sync="modalUsuario"
      :titulo="form.id ? 'Editar Usuario' : 'Adicionar Usuario'"
      @open-dialog="modalUsuario = true"
      @close-dialog="closeModal"
      @accion="save"
    >
      <!-- SLOT PARA EL FORMULARIO -->
      <template>
        <!-- FORMULARIO PARA AGREGAR O EDITAR -->
        <v-form
          :key="`usuario-${form.id}`"
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="save"
        >
          <v-card elevation="0">
            <!-- <v-checkbox
              v-if="!form.id"
              color="ciudadania"
              v-model="usarCiudadaniaCheckBox"
              class="ciudadania--text ml-2"
              :label="`Usar Ciudadanía Digital`"
            ></v-checkbox> -->
            <v-card
              v-if="usarCiudadaniaCheckBox"
              elevation="0"
              class="primary--text mb-3 ciudadania--text ml-3"
            >
              Campos deshabilitados por usar Ciudadanía Digital
            </v-card>
            <form-persona
              v-if="modalUsuario"
              :persona="form.persona"
              :touched="touched"
              @touch="touch"
              :deshabilitarCampos="usarCiudadaniaCheckBox || form.id != null"
              :deshabilitar-carnet="form.id != null"
              @value="obtenerPersona"
            ></form-persona>
            <v-container fluid>
              <v-card elevation="0" class="primary--text mb-3"
                >Datos del usuario</v-card
              >
              <v-row>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-input-text-field
                    color="primary"
                    required
                    outlined
                    dense

                    :disabled="form.ciudadaniaDigital || usarCiudadaniaCheckBox"
                    :rules="
                      touched.correoElectronico && !usarCiudadaniaCheckBox
                        ? $validate(['required', 'email'])
                        : []
                    "
                    v-model="form.correoElectronico"
                    :init="form.correoElectronico"
                    :label="
                      `${
                        !usarCiudadaniaCheckBox
                          ? 'Correo Electrónico (*)'
                          : 'Correo Electrónico'
                      }`
                    "
                    v-on:blur="touch({ name: 'correoElectronico' })"
                    :tabindex="7"
                  />
                </v-col>
                <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                  <v-input-select
                    @value="e => form.roles = e"
                    color="primary"
                    required
                    multiple
                    dense
                    outlined
                    item-color="primary"
                    v-model="form.roles"
                    :init="form.roles"
                    label="Roles (*)"
                    :items="roles"
                    item-text="rol"
                    item-value="id"
                    :tabindex="8"
                    name="roles"
                    v-on:blur="touch({ name: 'roles' })"
                    :rules="touched.roles ? $validate(['required']) : []"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </template>
    </app-dialog>
    <crud-table
      :headers="headers"
      :url.sync="url"
      :widthModal="500"
      :order="order"
      :filters.sync="filters"
      :custom="true"
      title="Usuarios"
    >
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              icon
              v-on="on"
              @click.native.stop="oModal"
              slot="activator"
              v-if="btnAgregar"
            >
              <v-icon-component icon="add" class="primary--text"/>
            </v-btn>
          </template>
          <span class="brightnessText--text"> Agregar usuario </span>
        </v-tooltip>
      </template>

      <!-- SLOT PARA LOS ITEMS
      (Solo en caso de que se quiera personalizar cada columna
      o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.persona.nroDocumento }}</td>
          <td>
            <span>
              {{ items.items.persona.nombres }}
              {{ items.items.persona.primerApellido }}
              {{ items.items.persona.segundoApellido }}
            </span>
            <br />
            <v-btn
              v-if="items.items.ciudadaniaDigital"
              color="ciudadania"
              outlined
              x-small
            >
              Ciudadanía Digital
            </v-btn>
          </td>
          <td>{{ items.items.usuario }}</td>
          <td>
            <v-chip small v-for="rol in items.items.usuarioRol" :key="rol.id">{{
              rol.rol.rol
            }}</v-chip>
          </td>
          <td>
            <v-btn
              outlined
              :color="items.items.estado === 'ACTIVO' ? 'info' : 'default'"
              >{{ items.items.estado }}
            </v-btn>
          </td>
          <td>
            <v-tooltip bottom color="primary" v-if="btnEditar">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  :color="
                    ['PENDIENTE', 'ACTIVO'].includes(items.items.estado)
                      ? 'success'
                      : 'error'
                  "
                  @click.prevent="actualizarUsuario(items)"
                  :disabled="items.items.estado === 'PENDIENTE'"
                >
                  <v-icon-component
                    v-if="['PENDIENTE', 'ACTIVO'].includes(items.items.estado)"
                    icon="toggle_on"
                  />
                  <v-icon-component
                    v-if="['INACTIVO', 'CREADO'].includes(items.items.estado)"
                    icon="toggle_off"
                  />
                </v-btn>
              </template>
              <span>{{
                items.items.estado === 'INACTIVO'
                  ? 'Activar usuario'
                  : 'Inactivar usuario'
              }}</span>
            </v-tooltip>
            <v-tooltip
              bottom
              color="teal lighten-1"
              v-if="
                btnEditar &&
                  (items.items.estado === 'ACTIVO' ||
                    items.items.estado === 'PENDIENTE')
              "
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  color="info"
                  @click.stop="passwordRecovery(items.items.id)"
                  :disabled="items.items.ciudadaniaDigital"
                >
                  <v-icon-component icon="vpn_key"></v-icon-component>
                </v-btn>
              </template>
              <span>Restablecer Contraseña</span>
            </v-tooltip>
            <v-tooltip bottom color="success" v-if="btnEditar">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  color="success"
                  @click.stop="oModal(items)"
                >
                  <v-icon-component icon="edit"></v-icon-component>
                </v-btn>
              </template>
              <span>Editar registro</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </crud-table>
  </v-card>
</template>
<script>
import security from '@/common/mixins/security';
import validate from '@/common/mixins/validate';
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import actions from '@/plugins/crud-table/mixins/crud-table';
import FormPersona from '@/components/personas/form.vue';
import moment from 'dayjs';
import metodos from './mixins/usuarios';

const customParseFormat = require('dayjs/plugin/customParseFormat');

moment.extend(customParseFormat);

/**
 * @group Usuarios
 * Componentes de gestion de usuarios
 */
export default {
  name: 'Usuarios',
  mixins: [security, actions, validate, metodos],
  data() {
    return {
      valid: false,
      url: 'usuarios',
      order: ['createdAt', 'DESC'],
      headers: this.getUserHeaders(),
      form: this.initializeForm(),
      touched: this.getTouched(),
      btnAgregar: true,
      btnEditar: true,
      btnEliminar: true,
      roles: [],
      modalUsuario: false,
      usarCiudadaniaCheckBox: null,
      filters: [],
    };
  },
  mounted() {
    this.loadParams();
  },
  methods: {
    async loadParams() {
      this.$nextTick(async () => {
        this.btnAgregar = await this.$check(
          this.$storage.get('rol'),
          '/admin/usuarios',
          'create',
        );
        this.btnEditar = await this.$check(
          this.$storage.get('rol'),
          '/admin/usuarios',
          'update',
        );
        this.btnEliminar = await this.$check(
          this.$storage.get('rol'),
          '/admin/usuarios',
          'delete',
        );
      });
      await this.$service.get('autorizacion/roles').then(resultado => {
        this.roles = resultado?.datos ?? [];
        this.filters = [
          {
            field: 'filtro',
            type: 'text',
            label: 'Buscar por Nro. Documento o persona...',
          },
          {
            field: 'rol',
            type: 'array',
            label: 'Buscar por roles...',
            multiple: true,
            values: this.roles.map(rol => ({
              text: rol.rol,
              value: rol.id
            })),
          },
        ];
      });
    },
    touch({ name }) {
      this.touched = {
        ...this.touched,
        [name]: true,
      };
    },
    reset() {
      this.form = this.initializeForm();
    },
    obtenerPersona(value) {
      this.form.persona = value;
    },
    async actualizarUsuario({ items }) {
      const permitido = await this.$check(
        this.$storage.get('rol'),
        '/usuarios',
        'update',
      );
      if (!permitido) {
        this.$message.warning('No tiene permisos');
        return;
      }
      const message = `¿Está seguro de ${
        items.estado === 'INACTIVO' ? 'activar' : 'inactivar'
      } este usuario?`;
      this.$confirm({
        text: message,
        callbackOk: async () => {
          try {
            const response = await this.$service.patch(
              `${this.url}/${items.id}/${
                items.estado === 'INACTIVO' ? 'activacion' : 'inactivacion'
              }`,
            );
            if (response.finalizado) {
              this.updateList();
              this.$message.success(
                `Usuario ${
                  items.estado === 'INACTIVO' ? 'activado' : 'inactivado'
                } satisfactoriamente`
              );
            } else {
              this.$message.error(response.mensaje ?? 'Ocurrió un error');
            }
            this.closeModal();
          } catch (err) {
            this.$message.error(
              err.message ?? err.mensaje ?? 'Ocurrió un error'
            );
          }
        },
      });
    },

    async save() {
      await this.setTouched(true);
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.form));
        data.persona.fechaNacimiento = moment(
          data.persona.fechaNacimiento,
          'DD-MM-YYYY',
          'es',
        ).format('YYYY-MM-DD');
        if (data.id) {
          await this.updateUser(data);
        } else {
          await this.createUser(data);
        }
      } else {
        this.$message.error('Faltan campos por llenar');
      }
    },
    setTouched(option) {
      return new Promise(resolve => {
        Object.keys(this.touched).forEach(item => {
          this.touched = {
            ...this.touched,
            [item]: option,
          };
        });
        resolve(true);
      });
    },
  },
  components: {
    CrudTable,
    FormPersona
  },
};
</script>
