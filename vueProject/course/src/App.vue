<template>
  <div id="app" class="g-container">
    <div class="g-view-container">
<!--      所有一级路由都会在这里切换-->
      <router-view></router-view>
    </div>
    <div class="g-footer-container">
      <c-tabbar>

      </c-tabbar>
    </div>
  </div>
</template>

<script>
  import CTabbar from 'components/tabbar'
export default {
  name: 'App',
  components:{
    CTabbar,
  }
}
</script>

<style>
  /*这里写的样式 会在所有页面采用*/
  *{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  /*取消router-link的下划线  router-link最后都会转化成a标签*/
  a{
    text-decoration: none;
  }
</style>
