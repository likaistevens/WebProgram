<template>
  <div class="c-footer">
    <ul class="footer-ul">

          <li v-for="item in footerArray">
            <img :src="item.imgUrl">
            <span>{{item.name}}</span>
          </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      footerArray: Array,
    },

  }
</script>
<style scoped>
  .c-footer{
    position: fixed;
    z-index: 3;
    width: 375px;
    background: #fff;
    border-top: 1px solid #F3F5F7;
    bottom: 0;
  }
  .footer-ul{
    display: flex;
  }
  .footer-ul li{
    display: flex;
    height: 50px;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10px;
  }
  .footer-ul li img{
    width: 24px;
  }
</style>
