/* eslint-disable */

export default {
  methods: {
    $validate(rules = []) {
      const validations = [];
      for (let i in rules) {
        if (rules[i] === 'required') {
          validations.push(this.$validateRequired);
        }
        if (rules[i] === 'email') {
          validations.push(this.$validateEmail);
        }
        if (rules[i] === 'url') {
          validations.push(this.$validateUrl);
        }
        if (rules[i] === 'nro_documento') {
          validations.push(this.$validateNroDocumento);
        }
      }
      return validations;
    },
    $validateRequired(v) {
      if (Array.isArray(v) && v.length === 0) {
        return 'Este campo es requerido';
      }
      return !!v || 'Este campo es requerido';
    },
    $validateEmail(v) {
      return (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        !v ||
        'El formato de correo no es válido'
      );
    },
    $validateUrl(v) {
      return (
        /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(
          v,
        ) || 'El formato de la url no es válido'
      );
    },
    $validateNroDocumento(v) {
      return (
        /^([0-9](\-[0-9a-zA-Z]{2})?)+$/.test(v) ||
        'Debe ingresar un documento válido'
      );
    },
  },
};
