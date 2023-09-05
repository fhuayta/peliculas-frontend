import axios from 'axios';

export default {
  methods: {
    getModules(roles, rol = null) {
      if (Array.isArray(roles) && roles.length > 0) {
        if (rol) {
          const menu = roles.find(item => {
            if (item.rol === rol) return item.modulos;
          });
          return menu.modulos;
        } else {
          return roles[0].modulos;
        }
      } else {
        return [];
      }
    },
    getRoles(roles) {
      if (Array.isArray(roles)) {
        return roles.map(item => item);
      } else {
        return [];
      }
    },
    getRol(roles) {
      if (Array.isArray(roles) && roles.length > 0) {
        return roles[0];
      }
    },
    exit() {
      console.log('llamando modal confirm');
      this.$confirm({
        text: '¿Está seguro de salir del sistema?',
        callbackOk: () => {
          this.logout();
        }
      });
    },
    setData (datos) {
      return new Promise((resolve, reject) => {
        try {
          if (datos.persona) this.$storage.set('user', datos.persona);
          this.$storage.set('token', datos.access_token);
          this.$storage.set('roles', this.getRoles(datos.roles));
          const { rol } = this.getRol(datos.roles);
          this.$storage.set('rol', rol);
          this.$storage.set('modules', datos.roles);
          this.$storage.set('menu', [...this.getModules(datos.roles)]);
          this.$store.commit('setMenu', [...this.getModules(datos.roles)]);
          this.$vuetify.theme.dark = this.$storage.get('theme');
          this.$storage.set('theme', this.$vuetify.theme.dark);
          this.$storage.set('sidenav', true);
          this.$store.commit('setProfile', datos.persona);
          resolve(true);
        } catch (error) {
          reject(error.message);
        }
      });
    },
    setInfoToken () {
      return new Promise((resolve) => {
        const payload = this.getPayload();
        const actualDate = Math.round(new Date().getTime() / 1000);
        this.$storage.set('ttl', payload.exp - payload.iat);
        this.$storage.set('t', actualDate);
        resolve(true);
      });
    },
    async credentials(usuario, contrasena, data = {}) {
      try {
        let credentials = data;
        if (usuario && contrasena) {
          this.loadingCredentials = true;
          credentials = await this.$service.post('auth', {
            usuario,
            contrasena: btoa(encodeURI(contrasena))
          });
          if (!credentials || credentials.codigo) {
            this.loadingCredentials = false;
            throw new Error(
              credentials?.mensaje
                || 'Por favor revise su configuración a Internet.'
            );
          }
        }
        const { datos } = credentials;
        this.$storage.set('drawer', false);
        await this.setData(datos); // Credenciales
        await this.setInfoToken(); // definimos tiempo de vida de token
        const politicas = await this.$service.get('autorizacion/permisos');
        if (!politicas.isError && politicas.datos) {
          this.$storage.set('policy', politicas.datos);
          for (const p of politicas.datos) {
            // eslint-disable-next-line no-await-in-loop
            await this.$Casbin.enforcer
              .addPolicy(p[0], p[1], p[2], p[3], p[4], p[5]);
          }
        }
        this.$store.commit('setAuth', true);
        this.$store.commit('setSidenav', true);
        this.$store.commit('setMain', true);
        this.$router.push('/home');
      } catch (err) {
        this.$message.error(
          err ? err.message ?? err.mensaje
          ?? 'Ocurrio un error' : 'Ocurrio un error'
        );
      }
    },
    getPayload () {
      if (this.$storage.get('token')) {
        const jwtStr = this.$storage.get('token').split('.')[1];
        return JSON.parse(atob(jwtStr));
      }
      return null;
    },
    cleanData(store) {
      store.commit('setDefault');
    },
    async logout(router, store) {
      let response = {};
      if (this.$storage.get('token')) {
        const request = {
          url: `${this.$baseServer}logout`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.$storage.get('token')}`
          }
        };
        try {
          response = await axios(request);
          response = response.data;
        } catch (e) {
          console.error('logout error: ', e.message);
        }
      }
      const storevuex = store || this.$store;
      router = router || this.$router;
      const theme = this.$storage.get('theme');
      this.$storage.removeAll();
      this.$storage.set('theme', theme);
      storevuex?.commit('resetProfile');
      if (this.$Casbin.enforcer) {
        const politicas = await this.$Casbin.enforcer.getPolicy();
        if (politicas) {
          politicas.forEach(p => {
            this.$Casbin.enforcer
              .removePolicy(p[0], p[1], p[2], p[3], p[4], p[5]);
          });
        }
      }
      this.cleanData(storevuex);
      const { path } = router && router.history ? router.history.current : null;
      if (response.url) {
        window.location.href = response.url;
        return;
      }
      if (path !== '/login') {
        router.push('/login');
      }
    }
  }
};
