<template>
  <div>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      flat
      color="backgroundColor"
      height="60"
      class="pa-0 ma-0 navbar"
    >
      <v-btn
        v-if="auth"
        icon
        color="primary"
        @click="setDrawer"
      >
        <v-icon-component icon="menu"/>
      </v-btn>
      <span
        class="primary--text fs10 font-weight-bold"
        v-if="!['/login'].includes($route.path)">
        {{ title }}
      </span>

      <v-spacer></v-spacer>
      <v-btn color="primary" @click="redirigirAPeliculas()">Películas</v-btn>

      <v-card elevation="0">
        <v-btn
          id="btnHelp"
          icon text
        >
          <v-icon-component
            icon="help_outline"
            class="primary--text"
            color="primary"
          />
        </v-btn>
        <v-btn
          id="btnTheme"
          icon text
          @click="setTheme"
        >
          <v-icon-component
            :icon="$vuetify.theme.dark ? 'dark_mode' : 'light_mode'"
            class="primary--text"
            color="primary"
          />
        </v-btn>
        <v-btn
          v-if="auth && !['/login'].includes($route.path)"
          id="btnSettings"
          text depressed icon
          class="primary--text" @click="settings"
        >
          <v-icon-component icon="settings" color="primary"/>
        </v-btn>
      </v-card>
          <!-- SECCION DE SETTINGS -->
          <v-dialog
            v-model="modalSettings"
            content-class="settings"
            :width="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 300 : 200"
            :overlay-opacity="
              ['xs', 'sm'].includes($vuetify.breakpoint.name) ? .7 : 0
            "
          >
            <v-card elevation="0">
              <template v-for="(item, i) in aSettings">
                <!-- SI TIENE SUBMENU -->
                <template v-if="item.submenu">
                  <v-list-group
                    :key="i"
                    :value="true"
                    color="primary"
                    class="item--group--settings"
                    disabled
                    :prepend-icon="ICONS[item.icono]"
                    link
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title class="fontColor--text ml-0 fs9">
                          {{ item.label }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <section style="margin-left: 60px">
                      <v-radio-group v-model="radioGroup">
                        <v-radio
                          color="success"
                          v-for="subItem in item.submenu"
                          @click="setRol(subItem.rol)"
                          :key="subItem.rol"
                          class="font-weight-regular pb-5"
                          :label="$util.toCapitalize(subItem.rol)"
                          :value="subItem.rol"
                        ></v-radio>
                      </v-radio-group>
                    </section>

                  </v-list-group>
                </template>
                <!-- SI NO TIENE SUBMENU -->
                <template v-else>
                  <v-list-item
                    :key="item.url"
                    color="primary"
                    dense
                    link
                    @click="redirect(item)"
                  >
                    <v-list-item-icon class="bloque--configuraciones ml-1 mr-1">
                      <v-icon-component
                        :icon="item.icono"
                        class="primary--text"
                      />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="ruta--menu fontColor--text fs9">
                        {{ item.label }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </template>

            </v-card>
          </v-dialog>
    </v-app-bar>
  </div>
</template>

<script>
import systemAppearance from 'system-appearance';
import { mapState } from 'vuex';
import Auth from '@/components/auth/mixins/auth';

const TITLE = 'Películas';
export default {
  mixins: [Auth],
  data: () => ({
    clipped: false,
    title: TITLE,
    modalSettings: false,
    rutas: [],
    roles: [],
    themeVerify: false,
    aSettings: [],
    radioGroup: null,
    rol: ''
  }),
  methods: {
    redirigirAPeliculas() {
      this.$router.push('/peliculas');
    },
    setDrawer () {
      this.$storage.set('drawer', !this.drawer);
      this.$root.$refs.AppSideBar.updateStateSidebar();
    },
    darkModeListener () {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = true;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    lightModeListener () {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = false;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    settings () {
      this.roles = this.$storage.get('roles');
      const rol = this.$storage.get('rol');
      const modules = this.$storage.get('modules');
      this.radioGroup = rol;
      const user = this.$storage.getUser();
      this.aSettings = [
        {
          icono: 'person',
          url: '/admin/perfil',
          label: `
            ${user.nombres}
            ${user.primerApellido ? user.primerApellido : ''}
            ${user.segundoApellido ? user.segundoApellido : ''}
          `
        },
        {
          icono: 'switch_account',
          label: 'Cambiar de rol',
          submenu: [...modules]
        },
        {
          icono: 'logout',
          label: 'Cerrar sesion'
        }
      ];
      this.modalSettings = !this.modalSettings;
    },
    setTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$storage.set('theme', this.$vuetify.theme.dark);
    },
    async setRol(rol) {
      try {
        this.modalSettings = false;
        const menus = this.getModules(this.$storage.get('modules'), rol);
        this.$storage.set('menu', menus);
        this.$storage.set('rol', rol);
        this.$store.commit('setMenu', menus);
        if (this.$route.path !== '/home') this.$router.push('/home');
        if (this.$route.path === '/home') this.reload();
      } catch (error) {
        this.$message.error(error?.message || 'Ocurrio un problema');
      }
    },
    reload () {
      this.$store.commit('setMain', false);
      this.$nextTick(() => {
        this.$store.commit('setMain', true);
      });
    },
    redirect (subItem) {
      this.modalSettings = false;
      if (subItem && subItem.hasOwnProperty('url')) {
        if (this.$route.path.replace(/\//gi, '') !== subItem.url) {
          this.$router.push(subItem.url);
        }
      } else if (subItem.icono === 'logout') {
        this.$confirm({
          text: '¿Está seguro de cerrar la sesión?',
          callbackOk: () => this.logout()
        });
      } else {
        this.$message.error('Ocurrio un error, el menu tiene una estructura diferente');
      }
    }
  },
  computed: {
    ...mapState(['auth', 'drawer'])
  },
  mounted() {
    systemAppearance(
      this.darkModeListener, this.lightModeListener, this.hasNoSupport
    );
    this.$nextTick(async () => {
      this.rol = this.$storage.get('rol')?.rol;
      this.rutas = this.$storage.get('menu');
      this.$vuetify.theme.dark = this.$storage.get('theme');
      this.themeVerify = true;
    });
  },
  created() {
    this.$root.$refs.AppNavbar = this;
  }
};
</script>

<style lang="scss">
@import '../scss/variables.scss';

.navbar {
  .v-toolbar__content {
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
  }
}

.item--group {
  .v-list-group__header__prepend-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: var(--color_fondo) !important;
    border-radius: 10px;
    min-width: 60px !important;
    width: 60px !important;
    min-height: 60px !important;
    height: 60px !important;
  }
}

.setting {
  .v-list-group__header__append-icon {
    display: none !important;
  }
}

@media screen and (min-width: 768px) {
  .settings {
    position: fixed;
    z-index: 10;
    min-width: 300px;
    right: 0;
    top: 65px;
    padding: 20px 0px 20px 0px;
    border-radius: 7px !important;
    background: $white;
    transition: top 0.3s ease-in;
    .v-list-group__header__append-icon {
      display: none !important;
    }
  }
}

</style>
