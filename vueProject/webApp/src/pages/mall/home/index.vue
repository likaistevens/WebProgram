<template>
  <div class="home">
    <header class="g-header-container">
<!--      所有组件都需要放在container里面。 因为此项目，定位都是依靠提前写好container用container来定位。否则，就会遵循自然流布局-->
      <home-header :class="{'header-transition': isHeaderTransition}" ref="header"></home-header>
    </header>

    <me-scroll :data="recommends"
               pullDown
               pullUp
               @pull-down="pullToRefresh"
               @pull-up="pullToLoadMore"
               @scroll-end="scrollEnd"
               @scroll="scroll"
               @pull-down-transition-end="pullDownTransitionEnd"
               ref="scroll"
    >
      <home-slider ref="slider"></home-slider>
      <home-nav></home-nav>
<!--      接收事件，当recommends加载完之后，更新滚动条-->
      <home-recommend @loaded="getRecommend" ref="recommend"></home-recommend>
    </me-scroll>

    <div class="g-backtop-container">
      <me-backtop :visible="isBacktopVisible" @backtop="backToTop">

      </me-backtop>
    </div>
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
  import MeBacktop from "base/backtop";

  import {HEADER_TRANSITION_HEIGHT} from './config';


  export default {
      name: "mallHome",

      components: {
        HomeHeader,
        HomeSlider,
        MeScroll,
        HomeRecommend,
        HomeNav,
        MeBacktop,
      },
    data() {
      return {
        recommends: [],
        isBacktopVisible: false,
        pullup: false,
        isHeaderTransition: false,
      }
    },
    methods: {
        updateScroll() {

        },
      getRecommend(recommends) {
          this.recommends = recommends;
        this.pullup = true;
      },
      pullToRefresh(end){
        this.$refs.slider.update().then(end);
          // setTimeout(() => {
          //   console.log('下拉刷新');
          //   end();
          // }, 5000);
      },
      // 这个end是子组件 this.$emit('pull-up', this.pullUpEnd);  抛出事件的时候，带出来的。
      // $emit第二个参数是arg不是回调。   所以  这里的end 就是 this.pullUpEnd
      pullToLoadMore(end){
        // setTimeout(() => {
        //   console.log('上拉加载更多');
        //   end();
        // }, 3000);
        this.$refs.recommend.update().then(end).catch(err => {
          // 从reject里面获取到的err
          if(err){
            console.log(err);
          }
          end();
          // 处理没有更多数据的情况
          // 禁止继续加载更多数据
          // 替换上拉时的loading，改为没有更多数据了
        });
      },
      // scroll只会在手触摸滚动的时候触发  手松开 自然滑动的时候不会触发
      scroll(translate){
          this.changeHeaderStatus(translate);
      },
      // 这三个参数是从 scroll组件中 scrollEnd(){  this.$emit('scroll-end', this.$refs.swiper.swiperInstance.translate, this.$refs.swiper.swiperInstance， this.pullDownTransitionEnd); } 带出来的
      scrollEnd(translate, scroll, pulling){
          // 没有处于下滑ing状态的时候 才可以去显示隐藏
        if(!pulling){
          this.changeHeaderStatus(translate);
        }
        this.isBacktopVisible = translate < 0 && -translate > scroll.height;
        // 上面scroll在自然滑动的时候不触发，所以这里还需要在滑动完成之后触发一次
      },
      backToTop() {
        this.$refs.scroll && this.$refs.scroll.scrollToTop();
      },
      // loadPullUp(){
      //   this.pullup = true;
      // }
      changeHeaderStatus(translate){
          // 下拉的距离 >0 表示下拉
          if(translate > 0){
            this.$refs.header.hide();
            return;
          }

          this.$refs.header.show();
          this.isHeaderTransition = -translate > HEADER_TRANSITION_HEIGHT;
      },
      pullDownTransitionEnd(){
        this.$refs.header.show();
      },
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
