// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import './config/rem'
import 'assets/scss/index.scss';
import 'swiper/css/swiper.css'
import VueLazyload from 'vue-lazyload';

fastclick.attach(document.body);

// 设置后全局可以使用lazyLoad
Vue.use(VueLazyload, {
  preLoad: 1,   // 其实是个小数，1表示页面内容完全暴露的时候加载，一点几表示还没划到图片位置就开始加载,零点几表示滑到图片位置，过一会儿才开始加载
  error: require('assets/img/error.png'),
  loading: require('assets/img/loading.gif'),
  attempt: 1,
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
