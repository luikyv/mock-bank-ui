import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import './assets/main.css'
import { handleError } from './errors'

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App).use(router).use(pinia)
app.config.errorHandler = handleError

app.mount('#app')
