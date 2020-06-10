<template>
  <div>  <!-- -->
    <div>----------------------选项数据---------------------</div>
    <div>{{msg}}</div>    <!--hello world      可以直接从data里面把数据拿过来-->
    <div>{{num + 2}}</div>    <!--可以写js语法 -->
    <div>----------------------模板中绑定函数---------------------</div>
    <div>computed: {{aDouble}}</div>    <!-- computed: 4    -->
    <div>----------------------模板中绑定事件---------------------</div>
    <div @click="say('hi')">点击我</div>    <!--可以传入参数-->
    <div>----------------------嵌入指令---------------------</div>
    <div v-html="rawHtml"></div>          <!--我是一个span标签   嵌入指令  v-html 把html变量渲染成子元素放入当前标签中  -->
    <div v-bind:class="red"></div>    <!-- v-bind 将一些属性 跟data里面的变量绑定，通过改变变量 动态修改属性 -->
    <div @click="change">修改颜色</div>   <!--点击后 上面那个div的class属性会发生变化-->
    <div v-on:click="change">修改颜色</div>   <!--跟上面写法一个意思 都是绑定事件 简写-->
    <div>----------------------过滤器---------------------</div>
    <div>{{message | capitalize}}</div>    <!--123  绑定过滤器 对输入的变量 进行过滤器对应的操作， 过滤器函数写在下面-->

  </div>
</template>
<script>
  export default {
    // 是一个函数 全局变量的定义   数据绑定
    data(){
      return{
        msg: 'hello world',
        num: 2,
        rawHtml: '<span>我是一个span标签</span>',
        red: 'red active',
      }
    },
    // computed 是个对象 里面定义函数  通常用于计算属性
    computed: {
      aDouble(){
        return this.num * 2;
      },
    },
    // 也是个对象 里面定义函数 不过是用于事件绑定的函数
    methods: {
      say(h){    // 可以传入参数
        alert(h);
      },
      change(){
        this.red = 'blue';
      }
    },
    filters:{
      capitalize(){
        return '123';
      }
    }
  }
</script>
