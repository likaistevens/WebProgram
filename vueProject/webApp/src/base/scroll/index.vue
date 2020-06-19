<template>
<!--  借助swiper这个组件，把swiper当做一个容器，来达到滚动条的效果-->
  <swiper :options="swiperOption" ref="swiper">
<!--    下拉实现幻灯片刷新。  swiper中传入pullDown才会有这个功能-->
    <div class="mine-scroll-pull-down" v-if="pullDown">
<!--      此处的text接收变量pullDownText。传入MeLoading组件中。text是MeLoading组件定义的变量，接收到文本，做出对应的显示-->
<!--      inline也是传入MeLoading中修改class值，从而修改样式-->
      <me-loading :text="pullDownText" inline ref="pullDownLoading"></me-loading>
    </div>
    <swiper-slide>
      <slot></slot>
    </swiper-slide>
    <div class="mine-scroll-pull-up" v-if="pullUp">
      <me-loading :text="pullUpText" inline ref="pullUpLoading"></me-loading>
    </div>
    <div class="swiper-scrollbar" v-if="scrollbar" slot="scrollbar"></div>
  </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
  import MeLoading from 'base/loading';
  import {
    PULL_DOWN_HEIGHT,
    PULL_DOWN_TEXT_INIT,
    PULL_DOWN_TEXT_START,
    PULL_DOWN_TEXT_ING,
    PULL_DOWN_TEXT_END,
    PULL_UP_HEIGHT,
    PULL_UP_TEXT_INIT,
    PULL_UP_TEXT_START,
    PULL_UP_TEXT_ING,
    PULL_UP_TEXT_END,
  } from './config';

    export default {
      name: "MeScroll",
      components: {
        Swiper,
        SwiperSlide,
        MeLoading,
      },
      props:{
        scrollbar: {
          type: Boolean,
          default: true,
        },
        data: {
          type: [Array, Object],
        },
        pullDown: {
          type: Boolean,
          default: false,
        },
        pullUp: {
          type: Boolean,
          default: false,
        },
      },
      created(){
        this.init();
      },
      watch: {
        data(newValue,oldValue){
          // watch默认会传入old和new value，用不到，可以不接收。
          this.update();
        }
      },
      methods: {
        update(){
          // console.log(this.$refs.swiper);
          // this.$refs.swiper  获取到的VueComponent,是一个组件实例，里面包含一个swiperInstance，这个就是一个Swiper实例
          this.$refs.swiper && this.$refs.swiper.swiperInstance.update();
        },
        scrollToTop(speed, runCallbacks){
          // Swiper.slideTo()方法是控制返回第几个幻灯片。 但是我们这里作为滚动条只有一个幻灯片，等价于返回到顶部   三个参数是API自带的，第一个是index
          this.$refs.swiper && this.$refs.swiper.swiperInstance.slideTo(0, speed, runCallbacks);
        },
        init(){
          // swiper常用选项配置
          // https://www.swiper.com.cn/api/freemode/44.html
          this.swiperOption = {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,     // 连续滚动  并非幻灯片那样一页一页
            setWrapperSize: true,    // 是否计算容器高度。计算，会在该元素内写入height
            scrollbar: {
              el: this.scrollbar ? '.swiper-scrollbar' : null,
              hide: true,   // 是否自动隐藏
            },
            // 实现下拉刷新  在swiper配置的时候 设置监听事件
            on: {
              // sliderMove和touchEnd都是swiper自带的事件
              sliderMove: this.scroll,
              touchEnd: this.touchEnd,
              transitionEnd: this.scrollEnd,
            }
          };
          this.pullDownText = PULL_DOWN_TEXT_INIT;
          this.pulling = false;
          this.pullUpText = PULL_UP_TEXT_INIT;
        },
        // 监听事件 sliderMove: this.scroll,
        scroll() {
          const swiper = this.$refs.swiper.swiperInstance;

          this.$emit('scroll', swiper.translate, swiper);

          if(this.pulling){
            return;
          }

          // console.log(swiper.translate);  // 滚动条滚过的距离
          // 划过的距离大于0，才是向下拉
          if(swiper.translate > 0){    // 下拉
            if(!this.pullDown){
              return;
            }
            if(swiper.translate > PULL_DOWN_HEIGHT){
              console.log(this.$refs.pullDownLoading);

              // 这样传值可以改变文字内容，但是直接修改data数据，会重新渲染，造成页面闪一下
              // this.pullDownText = '1111';
              // 通过组件的api去修改文字内容    this.$refs 里面获取到的是VueComponent对象
              this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_START);
            }else{
              // 回弹之后  文本内容变回去
              this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_INIT);
            }
          // 官方API mySwiper.isEnd  如果Swiper位于最右/下，这个值为true。
          }else if(swiper.isEnd){   // 上拉    isEnd是否到底部
            if(!this.pullUp){
              return;
            }

            // 判断是否拉到了规定的 高度
            const isPullUp = Math.abs(swiper.translate) + swiper.height - PULL_UP_HEIGHT > parseInt(swiper.$wrapperEl.css('height'));
            // console.log(isPullUp);
            // console.log(swiper.translate);
            // console.log(swiper.height - PULL_UP_HEIGHT);
            // console.log(parseInt(swiper.$wrapperEl.css('height')));

            if (isPullUp) {
              console.log(PULL_UP_TEXT_START);
              this.$refs.pullUpLoading.setText(PULL_UP_TEXT_START);
            } else {
              console.log(PULL_UP_TEXT_INIT);
              this.$refs.pullUpLoading.setText(PULL_UP_TEXT_INIT);
            }
          }
        },
        // 监听事件 touchEnd: this.touchEnd,
        touchEnd(){
          const swiper = this.$refs.swiper.swiperInstance;
          // 如果还在下拉过程中 不允许操作
          if(this.pulling){
            return;
          }

          if(swiper.translate > PULL_DOWN_HEIGHT){  // 表示是下拉
            if(!this.pullDown){   // 没开启下拉就不操作
              return;
            }

            this.pulling = true;
            swiper.allowTouchMove = false;   // 禁止触摸
            swiper.setTransition(swiper.params.speed);  // 将要回弹，设置动画的速度
            swiper.setTranslate(PULL_DOWN_HEIGHT);    // 超过了PULL_DOWN_HEIGHT，会回弹回去。 这里就是设置回弹到PULL_DOWN_HEIGHT
            swiper.params.vitualTranslate = true;  // 定住不给回弹
            this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_ING);   // 文字变成正在刷新
            this.$emit('pull-down', this.pullDownEnd);  // 加载完了，把设置的一些值回复
          }else if (swiper.isEnd) { // 底部
            const totalHeight = parseInt(swiper.$wrapperEl.css('height'));
            const isPullUp = Math.abs(swiper.translate) + swiper.height - PULL_UP_HEIGHT > totalHeight;

            if (isPullUp) { // 上拉
              if (!this.pullUp) {
                return;
              }
              this.pulling = true;
              swiper.allowTouchMove = false; // 禁止触摸
              swiper.setTransition(swiper.params.speed);
              swiper.setTranslate(-(totalHeight + PULL_UP_HEIGHT - swiper.height));
              swiper.params.virtualTranslate = true; // 定住不给回弹
              this.$refs.pullUpLoading.setText(PULL_UP_TEXT_ING);
              this.$emit('pull-up', this.pullUpEnd);
            }
          }
        },
        // 监听事件 transitionEnd: this.scrollEnd,
        scrollEnd(){
          this.$emit('scroll-end', this.$refs.swiper.swiperInstance.translate, this.$refs.swiper.swiperInstance, this.pulling);
        },
        pullDownEnd(){
          const swiper = this.$refs.swiper.swiperInstance;
          this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_END);   // 文字变成加载完之后的文字说明
          swiper.params.vitualTranslate = false;  // 可以回弹
          swiper.allowTouchMove = true;    // 可以触摸
          swiper.setTranslate(0);    // 回弹到高度0
          this.pulling = false;
          swiper.setTransition(swiper.params.speed);
          setTimeout(() => {
            this.$emit('pull-down-transition-end');
          }, swiper.params.speed);
        },
        pullUpEnd() {
          const swiper = this.$refs.swiper.swiperInstance;
          this.pulling = false;
          this.$refs.pullUpLoading.setText(PULL_UP_TEXT_END);
          swiper.params.virtualTranslate = false;
          swiper.allowTouchMove = true;
        },
      }
    };
</script>

<style lang="scss" scoped>
 /* 上述配置， 导致swiper的容器高度为里面内容的总高度，但我们需求的是容器高度为当前窗口可视区域，然后内容超过这个范围，才可以滚动。
  所以手动设置容器高度为父元素（即可视窗口的高度）*/
  .swiper-container{
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
 /*设置了父容器高度，还是不能滑动，是因为每个元素slide的高度也变成了父容器的100%*/
  .swiper-slide{
    height: auto;
  }

  .mine-scroll-pull-down{
    position: absolute;
    left: 0;
    bottom: 100%;
    width: 100%;
    height: 80px;
  }
 .mine-scroll-pull-up {
   position: absolute;
   left: 0;
   width: 100%;
 }
 .mine-scroll-pull-up {
   top: 100%;
   height: 30px;
 }
</style>
