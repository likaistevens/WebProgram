import Vue from 'vue'
import Router from 'vue-router'
import Index from 'pages/index'

// 这是一次性全部引入的写法， 通常采用动态引入 即 component: () => import('pages/mall/home/index'),
// 详情可参照vue-router官方文档
// import courseHome from 'pages/online-course/home'
// import courseDetail from 'pages/online-course/detail'
//
// import mallHome from 'pages/mall/home/index';
// import mallCategory from 'pages/mall/category/index';
// import mallCart from 'pages/mall/recommend/index';
// import mallPersonal from 'pages/mall/personal/index';
// import mallSearch from 'pages/mall/search/index';
// import mallProduct from 'pages/mall/product/index';


Vue.use(Router)

const mallRoutes = [
  {
    path: '/mall/home',
    name: 'mallHome',
    component: () => import('pages/mall/home/index'),
    // 二级目录写法
    children: [
      {
        name: 'home-product',
        // 二级目录的path最前面一定不能有 /
        path: 'product/:id',
        component: () => import('pages/mall/product/index'),
      }
    ]
  },
  {
    path: '/mall/category',
    name: 'mallCategory',
    component: () => import('pages/mall/category/index'),
  },
  {
    path: '/mall/cart',
    name: 'mallCart',
    component: () => import('pages/mall/cart/index'),
  },
  {
    path: '/mall/personal',
    name: 'mallPersonal',
    component: () => import('pages/mall/personal/index'),
  },
  {
    path: '/mall/search',
    name: 'mallSearch',
    component: () => import('pages/mall/search/index'),
  },
];

export default new Router({
  routes: [
    // 不允许手动输入路径，手动输入路径都会跳转到起始页面
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/online-course/home',
      name: 'courseHome',
      component: () => import('pages/online-course/home'),
    },
    {
      path: '/online-course/detail',
      name: 'courseDetail',
      component: () => import('pages/online-course/detail'),
    },
    ...mallRoutes,
  ]
})
