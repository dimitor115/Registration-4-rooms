import Vue from 'vue'
import store from '@/store'
import Router, { Route } from 'vue-router'

const Login = () => import('./views/administrator/Login.vue')
const StudentRegistration = () => import('./views/StudentRegistration.vue')
const AdminContainer = () => import('./views/administrator/AdminContainer.vue')
const RoomsManagement = () => import('./views/administrator/RoomsManagement.vue')
const RegistrationLiveView = () => import('./views/administrator/RegistrationLiveView.vue')
const AdminsManagement = () =>  import('./views/administrator/AdminsManagment.vue')

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
