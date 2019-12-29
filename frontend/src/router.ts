import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/administrator/Home.vue'
import StudentRegistration from './views/StudentRegistration.vue'
import AdminContainer from './views/administrator/AdminContainer.vue'
import RoomsManagement from './views/administrator/RoomsManagement.vue'
import RegistrationLiveView from './views/administrator/RegistrationLiveView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/zapisy'
    },
    {
      path: '/zapisy',
      name: 'Zapisy',
      component: StudentRegistration,
    },
    {
      path: '/admin',
      component: AdminContainer,
      children: [
        {
          path: '/',
          redirect: '/admin/live'
        },
        {
          path: '/admin/zarzadzanie',
          name: 'Admin | Zarządzanie',
          component: RoomsManagement,
        },
        {
          path: '/admin/login',
          name: 'Login',
          component: Home,
        },
        {
          path: '/admin/live',
          name: 'Admin | Live',
          component: RegistrationLiveView,
        },
      ]
    },
  ],
})
