<template>
  <div class="home">
    <header class="g-header-container">
<!--      所有组件都需要放在container里面。 因为此项目，定位都是依靠提前写好container用container来定位。否则，就会遵循自然流布局-->
      <home-header></home-header>
    </header>

    <home-slider/>
    <div class="g-backtop-container"></div>
<!--    放置一个router-view，此路由下的二级路由会在这里切换    一级路由切换的位置在入口App.vue-->
    <router-view></router-view>
  </div>
</template>

<script>
  import HomeHeader from './header';
  import HomeSlider from './slider';
    export default {
        name: "mallHome",

      components: {
          HomeHeader,
          HomeSlider,
      }
    }
</script>

<style lang="scss" scoped>
  // @import 中如果用到了 alias别名（build\webpack.base.conf.js  中设置的）  那前面就需要加 ~ ，这样才会去访问这个别名
  // 此处 assets是定义过得别名
  @import "~assets/scss/mixins";

  .home{
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: $bgc-theme;
  }
</style>
