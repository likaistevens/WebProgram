<template>
<!--  vue里面添加动画效果，在外面包一层transition-->
  <transition name="mine-backtop">
    <div
      href=""
      class="mine-backtop"
      v-show="visible"
      @click="backToTop" >
      <i class="iconfont icon-backtop"></i>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'MeBacktop',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      backToTop() {
        // 点击按钮，抛出backtop事件，然后home父组件监听，执行父组件的backToTop，这个backToTop又会去调用scroll的scrollToTop，达到返回顶部的目的
        this.$emit('backtop');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .mine-backtop {
    overflow: hidden;
    @include flex-center();
    width: 45px;
    height: 45px;
    background-color: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 50%;

    .iconfont {
      color: #fff;
      font-size: 38px;
    }
  }

  .mine-backtop {
    /*leave 离开      三个阶段：   leave ----> leave-active  ---->  leave-to*/
    /*enter 进入     三个阶段：    enter ----> enter-active  ---->  enter-to*/
    &-enter-active,
    &-leave-active {
      transition: opacity 0.4s;
    }

    &-enter,
    &-leave-to {
      opacity: 0;
    }
  }
</style>
