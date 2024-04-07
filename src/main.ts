import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import routes from './router/router';
import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(createPinia())
  .use(routes)
  .use(vuetify)
  .mount('#app');

