<template>
  <v-card elevation="0" color="backgroundColor" >

    <!-- inicio de sesión -->
    <v-app-bar app>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="redirigirALogin()" v-if="!usuarioLogueado">Iniciar Sesión</v-btn>
      <v-btn color="primary" @click="cerrarSesion()" v-else>Cerrar Sesión</v-btn>
    </v-app-bar>

    <v-row>
      <!-- texto de búsqueda -->
      <v-col cols="12" sm="3" md="3" ></v-col>
      <v-col cols="12" sm="6" md="6" >
        <v-text-field
        style="margin-top: 20px;"
          v-model="busquedaTitulo"
          label="Buscar por título"
          maxlength="30"
          @keyup="textSearch($event)"
          :clearable="true"
          @click:clear="textSearch($event)"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="3" ></v-col>

      <!-- columnas con peliculas -->
      <v-col cols="12" sm="4" md="4"
        v-for="pelicula in peliculas" :key="pelicula.id">
        <componente-pelicula :pelicula="pelicula"></componente-pelicula>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import Auth from '@/components/auth/mixins/auth';
import ComponentePelicula from '../plugins/componente-pelicula/ComponentePelicula.vue';

export default {
  data: () => ({
    mensaje: 'Pantalla',
    busquedaTitulo: '',
    timer: undefined,
    options: {},
    peliculas: [],
    usuarioLogueado: null,
  }),
  mixins: [Auth],
  methods: {
    cerrarSesion() {
      this.$confirm({
        text: '¿Está seguro de cerrar la sesión?',
        callbackOk: () => this.logout()
      });
    },
    redirigirALogin() {
      this.$router.push('/login');
    },
    textSearch(e) {
      e;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.options.page = 1;
        this.cargaRegistros();
        // this.cargarPeliculas();
      }, this.getTiempoEsperaInputSearch());
    },
    async cargaRegistros() {
      if (!this.busquedaTitulo) {
        this.$message.warning('Debe ingresar un texto de búsqueda', { title: 'Aviso', theme: 'primary' });
        this.peliculas = [];
        return;
      }
      this.busquedaTitulo = this.busquedaTitulo.trim();
      const resultado = await this.$service.get('pelicula/lista?nombre=' + this.busquedaTitulo);
      if (resultado.finalizado) {
        this.peliculas = resultado.datos.filas;
        const { total } = resultado.datos;
        if (total > 0) {
          this.$message.success('Se encontraron peliculas para su búsqueda: ' + this.busquedaTitulo);
        } else {
          this.$message.error('No se encontraron registros para: ' + this.busquedaTitulo);
        }
      } else {
        this.$message.error('Error en la consulta');
        this.peliculas = [];
      }
    },
    getTiempoEsperaInputSearch () {
      return 800;
    },
  },
  components: {
    ComponentePelicula,
  },
  async mounted() {
    console.log('--log--Montamos ');
    this.$nextTick(async () => {
      this.usuarioLogueado = this.$storage.getUser();
    });
  },
};
</script>

<style lang="scss">
@import '../scss/variables.scss';
.not-found {
  background-size: cover;
  background-position: top center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  .not-found__message {
    box-shadow: 0 1px 4px 0 rgba($color: $black, $alpha: 0.1);
    padding: 30px;
    width: 100%;
    max-width: 680px;
    margin-top: -50px;
    h1 {
      font-weight: bold;
      font-size: 11rem;
      margin-top: 0;
      letter-spacing: 2px;
    }
    h4 {
      font-size: 1.3rem;
      font-weight: 300;
    }
  }
  @media screen and (max-width: 767px) and (min-width: 1px) {
    .number {
      line-height: 160px;
      font-size: 7rem !important;
    }
  }
  @media screen and (min-width: 768px) {
    .number {
      line-height: 160px;
    }
  }
}
</style>
