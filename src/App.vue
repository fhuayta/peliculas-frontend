<template>
  <v-app>
    <app-navbar></app-navbar>
    <app-sidebar v-if="auth"></app-sidebar>
    <v-main v-if="main" class="main--content" :class="getPath()">
      <div :class="getClasses()" class="main">
        <transition :name="transitionName" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-main>
    <app-footer />
    <app-confirm />
    <app-alert />
    <app-loading />
    <app-messages />
    <app-progress />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import AppProgress from '@/plugins/progress-bar/AppProgress.vue';
import AppConfirm from '@/plugins/modal/AppConfirm.vue';
import AppAlert from '@/plugins/modal/AppAlert.vue';
import AppLoading from '@/plugins/loading/AppLoading.vue';
import AppMessages from '@/plugins/message/AppMessages.vue';
import Auth from '@/components/auth/mixins/auth';
import AppNavbar from './layout/AppNavbar.vue';
import AppFooter from './layout/AppFooter.vue';
import AppSidebar from './layout/AppSidebar.vue';

// Páginas que no necesitan autenticación/token/sesión
const PageNoLogin = ['login', 'desbloqueo', 'peliculas'];

export default {
  name: 'App',
  mixins: [Auth],
  components: {
    AppProgress,
    AppConfirm,
    AppAlert,
    AppLoading,
    AppMessages,
    AppNavbar,
    AppFooter,
    AppSidebar
  },
  created() {
    if (this.$storage.existUser()) {
      this.$store.commit('setAuth', true);

      if (this.$storage.exist('sidenav')) {
        this.$store.commit('setSidenav', this.$storage.get('sidenav'));
      }
    }
  },
  data() {
    return {
      transitionName: '',
    };
  },
  methods: {
    getClasses() {
      let className = '';
      if (!['xs', 'sm'].includes(this.$vuetify.breakpoint.name)) {
        className = 'pl-5 pr-5';
      }
      if (this.$route.path === '/home') {
        className += ' d-flex flex-row align-center justify-center';
      }
      if (this.$route.path === '/login') {
        className += ' d-flex flex-row align-center justify-center isLogin';
      }
      return className;
    },
    getPath() {
      return ['/login', '/admin/home'].includes(this.$route.path)
        ? 'initial-view'
        : 'pages';
    }
  },
  computed: {
    ...mapState(['auth', 'sidenav', 'main']),
  },
  watch: {
    $route(to, from) {
      if (this.$storage.get('menu')) {
        const ruta = this.$storage
          .get('menu')
          .find(menu => menu.url === location.hash.substr(1));
        if (ruta) {
          this.$store.commit(
            'setCurrentBackground',
            this.$vuetify.theme.dark
              ? ruta.propiedades.color_dark
              : ruta.propiedades.color_light,
          );
        }
      }
      if (to.path === '/login') this.$vuetify.theme.dark = false;
      if (
        !this.$storage.existUser()
        && PageNoLogin.indexOf(to.path.substring(1)) === -1
      ) {
        this.logout();
      }
      if (to.path !== '/login' && from.path !== '/login') {
        this.transitionName = 'fade';
      } else {
        this.transitionName = '';
      }
      if (to.path === '/login' && this.$storage.existUser()) {
        this.$router.push(this.$storage.get('menu')[0].url);
      }
    },
  },
};
</script>

<style lang="scss">
.main--content {
  .v-main__wrap {
    display: flex;
    min-width: 100px;
    flex-direction: row;
    justify-content: center;
  }
}
.initial-view {
  .v-main__wrap {
    align-items: center;
  }
}
.pages {
  .v-main__wrap {
    align-items: flex-start;
  }
}
</style>
