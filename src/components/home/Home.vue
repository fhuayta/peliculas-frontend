<template>
  <v-card color="backgroundColor" elevation="0" class="app-home">
    <div class="header">
      <v-img
        :max-width="250"
        contain
        :src="this.$vuetify.theme.dark ?
          './img/logoAgeticLight.png' : './img/logoAgeticDark.png'"
      />
    </div>
    <div class="logo"></div>
    <v-card elevation="0" color="backgroundColor"
      class="titulo-home">
      Bienvenido, {{ user.nombres }}
    </v-card>
    <v-card elevation="0" color="backgroundColor" class="rol-home">
      {{ rol }}
    </v-card>
  </v-card>
</template>

<script>

export default {
  data() {
    return {
      rol: null,
      user: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.rol = this.$storage.get('rol');
      this.user = this.$storage.getUser();
    });
  }
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';

.titulo-home {
  font-size: 2rem;
  padding-top: 30px;
  color: $primary !important;
  letter-spacing: 0;
  user-select: none;
  text-align: center;
}

.rol-home {
  font-size: 1rem;
  letter-spacing: 0;
  user-select: none;
  text-align: center;
  padding: 20px;
}

.app-home {
  max-width: 700px;
  margin: auto;
  height: 100%;
  width: 100%;
  .header {
    .v-image {
      margin: auto;
    }
  }
}

</style>
