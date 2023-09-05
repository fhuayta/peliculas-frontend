<template>
  <v-card elevation="0">
    <crud-table
      :headers="headers"
      :url="url"
      :widthModal="500"
      :order="order"
      :custom="true"
      :filters.sync="filters"
      title="Mis Películas"
    >
      <template slot="buttons">
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              icon
              dark
              v-on="on"
              @click.native.stop="oModal"
              slot="activator"
              v-if="btnAgregar"
            >
              <v-icon-component icon="add" />
            </v-btn>
          </template>
          <span class="brightnessText--text"> Agregar Parámetro </span>
        </v-tooltip>
      </template>
      <!-- SLOT PARA EL FORMULARIO -->
      <template slot="form" slot-scope="">
        <v-card-title class="ma-0 pa-1">
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                align="start"
                justify="center"
                :cols="11"
                class="d-flex flex-row align-center text-sm"
                :class="$vuetify.theme.dark ? 'white--text' : 'primary--text'"
              >
                <v-icon-component
                  icon="add"
                  class="mr-2 primary--text"
                ></v-icon-component>
                {{
                  actualizarRegistro
                    ? 'Editar Parámetro'
                    : 'Adicionar Parámetro'
                }}
              </v-col>
              <v-col :cols="1">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="primary"
                      v-on="on"
                      @click.stop="closeModal"
                    >
                      <v-icon-component icon="close"></v-icon-component>
                    </v-btn>
                  </template>
                  <span class="brightnessText--text"
                    >Cerrar ventana emergente</span
                  >
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-divider></v-divider>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="save"
        >
          <v-card>
            <v-container fluid>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    :rules="$validate(['required'])"
                    v-model="form.codigo"
                    label="Código"
                    outlined
                    :tabindex="3"
                    dense
                  />
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    :rules="$validate(['required'])"
                    v-model="form.nombre"
                    label="Nombre"
                    outlined
                    dense
                    :tabindex="3"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    :rules="$validate(['required'])"
                    v-model="form.grupo"
                    label="Grupo"
                    outlined
                    dense
                    :tabindex="3"
                  />
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    v-model="form.descripcion"
                    label="Descripción"
                    outlined
                    dense
                    :tabindex="3"
                  />
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-container fluid>
                <v-row>
                  <v-col
                    justify="start"
                    xs="12"
                    sm="12"
                    md="4"
                    lg="4"
                    cols="12"
                  />
                  <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                    <v-btn block @click.stop="closeModal">
                      <v-icon-component icon="cancel"></v-icon-component>
                      <span>Cancelar</span>
                    </v-btn>
                  </v-col>
                  <v-col sm="12" xs="12" md="4" lg="4" cols="12">
                    <v-btn
                      block
                      color="primary"
                      dark
                      type="submit"
                      :disabled="!valid"
                    >
                      <v-icon-component
                        icon="check"
                        class="brightnessText--text"
                      />
                      <span class="brightnessText--text">Enviar</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
      <!-- SLOT PARA LOS ITEMS
          (Solo en caso de que se quiera personalizar
          cada columna o mas de 1 columna) -->
      <template slot="items" slot-scope="items">
        <tr>
          <td>{{ items.items.poster }}</td>
          <td>{{ items.items.title }}</td>
          <td>{{ items.items.year }}</td>
          <td>{{ items.items.director }}</td>
          <td>{{ items.items.actors }}</td>
          <td>
            <v-btn
              outlined
              :color="items.items.estado === 'ACTIVO' ? 'info' : 'default'"
              >{{ items.items.estado }}
            </v-btn>
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
import acciones from './mixins/parametros';

export default {
  name: 'Parametros',
  mixins: [security, actions, validate, acciones],
  data() {
    return {
      valid: false,
      url: 'pelicula/todos',
      order: ['createdAt', 'DESC'],
      headers: this.getHeaders(),
      form: this.initForm(),
      btnAgregar: false,
      btnEditar: false,
      roles: [],
      actualizarRegistro: false,
      filters: [],
    };
  },
  mounted() {
    this.loadParams();
  },
  methods: {
    reset() {
      this.form = this.initForm();
    },
    async loadParams() {
      this.$nextTick(async () => {
        this.btnAgregar = await this.$check(
          this.$storage.get('rol'),
          '/admin/parametros',
          'create',
        );
        this.btnEditar = await this.$check(
          this.$storage.get('rol'),
          '/admin/parametros',
          'update',
        );
      });
      await this.$service.get('autorizacion/roles').then((resultado) => {
        this.roles = resultado && resultado.datos ? resultado.datos : [];
        this.filters = [
          {
            field: 'filtro',
            type: 'text',
            label: 'Buscar parámetro...',
          },
        ];
      });
    },
    oModal({ items }) {
      if (items && items.id) {
        this.form = JSON.parse(JSON.stringify(items));
        this.actualizarRegistro = true;
      } else {
        this.actualizarRegistro = false;
        this.reset();
      }
      this.$store.commit('openModal');
    },
    closeModal() {
      this.reset();
      this.$store.commit('closeModal');
    },
    async save() {
      if (this.$refs.form.validate()) {
        const data = JSON.parse(JSON.stringify(this.form));
        if (data.id) {
          await this.updateParametro(data);
        } else {
          await this.createParametro(data);
        }
      } else {
        this.$message.error('Faltan campos por llenar');
      }
    },
    async actualizarParametro({ items }) {
      const permitido = await this.$check(
        this.$storage.get('rol'),
        '/admin/parametros',
        'update',
      );
      if (!permitido) {
        this.$message.warning('No tiene permisos');
        return;
      }
      const message = `¿Está seguro de ${
        items.estado === 'INACTIVO' ? 'activar' : 'inactivar'
      } este parametro?`;
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
                `Parametro ${
                  items.estado === 'INACTIVO' ? 'activado' : 'inactivado'
                } satisfactoriamente`,
              );
            } else {
              this.$message.error(response.mensaje ?? 'Ocurrió un error');
            }
            this.closeModal();
          } catch (err) {
            this.$message.error(
              err.message ?? err.mensaje ?? 'Ocurrió un error',
            );
          }
        },
      });
    },
  },
  components: {
    CrudTable,
  },
};
</script>
