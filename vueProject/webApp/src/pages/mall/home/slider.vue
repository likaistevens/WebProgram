<template>
<!--  从base/slider这个基础组件出发，包装一下成为home的业务组件-->
 <div class="slider-wapper">
<!--   这里的v-if是需要等数据处理完之后才会渲染me-slider这个组件。不然就会存在一个异步问题，数据没获取完，组件已经渲染上去了，切换图片的时候就会产生跳跃-->
   <me-loading v-if="!sliders.length"></me-loading>
   <me-slider
     :data="sliders"
     :direction="direction"
     :loop="loop"
     :interval="interval"
     :pagination="pagination"
     v-else
   >
     <swiper-slide v-for="(item, index) in sliders" :key="index">
       <a :href="item.linkUrl" alt="" class='slider-link'>
         <img :src="item.picUrl" alt="" class='slider-img'>
       </a>
     </swiper-slide>
   </me-slider>
 </div>
</template>

<script>
    import MeSlider from 'base/slider';
    import { SwiperSlide } from 'vue-awesome-swiper';
    import { sliderOptions } from "./config";
    import { getHomeSlider } from "../../../api/home";
    import MeLoading from "base/loading";

    export default {
      data() {
        // swiper常用选项配置
        // https://www.swiper.com.cn/api/freemode/44.html
        return {
          direction: sliderOptions.direction,
          loop: sliderOptions.loop,
          interval: sliderOptions.interval,
          pagination: sliderOptions.pagination,
          // js 里面引入本地图片，一定要通过require引入  远程 可以直接用url
          sliders: [],
        }
      },
      methods: {
        getSliders(){
          // 后面本身就是个promise对象，可以直接返回
           return getHomeSlider().then(data => {
            this.sliders = data;
          })
        },
        update(){
          return this.getSliders();
        },
      },
      // 通常在created里面获取数据
      created() {
        this.getSliders();
      },
      name: "HomeSlider",
      components: {
        MeSlider,
        SwiperSlide,
        MeLoading,
      }
    }
</script>

<style lang="scss" scoped>
  .slider-wapper {
    width: 100%;
    height: 183px;
  }

  .slider-link {
    display: block;
  }

  .slider-link,
  .slider-img {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
