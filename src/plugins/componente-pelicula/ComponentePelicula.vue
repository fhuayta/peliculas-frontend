<template>
  <v-card elevation="2">
    <v-card style="height: 250px;">
      <v-img
        :src="pelicula.Poster"
        :alt="`Titulo: ${pelicula.Title}`"
        :title="`Titulo: ${pelicula.Title}`"
        style="width: 100px; height: auto;"
      ></v-img>
      <v-card-title>{{ pelicula.Title }}</v-card-title>
      <v-card-subtitle>
        <v-btn color="secondary" small
          @click="verDetalles()">
          <v-icon-component icon="info" class="brightnessText--text" color="primary"/>
          <span class="brightnessText--text">Ver más</span>
        </v-btn>
      </v-card-subtitle>
    </v-card>
    <v-dialog v-model="dialogDetalles" width="700">
      <!-- <componente-pelicula-detalles :pelicula-seleccionada="pelicula"></componente-pelicula-detalles> -->
      <v-card>
        <v-card-title>
          Detalles de Pelicula
        </v-card-title>
        <v-card-subtitle>
          {{ peliculaSeleccionada.imdbID }}
        </v-card-subtitle>
        <v-card-text>
          <v-img
              :src="peliculaSeleccionada.Poster"
              :title="`Titulo: ${peliculaSeleccionada.Title}`"
              style="width: 300px; height: auto;"
            ></v-img>
          <b>Título: </b> {{ peliculaSeleccionada.Title }}<br/>
          <b>Año: </b> {{ peliculaSeleccionada.Year }}<br/>
          <b>Director: </b> {{ peliculaSeleccionada.Director }}<br/>
          <b>Actores: </b> {{ peliculaSeleccionada.Actors }}<br/>

        </v-card-text>
      </v-card>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary"
            @click="dialogDetalles = false"
            >
            <v-icon-component icon="close" color="primary"/>
              Cerrar
            </v-btn>
        </v-card-actions>
    </v-dialog>
  </v-card>
</template>
<script>
/* eslint-disable max-lines */
// import ComponentePeliculaDetalles from '../componente-pelicula-detalles/ComponentePeliculaDetalles.vue';

export default {
  mixins: [],
  props: {
    pelicula: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        imdbID: 'tt0062614',
        // eslint-disable-next-line max-len
        Poster: 'https://m.media-amazon.com/images/M/MV5BOWQwZmIyM2UtMDVhYi00ZjVlLWEyMDUtMTkzNjQ5NDlkOTdhXkEyXkFqcGdeQXVyMjI3NTc3NDE@._V1_SX300.jpg',
        Title: 'Titulo 1',
        Type: 'Series',
        Year: '1981-2010',
      },
    },
  },
  watch: {
  },
  data() {
    return {
      dialogDetalles: false,
      peliculaSeleccionada: {},
    };
  },
  destroyed() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    async verDetalles() {
      console.log('--log-- DETALLES DE PELICULA');
      this.dialogDetalles = true;
      const peliculaSeleccionada = await this.$service.get('pelicula/' + this.pelicula.imdbID);
      console.log('--log--SEL = ', peliculaSeleccionada);
      this.peliculaSeleccionada = peliculaSeleccionada.datos;
    }
  },
  // components: {
  //   ComponentePeliculaDetalles,
  // }
};
</script>
<style lang="scss" src="./componentepelicula.scss"></style>
