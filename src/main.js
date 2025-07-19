import './assets/style/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import {createDirective} from "@/util/directive.js"

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, {
  locale: zhCn
})

createDirective(app)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
