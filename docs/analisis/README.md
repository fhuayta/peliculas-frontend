# Proyecto base frontend

Lista de la documentación técnica del proyecto.

### 1. Generación del Diagrama de componentes
Se utiliza la herramienta [vuese/cli](https://vuese.org/#vuese-cli) para la generación automática de la documentación.
* Instalar la herramienta de forma global con npm
  ```
  $ npm install -g @vuese/cli
  ```

* Desde la raiz del proyecto base ejecutar:
  ```
  $ vuese gen
  ```
  Se generará la documentación en el folder *website*.

* Visualizar la documentación:
  ```
  $ vuese serve --open
  ```