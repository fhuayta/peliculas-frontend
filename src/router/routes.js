import { $Casbin } from '@/plugins/casbin';

const getStorage = key => {
  const appName = process.env.VUE_APP_SITENAME || 'app';
  const data = window.localStorage.getItem(`${appName}_${key}`);
  try {
    return JSON.parse(data);
  } catch (Exception) {
    return data;
  }
};

const isAllowed = (to, from, next) => {
  const rol = getStorage('rol');
  const user = getStorage('user');
  if ($Casbin.enforcer) {
    const [sub, obj, act] = [rol || user, to.path, 'read'];
    $Casbin.enforcer
      .enforce(sub, obj, act)
      .then(permitido => {
        if (permitido) {
          next();
        } else {
          next({
            path: '/403',
            replace: true,
          });
        }
      })
      .catch(() => {
        next(false);
      });
  } else {
    const tmpInt = window.setInterval(() => {
      if ($Casbin.enforcer) {
        window.clearInterval(tmpInt);
        $Casbin.enforcer.enforce(rol, to.path, 'read').then(permitido => {
          if (permitido) {
            next();
          } else {
            next({
              path: '/403',
              replace: true,
            });
          }
        });
      }
    }, 100);
  }
};

const groupRoute = (prefix, routes) => routes.map(route => {
  route.path = `${prefix}${route.path}`;

  return route;
});

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/auth/Login.vue'),
  },
  // {
  //   path: '/admin/home',
  //   name: 'Home',
  //   component: () => import('../components/home/Home'),
  //   beforeEnter: isAllowed,
  // },
  // {
  //   path: '/admin/perfil',
  //   name: 'Perfil',
  //   component: () => import('../components/usuarios/Perfil.vue'),
  //   beforeEnter: isAllowed,
  // },
  // {
  //   path: '/admin/politicas',
  //   name: 'Políticas',
  //   component: () => import('../components/politicas'),
  //   beforeEnter: isAllowed,
  // },
  // {
  //   path: '/admin/usuarios',
  //   name: 'Usuarios',
  //   component: () => import('../components/usuarios'),
  //   beforeEnter: isAllowed,
  // },
  ...groupRoute('/admin', [
    {
      path: '/home',
      name: 'Home',
      component: () => import('../components/home/Home.vue'),
      beforeEnter: isAllowed,
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: () => import('../components/usuarios/Perfil.vue'),
      beforeEnter: isAllowed,
    },
    {
      path: '/parametros',
      name: 'Parametros',
      component: () => import('../components/parametros/index.vue'),
      beforeEnter: isAllowed,
    },
    {
      path: '/politicas',
      name: 'Políticas',
      component: () => import('../components/politicas/index.vue'),
      beforeEnter: isAllowed,
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      component: () => import('../components/usuarios/index.vue'),
      beforeEnter: isAllowed,
    },
    {
      path: '/modulos',
      name: 'Mdulos',
      component: () => import('../components/modulos/index.vue'),
      beforeEnter: isAllowed,
    },
    {
      path: '/roles',
      name: 'Roles',
      component: () => import('../components/roles/index.vue'),
      beforeEnter: isAllowed,
    },
  ]),
  {
    path: '/404',
    name: 'notfound',
    component: () => import('../layout/AppNotFound.vue'),
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('../layout/AppForbidden.vue'),
  },
  {
    path: '/desbloqueo',
    name: 'desbloqueo',
    component: () => import('../layout/AppDesbloqueo.vue'),
  },
  {
    path: '/peliculas',
    name: 'peliculas',
    component: () => import('../layout/AppPeliculas.vue'),
  },
  {
    path: '*',
    redirect: '/admin/home',
  },
];

export default routes;
