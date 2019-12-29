import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)

Vue.use(ElementUI)

Vue.config.productionTip = false

import '@/assets/style.scss'

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
