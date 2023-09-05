<template>
  <v-card elevation="0" class="crud-table backgroundColor">
    <v-row no-gutters class="mt-2 mb-2">
      <v-col cols="12" class="d-flex flex-row align-center justify-start">
        <slot name="extra-row"></slot>
      </v-col>
      <slot name="customFilters"></slot>
      <v-col
        cols="12"
        class="d-flex flex-row align-center justify-space-between"
      >
        <!-- Section buttons -->
        <div class="d-flex justify-content-start ml-4">
            <h2>{{title}}</h2>
        </div>
        <v-card
          elevation="0"
          :class="
            ['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'fs8' : 'fs10'
          "
          class="subtitle fontColor--text pl-4 d-flex
            flex-row align-center justify-center"
        >
          <v-icon-component :icon="icon" class="mr-2" />
        </v-card>
        <v-card elevation="0" class="d-flex flex-row">
          <slot name="buttons"></slot>
          <!-- Section Filters -->
          <v-card
            elevation="0"
            class="btn-filter"
            :class="{ active: showFilter }"
            v-if="filters.length > 0"
          >
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                  @click.native="filtrar()"
                  :id="idFilter"
                  class="primary--text btn-filter"
                  v-on="on"
                >
                  <v-icon-component icon="search" class="primary--text" />
                </v-btn>
              </template>
              <span class="brightnessText--text"> Buscar </span>
            </v-tooltip>
          </v-card>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                @click.native="getData(true)"
                :class="`primary--text ${idRefresh} mr-3`"
                v-on="on"
              >
                <v-icon-component icon="refresh" class="primary--text"/>
              </v-btn>
            </template>
            <span class="brightnessText--text"> Actualizar listado </span>
          </v-tooltip>
        </v-card>
        <!-- END Section buttons -->
        <!-- Modal Add/Edit -->
        <v-dialog v-model="modal" persistent :max-width="widthModal">
          <v-card class="crud-dialog">
            <slot name="form">Agregue su formulario aquí</slot>
          </v-card>
        </v-dialog>
        <!-- END Modal Add/Edit -->
      </v-col>
      <!-- Section Filter -->
      <v-col
        cols="12"
        lg="12"
        md="12"
        sm="12"
        class="mt-3"
        v-if="showFilter && filters.length > 0"
      >
        <transition name="slide-fade">
          <v-container fluid class="container--filter backgroundColor">
            <v-row no-gutters style="width: 97%">
              <v-col
                  :cols="12"
                  :class="[
                  !['xs'].includes($vuetify.breakpoint.name)
                    ? 'd-flex flex-row align-center justify-start flex-wrap'
                    : ''
                ]"
              >
                <template v-for="(filter, idx) in filters">
                  <v-input-text-field
                    :key="filter.field"
                    dense
                    outlined
                    :disabled="filter.disabled"
                    color="primary"
                    ref="searchTextField"
                    class="ml-2 mr-2 mb-1"
                    :autofocus="idx === 0"
                    v-if="filter.type === 'text'"
                    v-model="search[filter.field]"
                    :label="filter.label"
                    :style="
                      !['xs'].includes($vuetify.breakpoint.name) ?
                      'width: 300px; max-width: 300px' : ''"
                    hide-details
                  ></v-input-text-field>
                  <v-input-select
                    @value="e => search[filter.field] = e"
                    :key="filter.field"
                    color="primary"
                    item-color="primary"
                    v-if="filter.type === 'array'"
                    v-model="search[filter.field]"
                    :init="search[filter.field]"
                    class="ml-2 mr-2 mb-1"
                    :label="filter.label"
                    :items="filter.values"
                    v-on:change="getData"
                    item-text="text"
                    item-value="value"
                    :disabled="filter.disabled"
                    :clearable="filter.clear"
                    :multiple="filter.multiple"
                    dense
                    :style="
                      !['xs'].includes($vuetify.breakpoint.name) ?
                      'width: 300px; max-width: 300px' : ''"
                    outlined
                    hide-details
                    :append-icon="ICONS.search"
                  ></v-input-select>
                  <v-input-autocomplete
                    @value="e => search[filter.field] = e"
                    :key="filter.field"
                    color="primary"
                    item-color="primary"
                    v-if="filter.type === 'autocomplete'"
                    v-model="search[filter.field]"
                    :init="search[filter.field]"
                    class="ml-2 mr-2 mb-1"
                    :label="filter.label"
                    :items="filter.values"
                    item-text="text"
                    item-value="value"
                    :disabled="filter.disabled"
                    :clearable="filter.clear"
                    :multiple="filter.multiple"
                    dense
                    :style="
                      !['xs'].includes($vuetify.breakpoint.name) ?
                      'width: 300px; max-width: 300px' : ''"
                    outlined
                    hide-details
                    :append-icon="ICONS.search"
                  ></v-input-autocomplete>
                  <v-input-select
                    v-if="filter.type === 'asyncautocomplete'"
                    @value="e => search[filter.field] = e"
                    v-model="search[filter.field]"
                    :key="search[filter.field]"
                    item-value="id" :items="auxSearch[filter.field]" outlined
                    dense hide-details
                    :clearable="filter.clear"
                    :label="filter.label"
                    :disabled="filter.disabled"
                    class="ml-2 mr-2 mb-1"
                    :style="
                      !['xs'].includes($vuetify.breakpoint.name) ?
                      'width: 300px; max-width: 300px' : ''"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-input-text-field
                            v-model="searchTerm[filter.field]"
                            :placeholder="filter.placeholder"
                           >
                          </v-input-text-field>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template slot="selection" slot-scope="data">
                      {{ filter.itemView.map(x => data.item[x]).join(' ') }}
                    </template>
                    <template slot="item" slot-scope="data">
                      {{ filter.itemView.map(x => data.item[x] + ' ').join(' ') }}
                    </template>
                  </v-input-select>
                </template>
              </v-col>

              <v-tooltip bottom color="primary" v-if="showFilterOptions">
                <template v-slot:activator="{ on }">
                  <v-btn
                      @click.native="handleCleanFilters()"
                      v-on="on"
                      color="gray"
                      dark
                      small
                      absolute
                      right
                      fab
                  >
                    <v-icon-component icon="close"></v-icon-component>
                  </v-btn>
                </template>
                <span>Cerrar filtro/búsqueda</span>
              </v-tooltip>
            </v-row>
          </v-container>
        </transition>
      </v-col>
      <!-- END Section Filter -->
    </v-row>
    <v-skeleton-loader
      :loading="loading"
      transition="fade-transition"
      type="table"
    >
      <v-data-table
        :headers="getHeaders"
        :items="items"
        :items-per-page="10"
        :loading="loading"
        @update:page="requestData"
        @update:items-per-page="handleItemsPerPageOptions"
        :options.sync="options"
        class="data--table"
        :server-items-length="totalItems"
        loading-text="Cargando registros..."
        rowsPerPageText="filas por pagina"
        no-results-text="No se encontraron registros que coincidan"
        no-data-text="No hay resultados"
        :mobile-breakpoint="600"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50],
          itemsPerPageAllText: 'todos',
          itemsPerPageText: 'Filas por página',
        }"
      >
        <!-- ALL ITEMS -->
        <template v-slot:item="{ item }" v-if="custom">
          <slot name="items" :items="item"></slot>
        </template>
        <!-- BUTTONS FOOTER -->
        <template v-slot:top>
          <div v-if="false">
            <v-select
              label="Ir a la pág."
              outlined
              dense
              no-data-text="No hay registros"
              hide-details
              color="color1"
              v-model="pageNumber"
              :items="numbers"
              class="input--search_page"
              @change="goToPage"
            >
            </v-select>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-card>
