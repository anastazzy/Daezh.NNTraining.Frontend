import { createApp } from 'vue/dist/vue.esm-bundler'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import modelHub from './ws/modelHub'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

axios.defaults.baseURL = '/api/'
const app = createApp(App)

app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

modelHub.start();

app.use(router)
app.mount('#app')
