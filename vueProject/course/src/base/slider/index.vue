<template>
    <swiper :options="swiperOption" :key="keyId">
<!--      这是个通用组件,子组件，每个业务情况下slider里面不一样，所以不放置swiper-slider，放置一个slot，swiper-slider在各个业务逻辑组件下自己写，然后插入-->
      <slot></slot>
<!--      是否有翻页器，这个slot是swiper插件留的-->
      <!--应该是vue-awesome-swiper里有个<slot name="pagination">  如果需要翻页器，那么，下面这个div就会替换vue-awesome-swiper的template的slot。
      此时，相当于vue-awesome-swiper的template多了一个class="swiper-pagination" 的div。  然后vue-awesome-swiper可能有什么操作，往class="swiper-pagination"
      的dom元素中插入指示器-->
      <div class="swiper-pagination" v-if="pagination" slot="pagination"></div>
    </swiper>
</template>

<!--这是官方带有pagination的一个swiper demo的源码。 slide部分，我们利用插槽替代。-->
<!--<template>
  <swiper class="swiper" :options="swiperOption">
    <swiper-slide>Slide 1</swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>-->

<script>
  import { Swiper } from 'vue-awesome-swiper';
    export default {
      name: "MeSlider",
      components:{
        Swiper,
      },
      props:{
        direction:{
          type: String,
          default: 'horizontal',
          // 只允许传两个值，  验证     props的自验证
          validator(value){
            return [
              'horizontal',
              'vertical'
            ].indexOf(value) > -1;
          }
        },
        interval: {
          type: Number,
          default: 3000,
          validator(value) {
            return value >= 0;
          }
        },
        loop: {
         type: Boolean,
         default: true,
        },
        pagination: {
          type: Boolean,
          default: true,
        },
        data: {
          type: Array,
          // 数组不是基本类型，是个引用，直接 default: []   获取到的是个地址。
          default() {
            return [];
          }
        }
      },
      data() {
        return {
          keyId: Math.random(),
          swiperOption: {},
        };
      },
      watch: {
        data(newData) {
          if (newData.length === 0) {
            return;
          }
          // 每次更新data都需要刷新loop值。否则如果第一次只有一张幻灯片，loop被关了。后面刷新出来更多，loop还是关闭的
          this.swiperOption.loop = newData.length === 1 ? false : this.loop;
          this.keyId = Math.random();
        }
      },
      created() {
        this.init();
      },
      methods: {
        // swiperOptions这些数据，只在渲染的时候用到一次，不需要更新变化，放在data里面会浪费资源
        init() {
          this.swiperOption = {
            watchOverflow: true,
            direction: this.direction,
            autoplay: this.interval ? {
              delay: this.interval,
              disableOnInteraction: false
            } : false,
            slidesPerView: 1,
            // 刷新sliders的时候，可能变成只有一张，如果只有一张就不开启loop
            // loop会在最前面复制一个最后一张，最后复制增加第一张，导致哪怕只有一张幻灯片也可以滑动
            loop: this.data.length <= 1 ? false : this.loop,
            pagination: {
              el: this.pagination ? '.swiper-pagination' : null
            }
          };
        }
      }
    }
</script>

<style lang="scss" scoped>
  .swiper-container {
    width: 100%;
    height: 100%;
  }

</style>
