import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/administrator/Login.vue'
import StudentRegistration from './views/StudentRegistration.vue'
import AdminContainer from './views/administrator/AdminContainer.vue'
import RoomsManagement from './views/administrator/RoomsManagement.vue'
import RegistrationLiveView from './views/administrator/RegistrationLiveView.vue'
import AdminsManagement from './views/administrator/AdminsManagment.vue'

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
      path: '/admin/login',
      name: 'Login',
      component: Login,
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
          path: '/admin/live',
          name: 'Admin | Live',
          component: RegistrationLiveView,
        },
        {
          path: '/admin/administratorzy',
          name: 'Admin | Administratorzy',
          component: AdminsManagement,
        },
      ]
    },
  ],
})