</template>
<script>
/* eslint-disable max-lines */
import { mapState } from 'vuex';
import actions from '@/plugins/crud-table/mixins/crud-table';

export default {
  mixins: [actions],
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      default: process.env.VUE_APP_API_URL,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    idRefresh: {
      type: String,
      default: 'btn-refresh-list',
    },
    idFilter: {
      type: String,
      default: 'btn-filter-list',
    },
    order: {
      type: Array,
      default: () => [],
    },
    filters: {
      type: Array,
      default: () => [],
    },
    widthModal: {
      type: Number,
      default: 480,
    },
    attribute: {
      type: String,
      default: 'filas',
    },
    showFilterOptions: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: 'Gestion del crudtable',
    },
    tipo: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
  },
  watch: {
    'options.sortDesc'(ant, value) {
      if (ant !== value && this.loaded) {
        this.getData();
      }
    },
    activeSearch: {
      handler(value) {
        if (value) {
          this.getData();
          this.activeSearch = false;
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      showFilter: false,
      search: {},
      activeSearch: false,
      totalItems: 0,
      items: [],
      loading: true,
      pageNumber: null,
      loaded: false,
      itemsPerPage: null,
      selected: [],
      numbers: [],
      options: {
        pagina: 1,
        itemsPerPage: 10,
      },
      showFilterActive: this.showFilter,
    };
  },
  destroyed() {
    this.loaded = false;
  },
  mounted() {
    this.$nextTick(() => {
      try {
        this.getData();
      } catch (error) {
        this.$message.error(
          error.message ?? error.mensaje ?? 'Ocurrio un error'
        );
      }
    });
  },
  computed: {
    ...mapState(['modal', 'icon']),

    getHeaders() {
      const items = [];
      this.headers.map(el => {
        el.align = 'left';
        items.push(el);
      });
      return items;
    },
  },
  methods: {
    goToPage() {
      this.options.pagina = this.pageNumber;
      this.getData();
    },
    requestData(data) {
      this.options.pagina = data;
      this.pageNumber = data;
      this.getData();
    },
    handleItemsPerPageOptions(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.getData();
    },
    /**
     * @function handleCleanFilters
     * @description Limpiar los filtros
     * @author dbarra@agetic.gob.bo
     */
    handleCleanFilters() {
      this.search = {};
      this.getData();
      this.showFilter = false;
    },
    /**
     * @function getData
     * @description Obtener los registros para el crudTable
     * @author dbarra@agetic.gob.bo
     */
    async getData(refresh = false) {
      try {
        this.loading = true;
        if (this.url.includes('null')) {
          this.setPropsDataTable();
          return;
        }
        if (this.itemsPerPage) { this.options.itemsPerPage = this.itemsPerPage; }
        let data = await this.$service.list(
          this.url,
          this.getQuery({
            options: this.options,
            search: this.search,
            tipo: this.tipo,
            refresh: refresh
          }),
        );
        if (data?.datos && !data.datos.errores) {
          data = data.datos;
          const items = data[this.attribute];
          const n = parseInt(data.total / this.options.itemsPerPage);
          const isHigher = n * this.options.itemsPerPage >= data.total;
          this.numbers = [
            ...Array(n > 0 ? (isHigher ? n : n + 1) : 1).keys(),
          ].map(item => item + 1);
          const { total } = data;
          (items || []).map(el => {
            if (el.estado !== undefined) {
              el.active = el.estado === 'INACTIVO' ? 'INACTIVE' : 'ACTIVE';
            }
          });
          this.setPropsDataTable(false, items, total);
          setTimeout(() => {
            this.loaded = true;
          }, 1000);
        } else {
          this.setPropsDataTable();
          throw new Error(data.mensaje);
        }
      } catch (error) {
        this.$message.error(
          error.message ?? error.mensaje ?? 'Ocurrio un error'
        );
      }
    },
    setPropsDataTable(loading = false, items = [], count = 0) {
      this.loading = loading;
      this.items = items;
      this.$store.commit('setItemsDataTable', items);
      this.totalItems = count;
    },
  },
};
</script>
<style lang="scss" src="./crudtable.scss"></style>
