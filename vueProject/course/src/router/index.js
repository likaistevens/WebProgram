import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/online-course/home'
import Detail from '@/page/online-course/detail'
import Index from '@/page/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/online-course/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/online-course/detail',
      name: 'Detail',
      component: Detail
    }
  ]
})
