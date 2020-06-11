<template>
  <div class="hello">
    hello word
  </div>
</template>
<script>
  // 这是一个组件  在调用的过程中就会初始化 进行以下操作
  export default {
    data(){
      return{

      }
    },
    beforeCreate() {
      console.log("beforeCreate");
    },
    created(){
      console.log("created");
    },
    beforeMount(){
      console.log("beforeMount");
    },
    mounted(){
      console.log(this.$route.params.userId);
      console.log(this.$route.query);
      console.log("mounted");
    },
    beforeDestory(){
      console.log("beforeDestory");
    },
    destoryed(){
      console.log("destoryed");
    },
  }
</script>
