<template>
  <div class="w100">
    <label class="label-input-autocomplete">{{ label }}</label>
    <v-autocomplete
      v-model="select"
      :item-color="itemColor"
      :autofocus="autofocus"
      :color="color"
      :item-text="itemText"
      :item-value="itemValue"
      :dense="dense"
      :class="`input-select-component mt-2 ${className}`"
      outlined
      flat
      ref="autocomplete"
      :items="items"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="$nextTick(() => {
        $emit('change', change)
      });"
      @blur="$nextTick(() => {
        $emit('blur', blur)
      });"
      @focus="$nextTick(() => {
        $emit('focus', focus)
      });"
      :multiple="multiple"
      :id="id"
      :rules="rules"
      :no-data-text="noDataText"
      :hint="hint"
      :append-icon="appendIcon ? appendIcon : ICONS.arrow_drop_down"
      :clearable="clearable"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
    >
      <slot name="contenido"></slot>
    </v-autocomplete>
  </div>
</template>
<script>
const NAME = 'v-input-autocomplete';
export default {
  name: NAME,
  props: {
    label: {
      type: String,
      default: ''
    },
    itemColor: {
      type: String,
      default: 'primary'
    },
    noDataText: {
      type: String,
      default: 'No existen registros para mostrar'
    },
    color: {
      type: String,
      default: 'primary'
    },
    placeholder: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: null
    },
    itemValue: {
      type: String,
      default: null
    },
    dense: {
      type: Boolean,
      default: false
    },
    change: {
      type: Function,
      default: () => {}
    },
    blur: {
      type: Function,
      default: () => {}
    },
    focus: {
      type: Function,
      default: () => {}
    },
    className: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: null
    },
    multiple: {
      type: Boolean,
      default: null
    },
    rules: {
      type: Array,
      default: () => []
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
    clickAppend: {
      type: Function,
      default: () => {}
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    init: null,
    disabled: {
      type: Boolean,
      default: false
    },
    search: null
  },
  methods: {
    addListener () {
      const elem = this.$refs.autocomplete.$el;
      let typing;
      const timer = 1000;
      elem.onkeydown = () => {
        clearTimeout(typing);
        typing = setTimeout(() => {
          this.$emit('search', this.$refs.autocomplete.internalSearch);
        }, timer);
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.select = this.init;
      this.addListener();
    });
  },
  watch: {
    init (value) {
      this.select = value;
      this.$emit('value', value);
    },
    select (value) {
      this.$emit('value', value);
    }
  },
  data: () => ({
    select: null,
    loading: false
  })
};
</script>
<style lang="scss">
@import '../../../scss/variables.scss';
.label-input-autocomplete {
  font-weight: 500;
}
</style>
