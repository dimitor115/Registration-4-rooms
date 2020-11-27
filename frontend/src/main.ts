import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import ElementUI from 'element-ui'
Vue.use(ElementUI)

import App from './App.vue'
import router from './router'
import store from '@/store'
import { setAuthorization } from './shared/api'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

import '@/assets/style.scss'

const token = localStorage.getItem('userToken')
if (token) {
  setAuthorization(token)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
