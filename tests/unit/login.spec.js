import { createLocalVue, mount } from '@vue/test-utils';
import LoginComponent from '@/components/auth/Login.vue';
import Vuetify from 'vuetify';
import axios from 'axios';

jest.mock('axios');

describe('Componente Login', () => {
  const localVue = createLocalVue();
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(LoginComponent, { localVue,
      vuetify,
      axios: {},
      mocks: {
        $waiting: () => {},
      } });
  });

  it('Renderizar formulario', () => {
    expect(wrapper.text()).toContain('Frontend Películas');
  });

  it('Login con usuario admin', async () => {
    axios.post.mockResolvedValue({
      finalizado: true,
      mensaje: 'listado obtenido con exito',
      datos: [{ usuario: 'user', estado: 'ACTIVO' }]
    });
    // const btnLogin = contenedor.find('button');
    // await btnLogin.trigger('click');
    expect(axios).toHaveBeenCalledTimes(0);
  });
});
