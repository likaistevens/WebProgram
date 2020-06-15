<template>
  <me-navbar class="header" v-show="visible">
    <i class="iconfont icon-scan" slot="left"></i>
    <div slot="center">搜索框</div>
    <i class="iconfont icon-msg" slot="right"></i>
  </me-navbar>
</template>

<script>
  import MeNavbar from 'base/navbar';

    export default {
        name: "HomeHeader",
      components: {
          MeNavbar,
      },
      data() {
        return {
          visible: true
        };
      },
    }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .header{
    /*不要这个选择器，直接写background-color: transparent; 会存在问题*/
    /*默认样式中设置所有背景色为白色，两者优先级相同时，白色背景色写在后面，就会覆盖透明背景色，此处加入这个选择器提高优先级*/
    &.mine-navbar{
      background-color: transparent;
    }
    .iconfont{
      color: $icon-color-default;
      font-size: $icon-font-size;
    }
  }
</style>
