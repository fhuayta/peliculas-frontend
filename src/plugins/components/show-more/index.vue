<template>
  <v-tooltip :content-class="className" bottom :color="color" :max-width="maxWidth">
    <template v-slot:activator="{ on, attrs }">
      <span
        :color="color"
        v-bind="attrs"
        v-on="on"
        class="ma-0 pa-0 fs9"
      >
        <template v-if="!image">
          Ver mas
        </template>
        <template v-else>
          <v-icon-component
            className="cursor--pointer primary--text"
            icon="image_search"
          />
        </template>
      </span>
    </template>
    <span class="black--text" v-if="!image">
      {{ text }}
    </span>
    <v-img
      v-else
      :src="url"
      :lazy-src="URL_LAZY_IMAGES"
      width="200"
      height="100"
      @error="loadError()"
    >
    </v-img>
  </v-tooltip>
</template>
<script>

const NAME = 'v-show-more';

export default {
  name: NAME,
  props: {
    color: {
      type: String,
      default: 'white'
    },
    text: {
      type: String,
    },
    URL_LAZY_IMAGES: {
      type: String
    },
    image: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    maxWidth: {
      type: Number,
      default: 250
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    loadError() {
      this.$message.error('No se encontró la imagen de la pregunta');
    },
  }
};
</script>
