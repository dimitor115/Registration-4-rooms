import Vue from 'vue'
import store from '@/store'
import Router, { Route } from 'vue-router'
import Login from './views/administrator/Login.vue'
import StudentRegistration from './views/StudentRegistration.vue'
import AdminContainer from './views/administrator/AdminContainer.vue'
import RoomsManagement from './views/administrator/RoomsManagement.vue'
import RegistrationLiveView from './views/administrator/RegistrationLiveView.vue'
import AdminsManagement from './views/administrator/AdminsManagment.vue'

Vue.use(Router)

const router = new Router({
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
      path: '/login',
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

const ADMIN_PREFIX = '/admin'

router.beforeEach(async (to: Route, from: Route, next: Function) => {

  const isAdminPage = to.path.startsWith(ADMIN_PREFIX)
  if(!isAdminPage) {
    return next()
  }

  const isUserSignIn = !!store.state.user.data.email
  if(isUserSignIn) {
    return next()
  }

  // try {
  //   await store.dispatch('fetchUserData')
  //   return next()
  // } catch {  
  //   return next('login')
  // }

  return next('/login')

})

export default router
