import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import routes from './router/router';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives,
});


const pinia = createPinia()

// const sessionData = localStorage.getItem('sessionData');
// if (sessionData) {
//   pinia.state.value = JSON.parse(sessionData);
// }

createApp(App)
  .use(pinia)
  .use(routes)
  .use(vuetify)
  .mount('#app');

