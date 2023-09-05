<template>
  <v-card elevation="0" class="pl-3 pr-5">
    <v-card elevation="0" class="primary--text mb-3 mt-3"
      >Datos Personales</v-card
    >
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-input-text-field
          color="primary"
          required
          v-on:blur="handleTouched('nroDocumento')"
          :rules="
            touched.nroDocumento ? $validate(['required', 'nro_documento']) : []
          "
          v-model="form.nroDocumento"
          :disabled="deshabilitarCarnet"
          label="Nro. Documento (*)"
          outlined
          maxlength="15"
          :tabindex="2"
          dense
          class="tooltip"
        >
          <template slot="append">
            <v-tooltip top max-width="300" color="primary">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon x-small>
                  <v-icon-component
                    icon="error"
                    :size="25"
                    class="primary--text"
                  />
                </v-btn>
              </template>
              <span class="fs8 brightnessText--text">
                <ul class="fs8">
                  <li>
                    Ingresa el número de documento, tal cual está en la cédula
                    de identidad.
                  </li>
                  <li>
                    Si el carnet tiene complemento (ej: 1K, 1E), ingrésalo así:
                    1234567-1K
                  </li>
                  <li>
                    Si la cédula de identidad es de extranjero, introdúcela
                    incluyendo E- (ej: E-123456)
                  </li>
                </ul>
              </span>
            </v-tooltip>
          </template>
        </v-input-text-field>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-input-text-field
          className="uppercase"
          color="primary"
          required
          :rules="
            !deshabilitarCampos && touched.nombres
              ? $validate(['required'])
              : []
          "
          v-model="form.nombres"
          :disabled="deshabilitarCampos"
          :label="`${!deshabilitarCampos ? 'Nombre (*)' : 'Nombre'}`"
          outlined
          v-on:blur="handleTouched('nombres')"
          :tabindex="3"
          dense
          v-on:keyup="emitText('update:nombres', form.nombres, 'uppercase')"
        />
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-input-text-field
          @value="e => form.primerApellido = e"
          className="uppercase"
          color="primary"
          :rules="
            !deshabilitarCampos && touched.primerApellido
              ? rules.primerApellido
              : []
          "
          v-model="form.primerApellido"
          :init="form.primerApellido"
          :disabled="deshabilitarCampos"
          :label="
            `${!deshabilitarCampos ? 'Primer Apellido (*)' : 'Primer Apellido'}`
          "
          outlined
          v-on:blur="handleTouched('primerApellido')"
          :tabindex="4"
          dense
          v-on:keyup="emitText('update:primerApellido', form.primerApellido, 'uppercase')"
        />
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <v-input-text-field
          className="uppercase"
          color="primary"
          :rules="
            !deshabilitarCampos && touched.segundoApellido
              ? rules.segundoApellido
              : []
          "
          v-model="form.segundoApellido"
          :disabled="deshabilitarCampos"
          :label="
            `${
              !deshabilitarCampos ? 'Segundo Apellido (*)' : 'Segundo Apellido'
            }`
          "
          outlined
          v-on:blur="handleTouched('segundoApellido')"
          :tabindex="5"
          dense
          v-on:keyup="
            emitText(
              'update:segundoApellido',
              form.segundoApellido,
              'uppercase',
            )
          "
        />
      </v-col>
      <v-col cols="12" lg="12" md="12" sm="12" xs="12">
        <!-- SE UTILIZA COMPONENTE ESPECIALIZADO PARA FECHAS -->
        <date-input
          v-model="form.fechaNacimiento"
          :fecha="persona.fechaNacimiento"
          :label="
            `${
              !deshabilitarCampos ? 'Fecha Nacimiento (*)' : 'Fecha Nacimiento'
            }`
          "
          min-date="1950-01-01"
          required
          :disabled="deshabilitarCampos"
          @value="obtenerFecha"
        ></date-input>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import DateInput from '@/plugins/date-input/DateInput.vue';
import validate from '@/common/mixins/validate';

export default {
  name: 'FormPersona',
  props: {
    touched: {
      type: Object,
      default: () => ({
        nombres: false,
        primerApellido: false,
        segundoApellido: false,
        nroDocumento: false,
        fechaNacimiento: false,
      }),
    },
    persona: {
      type: Object,
      default: () => ({
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        nroDocumento: null,
        fechaNacimiento: null,
      }),
    },
    deshabilitarCampos: {
      type: Boolean,
      default: false,
    },
    deshabilitarCarnet: {
      type: Boolean,
      default: false,
    },
    ciudadania: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [validate],
  data() {
    return {
      valid: false,
      menu: false,
      form: {
        id: null,
        nombres: null,
        primerApellido: null,
        segundoApellido: null,
        nroDocumento: null,
        fechaNacimiento: null,
        estado: 'ACTIVO',
      },
      rules: {
        required: [v => !!v || 'Este campo es requerido.'],
        primerApellido: [
          v => !!this.form.segundoApellido || !!v || 'Este campo es requerido.',
          v => !!this.form.segundoApellido
            || /^[A-Za-zÁ-ÖÚ-öú-ÿñÑ'\s]+$/.test(v)
            || 'Existen caracteres no válidos.',
        ],
        segundoApellido: [
          v => !!this.form.primerApellido || !!v || 'Este campo es requerido.',
          v => !!this.form.primerApellido
            || /^[A-Za-zÁ-ÖÚ-öú-ÿñÑ'\s]+$/.test(v)
            || 'Existen caracteres no válidos.',
        ],
      },
    };
  },
  watch: {
    'form.nombres'() {
      this.$emit('value', this.form);
    },
    'form.primerApellido'() {
      this.$emit('value', this.form);
    },
    'form.segundoApellido'() {
      this.$emit('value', this.form);
    },
    'form.nroDocumento'() {
      this.$emit('value', this.form);
    },
    'form.fechaNacimiento'() {
      this.$emit('value', this.form);
    },
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.persona));
  },
  methods: {
    obtenerFecha(val) {
      this.form.fechaNacimiento = val;
    },
    handleTouched(name) {
      this.$emit('touch', { name });
    },
    emitText(model, value, opt) {
      if (opt.indexOf('uppercase') >= 0) value = (value || '').toUpperCase();
      this.$emit(model, value.trim());
    },
  },
  components: {
    DateInput
  },
};
</script>
<style lang="scss">
@import '../../scss/variables.scss';
.tooltip {
  .v-input__append-inner {
    position: absolute;
    margin: 0;
    right: 0;
    margin-top: -5px !important;
    margin-right: -11px;
    border-radius: 50%;
  }
}
.uppercase input {
  text-transform: uppercase;
}
</style>
