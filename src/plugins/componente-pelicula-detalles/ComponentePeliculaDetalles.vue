<template>
  <v-card elevation="0">
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
            style="width: 100px; height: auto;"
          ></v-img>
        <b>Título: </b> {{ peliculaSeleccionada.Title }}<br/>
        <b>Año: </b> {{ peliculaSeleccionada.Year }}<br/>
        <b>Director: </b> {{ peliculaSeleccionada.Director }}<br/>
        <b>Actores: </b> {{ peliculaSeleccionada.Actors }}<br/>

      </v-card-text>
    </v-card>
  </v-card>
</template>
<script>
/* eslint-disable max-lines */

export default {
  mixins: [],
  props: {
    peliculaSeleccionada: {
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
  components: {
  },
  watch: {
  },
  data() {
    return {
    };
  },
  destroyed() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
};
</script>
<style lang="scss" src="./componentepeliculadetalles.scss"></style>
