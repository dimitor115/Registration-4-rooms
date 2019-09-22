import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import RoomsManagment from './views/administrator/RoomsManagment.vue'
import StudentRegistration from './views/StudentRegistration.vue'
import Playground from './Playground.vue'

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
      path: '/managment',
      name: 'managment',
      component: RoomsManagment,
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
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
})
