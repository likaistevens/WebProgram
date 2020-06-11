<!--倒计时组件，跟页面格式类似-->
<template>
  <p :style="{color: col}">{{ time }}</p>
</template>

<script>
  export default {
    data(){
      return {
        time: 5,
      }
    },
    mounted(){
      var vm = this;
      var t = setInterval(function () {
        vm.time --;
        if(vm.time == 0){
          clearInterval(t);
          // 此处触发一个自定义事件 end  标签内通过v-on或者@ 绑定事件  后面跟函数，函数写在methods里面 <countDown col="blue" @end="ending"></countDown>
          vm.$emit('end');
        }
      },500);
    },
    // props 可以接收到 组件标签里面传过来的属性值，然后再回传到组件上，给组件设置样式
    // <countDown col="blue"></countDown>
    // 组件的style里color的值为col，  标签传入col="blue"   props接收到col的值。 然后模板中将style设置为color：col
    props:{
      col: {
        type: String,     // 规定传入的值 必须为某种类型
        default: '#000',   // 不传入 col值的时候，默认值
      },
    }
  }
</script>
