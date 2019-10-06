import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import StudentRegistration from './views/StudentRegistration.vue'
import Playground from './Playground.vue'
import RoomsManagement from './views/administrator/RoomsManagement.vue'
import RegistrationLiveView from './views/administrator/RegistrationLiveView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/management',
      name: 'management',
      component: RoomsManagement,
    },
    {
      path: '/live',
      name: 'live',
      component: RegistrationLiveView,
    },
    {
      path: '/registration',
      name: 'registration',
      component: StudentRegistration,
    },
    {
      path: '/playground',
      name: 'playground',
      component: Playground,
    }
  ],
})
