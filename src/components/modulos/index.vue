<template>
  <v-card elevation="0">
    <crud-table
      :headers="headers"
      :url="url"
      :widthModal="500"
      :order="order"
      :custom="true"
      title="Módulos"
      :filters.sync="filters"
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
          <span class="brightnessText--text"> Agregar Módulo </span>
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
                {{ actualizarRegistro ? 'Editar Módulo' : 'Adicionar Módulo' }}
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
                <v-switch
                  style="margin-left: 16px"
                  v-model="moduloPadre"
                  :disabled="deshabilitarCampos"
                  label="Menú padre"
                ></v-switch>
              </v-row>
              <v-row v-if="!moduloPadre">
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <div style="margin-bottom: 10px">
                    <label>Menú Padre</label>
                  </div>
                  <v-select
                    item-color="primary"
                    required
                    autofocus
                    :rules="$validate(['required'])"
                    v-model="form.fidModulo.id"
                    color="primary"
                    :items="getItemsPadre()"
                    item-text="label"
                    outlined
                    dense
                    hide-details
                    :disabled="deshabilitarCampos"
                    item-value="id"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    :rules="$validate(['required'])"
                    v-model="form.propiedades.icono"
                    label="Icono"
                    outlined
                    :disabled="deshabilitarCampos"
                    dense
                    :tabindex="3"
                  />
                </v-col>
              </v-row>
              <v-divider
                v-if="!moduloPadre"
                style="margin-bottom: 16px"
              ></v-divider>
              <v-row>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    :rules="$validate(['required'])"
                    v-model="form.label"
                    label="Label"
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
                    v-model="form.propiedades.descripcion"
                    label="Descripción"
                    outlined
                    dense
                    :tabindex="3"
                  />
                </v-col>
                <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                  <v-input-text-field
                    color="primary"
                    required
                    v-model="form.url"
                    :rules="$validate(['required'])"
                    label="URL"
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
          <td>
            <v-icon-component
              v-if="items.items.fidModulo"
              :icon="items.items.propiedades.icono"
            />
          </td>
          <td>{{ items.items.label }}</td>
          <td v-if="items.items.fidModulo">
            {{
              items.items.propiedades ? items.items.propiedades.descripcion : ''
            }}
          </td>
          <td v-else>
            <label class="primary--text font-weight-bold">MENÚ PADRE</label>
          </td>
          <td>{{ items.items.url }}</td>
          <td>
            <v-btn
              outlined
              :color="items.items.estado === 'ACTIVO' ? 'info' : 'default'"
              >{{ items.items.estado }}
            </v-btn>
          </td>
          <td>
            <v-tooltip bottom color="success" v-if="btnEditar">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  color="success"
                  @click.stop="oModal(items)"
                >
                  <v-icon-component icon="edit" />
                </v-btn>
              </template>
              <span>Editar registro</span>
            </v-tooltip>
            <!-- <v-tooltip bottom color="success" v-if="btnEliminar">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  color="success"
                  @click.stop="oModal(items)"
                >
                  <v-icon-component icon="delete" class="error--text" />
                </v-btn>
              </template>
              <span>Eliminar registro</span>
            </v-tooltip> -->
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
import { mapState } from 'vuex';
import acciones from './mixins/modulos';

export default {
  name: 'Módulos',
  mixins: [security, actions, validate, acciones],
  data() {
    return {
      valid: false,
      url: 'autorizacion/modulos',
      order: ['createdAt', 'DESC'],
      headers: this.getHeaders(),
      form: this.initForm(),
      moduloPadre: false,
      btnAgregar: true,
      btnEditar: true,
      btnEliminar: true,
      actualizarRegistro: false,
      deshabilitarCampos: false,
      filters: [],
    };
  },
  computed: mapState({
    itemsDataTable: (store) => store.itemsDataTable,
  }),
  mounted() {
    this.loadParams();
  },
  methods: {
    reset() {
      this.form = this.initForm();
    },
    getItemsPadre() {
      return this.itemsDataTable.filter((item) => !item.fidModulo);
    },
    async loadParams() {
      this.$nextTick(async () => {
        this.btnAgregar = await this.$check(
          this.$storage.get('rol'),
          '/admin/modulos',
          'create',
        );
        this.btnEditar = await this.$check(
          this.$storage.get('rol'),
          '/admin/modulos',
          'update',
        );
        this.btnEliminar = await this.$check(
          this.$storage.get('rol'),
          '/admin/modulos',
          'delete',
        );
      });
      await this.$service.get('autorizacion/roles').then((resultado) => {
        this.roles = resultado && resultado.datos ? resultado.datos : [];
        this.filters = [
          {
            field: 'filtro',
            type: 'text',
            label: 'Buscar módulo...',
          },
        ];
      });
    },
    oModal({ items }) {
      if (items && items.id) {
        if (!items.fidModulo) {
          this.moduloPadre = true;
          this.deshabilitarCampos = true;
        } else {
          this.moduloPadre = false;
          this.deshabilitarCampos = false;
        }
        this.form = JSON.parse(JSON.stringify(items));
        this.actualizarRegistro = true;
      } else {
        this.deshabilitarCampos = false;
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
        this.form.fidModulo = this.form.fidModulo.id;
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
  },
  components: {
    CrudTable,
  },
};
</script>
