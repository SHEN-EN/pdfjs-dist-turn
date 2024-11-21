import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './mock/index'
createApp(App).use(router).mount('#app')
