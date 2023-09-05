<template>
  <v-card elevation="0">
    <!-- <v-tabs v-model="tab" color="primary" align-with-title>
      <v-tab class="ml-1" v-for="item in tabItem" :key="item.value">{{
        item.value
      }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in tabItem" :key="item.name">
      </v-tab-item>
    </v-tabs-items> -->
    <crud-table
          :headers="headers"
          :url="url"
          :widthModal="500"
          :order="order"
          :custom="true"
          :filters.sync="filters"
          description="Tipos de políticas"
          title="Políticas"
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
              <span class="brightnessText--text"> Agregar Política </span>
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
                    :class="
                      $vuetify.theme.dark ? 'white--text' : 'primary--text'
                    "
                  >
                    <v-icon-component
                      icon="add"
                      class="mr-2 primary--text"
                    ></v-icon-component>
                    {{
                      actualizarRegistro
                        ? 'Editar Política'
                        : 'Adicionar Política'
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
                      <span class="brightnessText--text">Cerrar ventana emergente</span>
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
                      <div style="margin-bottom: 10px">
                        <label>Sujeto</label>
                      </div>
                      <v-select
                        item-color="primary"
                        required
                        autofocus
                        :rules="$validate(['required'])"
                        v-model="form.sujeto"
                        color="primary"
                        :items="roles"
                        item-text="rol"
                        outlined
                        dense
                        hide-details
                        item-value="rol"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                      <v-input-text-field
                        color="primary"
                        required
                        :rules="$validate(['required'])"
                        v-model="form.objeto"
                        label="Objeto"
                        outlined
                        dense
                        :tabindex="3"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                      <div style="margin-bottom: 10px">
                        <label>App</label>
                      </div>
                      <v-select
                        item-color="primary"
                        required
                        :rules="$validate(['required'])"
                        v-model="form.app"
                        :items="aplicaciones"
                        outlined
                        dense
                        hide-details
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" xs="12" sm="12" lg="6">
                      <div style="margin-bottom: 10px">
                        <label>Acción</label>
                      </div>
                      <v-select
                        item-color="primary"
                        required
                        :rules="$validate(['required'])"
                        v-model="form.accion"
                        multiple
                        :items="acciones"
                        outlined
                        dense
                        hide-details
                      ></v-select>
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
                          <v-icon-component icon="check" class="brightnessText--text"/>
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
              <td>{{ items.items.sujeto }}</td>
              <td>{{ items.items.objeto }}</td>
              <td>{{ items.items.accion }}</td>
              <td>{{ items.items.app }}</td>
              <td>
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
                <v-tooltip bottom color="error" v-if="btnEliminar">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      color="error"
                      @click.prevent="itemDelete(items)"
                    >
                      <v-icon-component icon="delete"></v-icon-component>
                    </v-btn>
                  </template>
                  <span>Eliminar registro</span>
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
import acciones from './mixins/politicas';

// @group Politicas
export default {
  name: 'Politicas',
  mixins: [security, actions, validate, acciones],
  data() {
    return {
      valid: false,
      url: 'autorizacion/politicas',
      order: ['createdAt', 'DESC'],
      headers: this.getPolicyHeaders(),
      form: this.initForm(),
      aplicaciones: ['frontend', 'backend'],
      acciones: this.getActions(),
      roles: [],
      btnAgregar: true,
      btnEditar: true,
      btnEliminar: true,
      actualizarRegistro: false,
      registroAnterior: {},
      filters: [],
      tipos: [
        {
          tipo: 'Frontend',
          value: 'frontend'
        },
        {
          tipo: 'Backend',
          value: 'backend'
        }
      ]
      // tab: null,
      // tabItem: this.getTabs(),
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
          '/admin/politicas',
          'create',
        );
        this.btnEditar = await this.$check(
          this.$storage.get('rol'),
          '/admin/politicas',
          'update',
        );
        this.btnEliminar = await this.$check(
          this.$storage.get('rol'),
          '/admin/politicas',
          'delete',
        );
      });
      await this.$service.get('autorizacion/roles').then(resultado => {
        this.roles = resultado && resultado.datos ? resultado.datos : [];
        this.filters = [
          {
            field: 'filtro',
            type: 'text',
            label: 'Buscar política...',
          },
          {
            field: 'aplicacion',
            type: 'array',
            label: 'Buscar por tipo...',
            values: this.tipos.map(app => ({
              text: app.tipo,
              value: app.value
            })),
          },
        ];
      });
    },
    async itemDelete({ items }) {
      const message = '¿Está seguro de eliminar este registro?';
      this.$confirm({
        text: message,
        callbackOk: async () => {
          try {
            const { sujeto, objeto, accion, app } = items;
            let peticion = `${this.url}?sujeto=${sujeto}&objeto=${objeto}`;
            peticion = `${peticion}&accion=${accion}&app=${app}`;
            await this.$service.delete(peticion);
            this.updateList();
            this.$store.commit('closeModal');
            this.$message.success('Registro eliminado satisfactoriamente');
          } catch (err) {
            this.$message.error(
              err.message ?? err.mensaje ?? 'Ocurrio un error'
            );
          }
        },
      });
    },
    closeModal() {
      this.reset();
      this.$store.commit('closeModal');
    },
    oModal({ items }) {
      if (items && Object.keys(items).length > 0) {
        this.form = { ...items, accion: items.accion.split('|') };
        this.registroAnterior = { ...items };
        this.actualizarRegistro = true;
      } else {
        this.actualizarRegistro = false;
        this.reset();
      }
      this.$store.commit('openModal');
    },
    /**
     * @function save
     * @description Esta funcion esta creada para guardar en la BD
     * @author dbarra@agetic.gob.bo
     */
    async save() {
      if (this.$refs.form.validate()) {
        // eslint-disable-next-line
        let data = { ...({}, this.form) };
        data.accion = data.accion.join('|');
        if (this.actualizarRegistro) {
          let peticion = `${this.url}?sujeto=${this.registroAnterior.sujeto}`;
          peticion = `${peticion}&objeto=${this.registroAnterior.objeto}`;
          peticion = `${peticion}&accion=${this.registroAnterior.accion}`;
          peticion = `${peticion}&app=${this.registroAnterior.app}`;
          const response = await this.$service.patch(peticion, data);
          if (response.finalizado) {
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success('El registro fue actualizado exitosamente');
          } else {
            this.$message.error(
              response.mensaje
                || 'Ocurrio un error al tratar de enviar la data'
            );
          }
        } else {
          const response = await this.$service.post(this.url, data);
          if (response.finalizado) {
            this.$store.commit('closeModal');
            this.updateList();
            this.$message.success('El registro fue agregado correctamente');
          } else {
            this.$message.error(
              response.mensaje
                || 'Ocurrio un error al tratar de enviar la data'
            );
          }
        }
      } else {
        this.$message.error('Faltan campos por llenar');
      }
    },
  },
  components: {
    CrudTable
  },
};
</script>
