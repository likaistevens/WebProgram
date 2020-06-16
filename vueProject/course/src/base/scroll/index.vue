<template>
<!--  借助swiper这个组件，把swiper当做一个容器，来达到滚动条的效果-->
  <swiper :options="swiperOptions">
    <swiper-slide>
      <slot></slot>
    </swiper-slide>
    <div class="swiper-scrollbar" v-if="scrollbar" slot="scrollbar"></div>
  </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

    export default {
      name: "MeScroll",
      components: {
        Swiper,
        SwiperSlide
      },
      props:{
          scrollbar: {
            type: Boolean,
            default: true,
          },
          data: {
            type: [Array, Object],
          }
      },
      data(){
        return {
          // swiper常用选项配置
          // https://www.swiper.com.cn/api/freemode/44.html
          swiperOptions: {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,     // 连续滚动  并非幻灯片那样一页一页
            setWrapperSize: true,    // 是否计算容器高度。计算，会在该元素内写入height
            scrollbar: {
              el: this.scrollbar ? '.swiper-scrollbar' : null,
              hide: true,   // 是否自动隐藏
            },
          }
        }
      },
      watch: {
        data(){
          this.updata();
        }
      },
      methods: {
        updata(){
          this.$refs.swiper && this.$refs.swiper.swiper.updata();
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
</style>
