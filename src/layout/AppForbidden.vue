<template>
  <v-card elevation="0" color="backgroundColor" class="not-found">
    <v-card
      elevation="0"
      class="backgroundColor
        not-found__message
        text-center
        d-flex
        flex-column
        align-center
        justify-center"
    >
      <h1 class="number">
        <span class="primary--text">4</span>0<span class="primary--text">3</span>
      </h1>
      <h4>{{ mensaje }}</h4>
      <v-btn color="primary" outlined class="mt-3" @click="handleClickHome">
        <v-icon-component icon="arrow_back" class="primary--text"/>
        <span class="primary--text">Volver a la pagina principal</span>
      </v-btn>
    </v-card>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    mensaje: null,
  }),
  mounted() {
    this.mensaje = this.$route.params?.mensaje
      ?? 'Ups !!! No tienes permiso para acceder a esta página';
  },
  methods: {
    handleClickHome() {
      this.$router.push('/home');
    },
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
