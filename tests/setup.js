import Vue from 'vue';
import Vuetify from 'vuetify';
import Message from '@/plugins/message/message';
import Storage from '@/plugins/storage';
import Util from '@/plugins/util';
import Progress from '@/plugins/progress-bar/progress';
import MaterialIcons from '@dbetka/vue-material-icons'; // sets just the max size
import Components from '@/plugins/component';
import Service from '@/plugins/service';

Vue.use(Vuetify);
Vue.use(Message);
Vue.use(Storage);
Vue.use(Util);
Vue.use(Progress);
Vue.use(MaterialIcons);
Vue.use(Components);
Vue.use(Service, {
  apiUrl: process.env.VUE_APP_API_URL,
  baseServer: process.env.VUE_APP_API_URL,
  authToken: 'Bearer test',
  filterResponse: (response) => {
    if (response.datos && response.finalizado) {
      return response.datos;
    }
    if ('finalizado' in response && !response.finalizado) {
      Message.error(response.message);
      return response.datos;
    }
    return response;
  },
  errorFormat: 'mensaje'
});
