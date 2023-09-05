<template>
  <a-icon
    v-if="ICONS[icon]"
    :name="ICONS[icon]"
    :class="className"
    :color="color"
    :size="size"
    outlined
    style="margin: 5px"
  />
</template>
<script>
export default {
  name: 'v-icon-component',
  props: {
    icon: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: 'white',
    },
    className: {
      type: String,
      default: '',
    },
  }
};
</script>
