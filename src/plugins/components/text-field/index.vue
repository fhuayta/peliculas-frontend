<template>
  <div>
    <label class="label-input-text">{{ label }}</label>
    <v-text-field
      v-if="!showField"
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      solo
      :disabled="disabled"
      :autofocus="autofocus"
      :full-width="fullWidth"
      :class="`input-text-component mt-2 ${className}`"
      :style="width ? `width: ${width}px` : ''"
      outlined
      flat
      :ref="reference"
      :id="id"
      :counter="counter"
      :rules="rules"
      :hint="hint"
      :type="type"
      :color="color"
      :oninput="oninput"
      :dense="dense"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="clearable"
      @keyup="$emit('keyup', keyup)"
      @focus="$emit('focus', focus)"
      @blur="$emit('blur', blur)"
      @change="$emit('change', change)"
      :append-icon="appendIcon ? appendIcon : null"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      @click:append="$emit('append', append)"
    >
      <template v-slot:append>
        <slot name="append"></slot>
      </template>
    </v-text-field>
  </div>
</template>
<script>
const NAME = 'v-input-text-field';
export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    change: {
      type: Function,
      default: () => {}
    },
    keyup: {
      type: Function,
      default: () => {}
    },
    focus: {
      type: Function,
      default: () => {}
    },
    blur: {
      type: Function,
      default: () => {}
    },
    counter: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: ''
    },
    reference: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: ''
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: null
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: null
    },
    append: {
      type: Function,
      default: () => {}
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    // init: null,
    value: null,
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: null,
    oninput
  },
  mounted() {
    this.$nextTick(() => {
      // this.input = this.value;
      this.showField = this.hasContenidoSlot;
    });
  },
  // watch: {
  //   value(value) {
  //     this.input = value;
  //   }
  // },
  data: () => ({
    input: null,
    showField: {
      type: Boolean,
      default: true
    },
  }),
  computed: {
    hasContenidoSlot () {
      return !!this.$slots.contenido;
    }
  }
};
</script>
<style lang="scss">
@import '../../../scss/variables.scss';

.label-input-text {
  font-weight: 500;
}

.input-text-component {
  label {
    display: none !important;
  }
}
</style>
