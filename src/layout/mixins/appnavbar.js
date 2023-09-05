export default {
  methods: {
    getLastColor() {
      const menu = this.$storage.get('selectedMenu');
      if (menu) {
        return menu.propiedades[
          this.$vuetify.theme.dark ? 'color_dark' : 'color_light'
        ];
      }
      return 'null';
    },
    addEventListener() {
      setTimeout(() => {
        const element = this.$refs.searchPath.$el;
        let typing;
        element.onkeydown = () => {
          clearTimeout(typing);
          typing = setTimeout(() => {
            this.mSearchPath();
          }, 500);
        };
      }, 100);
    },
    actualizarIcono() {
      const { path } = this.$route;
      if (this.$storage.get('menu') && !this.rutas) {
        this.rutas = this.$storage.get('menu');
      }
      if (this.rutas && this.rutas.length > 0) {
        let rutas = this.rutas.filter(item => item.url === path);
        if (rutas.length === 0) {
          this.rutas
            .filter(item => item.subModulo != null && item.subModulo.length > 0)
            .forEach(ruta => {
              rutas = rutas.concat(
                ruta.subModulo.filter(item => item.url === path),
              );
            });
        }
        if (rutas && rutas.length > 0) {
          this.menuIcon = rutas[0].propiedades && rutas[0].propiedades.icono
            ? rutas[0].propiedades.icono
            : null;
          this.$store.state.currentBackground = rutas[0].propiedades
            && rutas[0].propiedades.color_light
            && rutas[0].propiedades.color_light
            ? this.$vuetify.theme.dark
              ? rutas[0].propiedades.color_dark
              : rutas[0].propiedades.color_light
            : null;
        } else {
          this.menuIcon = 'home';
          this.$store.state.currentBackground = undefined;
        }
        this.$store.commit('setIcon', this.menuIcon);
      }
    },
    darkModeListener() {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = true;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    lightModeListener() {
      if (this.themeVerify || this.$storage.get('theme') == null) {
        this.$vuetify.theme.dark = false;
        this.$storage.set('theme', this.$vuetify.theme.dark);
      }
    },
    settings() {
      this.roles = this.$storage.get('roles');
      const subMenus = this.roles.map(item => {
        const obj = {};
        obj.rol = item;
        return obj;
      });
      const [firstElement] = this.roles;
      this.mRol = firstElement;
      this.aSettings = [
        {
          icono: 'person',
          url: '/admin/perfil',
          label: 'Perfil',
        },
        {
          icono: 'switch_account',
          label: 'Cambiar de rol',
          submenu: [...subMenus],
        },
        {
          icono: 'logout',
          label: 'Cerrar sesion',
        },
      ];
      this.modalSettings = !this.modalSettings;
    },
    mSearchPath() {
      if (this.searchPath.trim().length === 0) {
        this.rutas = this.$storage.get('menu');
      } else {
        this.rutas = this.$storage
          .get('menu')
          // eslint-disable-next-line max-len
          .filter(item => item.url.includes(this.searchPath.toLowerCase().trim()),);
        if (this.rutas.length === 0) {
          // Buscando en subMenus
          const subMenus = [];
          this.$storage.get('menu').filter(item => {
            if (item && item.subModulo) {
              // eslint-disable-next-line max-len
              const items = item.subModulo.find(subMenu => subMenu.url.includes(this.searchPath.toLowerCase().trim()),);
              if (items) subMenus.push(items);
            }
          });
          this.rutas = subMenus;
        }
      }
    },
    isActive(url) {
      return this.$route.path === url;
    },
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$storage.set('theme', this.$vuetify.theme.dark);
      this.$store.commit('setCurrentBackground', this.$vuetify.theme.dark);
      this.actualizarIcono();
    },
    setRol({ rol }) {
      this.modalSettings = false;
      this.$storage.set('rol', rol);
      const menus = this.getModules(this.$storage.get('modules'), rol);
      this.$storage.set('menu', menus);
      this.rol = this.$storage.get('rol');
      this.$store.commit('setMenu', menus);
      if (this.$route.path !== '/home') this.$router.push('/home');
      if (this.$route.path === '/home') this.reload();
    },
    reload() {
      this.$store.commit('setMain', false);
      this.$nextTick(() => {
        this.$store.commit('setMain', true);
      });
    },
    showApps() {
      this.rutas = this.$storage.get('menu');
      this.apps = !this.apps;
    },
    redirect(subItem) {
      this.apps = false;
      this.modalSettings = false;
      this.searchPath = '';
      if (subItem && subItem.hasOwnProperty('url')) {
        if (this.$route.path.replace(/\//gi, '') !== subItem.url) {
          this.$router.push(subItem.url);
          setTimeout(() => {
            this.actualizarIcono();
          }, 100);
        }
      } else {
        if (subItem.icono === 'logout') {
          this.$confirm({
            text: '¿Está seguro de cerrar la sesión?',
            callbackOk: () => {
              this.modalSettings = false;
              this.logout();
            }
          });
        }
      }
    },
    hasNoSupport() {
      this.appearance = null;
      console.warn(
        // eslint-disable-next-line max-len
        'You specified no preference for a color scheme or your browser does not support it.',
      );
    },
  },
};
