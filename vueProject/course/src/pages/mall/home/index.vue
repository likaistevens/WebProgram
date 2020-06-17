<template>
  <div class="home">
    <header class="g-header-container">
<!--      所有组件都需要放在container里面。 因为此项目，定位都是依靠提前写好container用container来定位。否则，就会遵循自然流布局-->
      <home-header></home-header>
    </header>

    <me-scroll :data="recommends" pullDown @pull-down="pullToRefresh">
      <home-slider ref="slider"></home-slider>
      <home-nav></home-nav>
<!--      接收事件，当recommends加载完之后，更新滚动条-->
      <home-recommend @loaded="getRecommend"></home-recommend>
    </me-scroll>

    <div class="g-backtop-container"></div>
<!--    放置一个router-view，此路由下的二级路由会在这里切换    一级路由切换的位置在入口App.vue-->
<!--    当地址变成二级路由的地址，router/index.js里面的二级路由页面就会塞到这里-->
    <router-view></router-view>
  </div>
</template>

<script>
  import HomeHeader from './header';
  import HomeSlider from './slider';
  import HomeNav from './nav';
  import HomeRecommend from './recommend';

  import MeScroll from "base/scroll";
  import recommend from "./recommend";

  export default {
      name: "mallHome",

      components: {
        HomeHeader,
        HomeSlider,
        MeScroll,
        HomeRecommend,
        HomeNav,
      },
    data() {
      return {
        recommends: [],
      }
    },
    methods: {
        updateScroll() {

        },
      getRecommend(recommends) {
          this.recommends = recommends;
      },
      pullToRefresh(end){
          this.$refs.slider.update().then(end);
          // setTimeout(() => {
          //   console.log('下拉刷新');
          //   end();
          // }, 5000);
      }

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
