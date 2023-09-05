<template>
  <div class="login--app d-flex flex-column align-center justify-center">
    <div
      class="main d-flex align-center justify-center"
      :class="{
        'mt-10': ['md', 'lg', 'xl'].includes($vuetify.breakpoint.name),
        'mt-2': ['xs', 'sm'].includes($vuetify.breakpoint.name),
        'flex-row': $vuetify.breakpoint.name !== 'xs',
        'flex-column': $vuetify.breakpoint.name === 'xs',
      }"
    >
      <div class="description d-flex flex-column align-center justify-center">
        <div class="text d-flex flex-column align-center justify-center">
          <v-container
            fluid
            :style="
              ['md', 'lg', 'xl'].includes($vuetify.breakpoint.name)
                ? 'max-width: 75%; text-align: center'
                : 'text-align: center'
            "
          >
            <h1 class="primary--text font-weight-bold">
              {{ title }}
            </h1>
          </v-container>
          <!-- <v-container
            fluid
            :style="['md', 'lg', 'xl'].includes($vuetify.breakpoint.name) ?
              'max-width: 80%; text-align: justify' : 'text-align: justify'"
            class="pt-3"
          >
            <span class="font-weight-light fs10">
              Esta seccion esta para colocar un texto medianamente largo,
              para explicar lo que hara el sistema y sobre los modulos que
              tendra dicho sistema.
            </span>
          </v-container> -->
        </div>
      </div>
      <v-divider vertical v-if="!['xs'].includes($vuetify.breakpoint.name)" />
      <div class="credentials d-flex flex-column align-center justify-center">
        <template v-if="!['xs'].includes($vuetify.breakpoint.name)">
          <span class="iniciar-sesion primary--text font-weight-medium">
            Iniciar Sesión
          </span>
        </template>
        <v-form
          lazy-validation
          ref="loginForm"
          class="d-flex flex-column align-center justify-center"
          :class="{
            'mt-5': $vuetify.breakpoint.name === 'xs',
          }"
        >
          <v-input-text-field
            v-model="form.user"
            label="Usuario"
            :autofocus="$vuetify.breakpoint.name !== 'xs'"
            @keypress.enter.native="loginWithCredentials"
            :width="$vuetify.breakpoint.smAndDown ? 300 : 370"
            :clearable="false"
            :rules="[
              (val) => !!val || 'El nombre del usuario no puede estar vacio',
            ]"
          >
          </v-input-text-field>
          <v-input-text-field
            v-model="form.password"
            label="Contraseña"
            @keypress.enter.native="loginWithCredentials"
            :full-width="false"
            :width="$vuetify.breakpoint.smAndDown ? 300 : 370"
            v-on:append="() => (showPassword = !showPassword)"
            :append-icon="
              showPassword ? ICONS.visibility : ICONS.visibility_off
            "
            :type="!showPassword ? 'password' : 'text'"
            :rules="[(val) => !!val || 'La contraseña no puede estar vacio']"
          >
          </v-input-text-field>
          <v-btn
            color="primary"
            class="rounded-lg"
            depressed
            :loading="loadingCredentials"
            height="50"
            block
            :disabled="loadingCredentials"
            @click="loginWithCredentials"
          >
            <span
              class="brightnessText--text"
              style="text-transform: capitalize; font-size: 1rem"
            >
              Ingresar
            </span>
          </v-btn>

          <div
            class="mt-8 mb-3"
            :style="{
              width: `${$vuetify.breakpoint.smAndDown ? '300px' : '350px'}`,
            }"
          >
            <v-row align="center">
              <v-divider class="mr-4"></v-divider>
              O
              <v-divider class="ml-4"></v-divider>
            </v-row>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Auth from './mixins/auth';

const TITLE = 'Películas - Examen';
export default {
  mixins: [Auth],
  data() {
    return {
      title: TITLE,
      form: {
        user: 'ADMINISTRADOR-TECNICO',
        password: '123',
      },
      loadingCredentials: null,
      showPassword: false,
      show: false,
      error: '',
      error_description: '',
      code: '',
      token: '',
    };
  },
  mounted() {
    this.error = '';
    this.$nextTick(async () => {
      this.$vuetify.theme.dark = this.$storage.get('theme');
      this.error = this.$route.query?.error;
      this.error_description = this.$route.query?.error_description;
      if (this.error) {
        if (this.error === 'Usuario no habilitado.') {
          this.error = 'usuario_no_habilitado';
        } else if (this.error_description === 'End-User aborted interaction') {
          this.error = 'Inicio de sesión con ciudadanía cancelado.';
        } else {
          this.error = this.$route.query.error_description || this.$route.query.error;
        }
        this.$router.replace({ query: null }); // this.$router.push(this.$route.path);
        return;
      }
      // eslint-disable-next-line
      const { code, state, session_state } = this.$route.query;
      // eslint-disable-next-line
      if (code && state && session_state) {
        // eslint-disable-next-line
        const tokenCiudadania = await this.tokenCiudadania(
          code,
          state,
          session_state,
        );
        if (tokenCiudadania.data.access_token) {
          this.token = tokenCiudadania.data.access_token;
          this.$storage.set('token', this.token);
        }
        try {
          const request = this.makeProfileRequest();
          let credentials = await axios(request);
          credentials = {
            data: {
              datos: {
                ...credentials.data.datos,
                access_token: this.token,
              },
            },
          };
          await this.credentials(null, null, credentials.data);
        } catch (err) {
          this.$message.error(err.message);
        }
      } else {
        if (this.$route.path !== '/login') this.$router.push('/login');
      }
    });
  },
  methods: {
    makeProfileRequest() {
      const request = {
        method: 'GET',
        url: `${this.$baseServer}usuarios/cuenta/perfil`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      return request;
    },
    loginWithCredentials() {
      if (this.$refs.loginForm.validate()) {
        this.credentials(this.form.user, this.form.password, null);
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    loginCiudadania() {
      const urlCiudadania = `${process.env.VUE_APP_API_CIUDADANIA}/ciudadania-auth`;
      window.location.href = urlCiudadania;
    },
    cerrarCiudadania() {
      this.$storage.set('token', this.code);
      this.logout();
    },
    async tokenCiudadania(code, state, sessionState) {
      const request = {
        method: 'GET',
        url: `${this.$baseServer}ciudadania-autorizar`,
        headers: {
          accept: 'application/json',
        },
        params: {
          code: code,
          state: state,
          session_state: sessionState,
        },
      };
      const response = await axios(request);
      return response;
    },
  },
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.login--app {
  .main {
    margin-top: -40px;
    .credentials {
      .iniciar-sesion {
        font-weight: 500;
        font-size: 1.4rem;
        margin-bottom: 10px;
        max-width: 80% !important;
      }
    }
    .description {
      .text {
        margin: auto;
        span {
          user-select: none;
          &:first-child {
            font-weight: 500;
            font-size: 1.1rem;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          &:last-child {
            font-size: 0.83rem;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 601px) {
  .login--app {
    .header {
      background-position: top center;
      background-size: contain;
      width: 100%;
      height: 200px;
    }
    .main {
      .credentials {
        width: 50%;
      }
      .description {
        width: 50%;
        .text {
          width: 70%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: left;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) and (min-width: 1px) {
  .login--app {
    .header {
      background-position: top center;
      background-size: contain;
      width: 100%;
      height: 200px;
    }
    .main {
      .credentials {
        width: 100%;
      }
      .description {
        width: 100%;
        .text {
          width: 85%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: justify;
            }
          }
        }
      }
    }
  }
}
</style>
