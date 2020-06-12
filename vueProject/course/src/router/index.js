import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/online_course/home'
import Detail from '@/page/online_course/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/online_course/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/online_course/detail',
      name: 'Detail',
      component: Detail
    }
  ]
})
