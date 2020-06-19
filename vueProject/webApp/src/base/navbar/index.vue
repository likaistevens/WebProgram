<template>
    <div class="mine-navbar">
<!--      vm.$slots 返回的是个object，匿名的是default。-->
<!--      vm.$slots.name 如果slot有内容返回一个array，否则返回undefined。-->
<!--      使用的时候直接 $slots 就可以了-->
<!--      存在当前slot，则显示这个元素，不存在slot，整个元素就不显示-->
      <div class="mine-navbar-left" v-if="$slots.left">
        <slot name="left"></slot>
      </div>
      <div class="mine-navbar-center" v-if="$slots.center">
        <slot name="center"></slot>
      </div>
      <div class="mine-navbar-right" v-if="$slots.right">
        <slot name="right"></slot>
      </div>
<!--      本来这个v-text可以跟这个h1合并，但是下面flex-center和ellipsis会冲突。 可以选择去掉flex-center，用line-height达到垂直居中的目的-->
<!--      但是这样子，就需要不停的调整line-height高度为父容器height高度，兼容性不好。所以，可以选贼在内层加一个span，在span上应用文字溢出隐藏-->
      <h1 class="mine-navbar-title" v-if="title">
        <span class="mine-navbar-text" v-text="title"></span>
      </h1>
    </div>
</template>

<script>
    export default {
        name: "MeNavbar",
        props:{
          title: {
            type: String,
            default: '',
          }
        },
    }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .mine-navbar{
    // 作为组件的父容器必须由relative，不然下面有定位的子元素都会跳过这个父容器，继续向上寻找有定位的容器作为父元素
    position: relative;
    @include flex-between();
    height: 50px;
    background-color: #fff;
    &-left{
      margin-left: 10px;
      // 兄弟选择器 如果存在left，这个样式才会生效，把right设置为static，相当于取消定位，如果没有，下面right的absolute定位就会生效
      ~ .mine-navbar-right{
        position: static;
      }
    }

    &-center{
      flex: 1;     // 填满中间的宽度   左右用了多少，剩下的中间全部占住
      margin: 0 10px;
      // 同理，center如果存在，就取消right的定位。
      ~ .mine-navbar-right{
        position: static;
      }
    }

    &-right{
      margin-right: 10px;
      // 不要下面这些也行。但是 就会有个问题，当center和left不存在的时候，right会移到最左边
      // 解决办法，可以去掉v-if判断，即三个元素一直存在，也可以像这样，给right一个绝对定位
      // 为了该组件兼容性，我们选择添加定位的方法
      position: absolute;
      right: 0;
      // 有了绝对定位，没法继承父节点的flex定位，需要再定义一下
      @include flex-center();
      height: 100%;
    }

    &-title{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 20%;    // 根据不同页面自己调整
      right: 20%;   // 根据不同页面自己调整
      height: 100%;
      @include flex-center();
    }

    &-text{
      font-size: 18px;
      line-height: 1.5;
      @include ellipsis;
    }
  }
</style>
