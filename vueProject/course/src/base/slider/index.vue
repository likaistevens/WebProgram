<template>
    <swiper :options="swiperOption" :key="keyId">
<!--      这是个通用组件，每个业务情况下slider里面不一样，所以不放置swiper-slider，放置一个slot，swiper-slider在各个业务逻辑组件下自己写，然后插入-->
      <slot></slot>
<!--      是否有翻页器，这个slot是swiper插件留的-->
      <div class="swiper-pagination" v-if="pagination" slot="pagination"></div>
    </swiper>
</template>

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
          default() {
            return [];
          }
        }
      },
      data() {
        return {
          keyId: Math.random()
        };
      },
      watch: {
        data(newData) {
          if (newData.length === 0) {
            return;
          }
          this.swiperOption.loop = newData.length === 1 ? false : this.loop;
          this.keyId = Math.random();
        }

      },
      created() {
        this.init();
      },
      methods: {
        init() {
          this.swiperOption = {
            watchOverflow: true,
            direction: this.direction,
            autoplay: this.interval ? {
              delay: this.interval,
              disableOnInteraction: false
            } : false,
            slidesPerView: 1,
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
