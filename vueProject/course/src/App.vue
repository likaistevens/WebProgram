<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
