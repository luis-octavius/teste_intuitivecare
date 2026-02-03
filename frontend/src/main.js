import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'

import 'primevue/resources/themes/saga-blue/theme.css'; // Theme
import 'primevue/resources/primevue.min.css'; // Core css
import 'primeicons/primeicons.css'; // Icons

const app = createApp(App);

app.use(createPinia());
app.use(router)
app.mount('#app');
