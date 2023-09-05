# Proyecto base Frontend Vue

## Estructura de directorios

```
.
├─docs/                         # directorio con la documentacion del proyecto base
├─public/                       # directorio con archivos estáticos(imágenes, etc.)
├─src/
|  ├── assets/                  # directorio de recursos de estilos y fuentes
|  ├── common/                  # directorio con utilidades comunes (seguridad, validaciones, etc)
|  |    └── mixins
|  ├── components/              # directorio de componentes del proyecto base
|  |    ├── auth/               # componente de autenticación
|  |    |    └── mixins         # mixins con métodos comunes de autenticación
|  |    ├── home/               # componente de vista inicial para usuario logueado
|  |    ├── personas/           # componente de formulario de personas
|  |    ├── polititicas/        # componente de gestión de políticas
|  |    |    └── mixins         # mixins con métodos comunes para gestión de políticas
|  |    └── usuarios/           # componente de gestión de usuarios
|  |         └── mixins         # mixins con métodos comunes para gestión de usuarios
|  ├── directives/index.js      # archivo con directivas generales del proyecto base
|  ├── layout/                  # directorio con componentes de layout
|  |    └── mixins              # mixins con métodos comunes para componentes de layout
|  ├── plugins/                 # directorio con componentes comunes para vistas
|  |    ├── crud-table/         # componente CrudTable para listado y gestión de items
|  |    |    └── mixins         # mixins con métodos comunes para CrudTable
|  |    ├── date-input/         # componente DateInput para manejo estandarizado de inputs de fechas
|  |    ├── icon/               # componente VIconComponent para visualización de íconos
|  |    ├── loading/            # componente AppLoading indicador circular de carga
|  |    ├── message/            # componente AppMessages para mostrar mensajes en snack bar
|  |    ├── modal/              # componentes AppAlert, AppConfirm, AppDialog y modales
|  |    ├── progress-bar/       # componente AppProgress indicador lineal de progreso
|  |    ├── casbin.js           # archivo con métodos para gestionar reglas casbin
|  |    ├── service.js          # archivo que centraliza peticiones al backend con librería axios
|  |    └── storage.js          # archivo que gestiona acceso a LocalStorage
|  ├── router/                  # directorio de definiciones de rutas con librería vue-router
|  ├── scss/                    # directorio con definición de estilos css generales
|  ├── store/index.js           # archivo de manejo de estados Vuex
|  ├── App.vue                  # componente principal del proyecto
|  ├── index.html               # página estática HTML mostrada cuando no existe soporte para JS en el navegador
|  └── main.js                  # archivo principal que inicia los componentes y servicios del proyecto
├──tests                        # Directorio con test unitarios y de componentes
├──.husky                       # Directorio con reglas precommit para Husky
├──.Dockerignore
├──.env.example                 # Archivo con variables de entorno
├──.eslintrc.js                 # Archivo de definición de reglas eslint
├──.gitignore
├──.gitlab-ci.yml
├──.prettierrc.json             # Archivo con reglas de formateo para Prettier
├──.prettierignore
├──Dockerfile
├──LICENSE
├──package-lock.json
├──package.json
├──README.md
├──UPDATE.md
└──vue.config.js                # Archivo de configuración cargado automáticamente por @vue/cli-service

```