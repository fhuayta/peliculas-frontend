<template>
  <v-dialog
    :value="dialog"
    @input="$emit('input', $event)"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title class="ma-0 pa-1">
        <v-container fluid>
          <v-row no-gutters>
            <v-col
              align="start"
              justify="center"
              :cols="11"
              class="d-flex
                flex-row
                align-center
                text-sm
                primary--tex
                primary--text"
            >
              <v-icon-component class="m-2" icon="add"></v-icon-component>
              <span class="fs10 pl-2">
                {{ titulo }}
              </span>
            </v-col>
            <v-col :cols="1">
              <v-tooltip bottom color="primary">
                <template v-slot:activator="{ on }">
                  <v-btn icon color="primary" v-on="on" @click.stop="closeModal">
                    <v-icon-component icon="close" class="primary--text"/>
                  </v-btn>
                </template>
                <span class="brightnessText--text">Cerrar ventana emergente</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-divider></v-divider>
      <slot></slot>
      <v-card-actions>
        <v-container fluid>
          <v-row>
            <v-col
              justify="start"
              xs="12"
              sm="12"
              md="4"
              lg="4"
              cols="12"
            />
            <v-col sm="12" xs="12" md="4" lg="4" cols="12">
              <v-btn block @click.stop="closeModal" elevation="0">
                <v-icon-component icon="cancel"></v-icon-component>
                Cancelar
              </v-btn>
            </v-col>
            <v-col sm="12" xs="12" md="4" lg="4" cols="12">
              <v-btn
                dark
                block
                color="primary"
                @click.stop="execAction"
                elevation="0"
              >
                <v-icon-component icon="check"></v-icon-component>
                {{ textoEjecutar }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    dialog: Boolean,
    titulo: String,
    textoEjecutar: {
      type: String,
      default: 'Enviar',
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-dialog');
    },
    execAction() {
      this.$emit('accion');
    },
  }
};
</script>
