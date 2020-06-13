<template>
  <div class="home-page">
    <v-header></v-header>
    <ul class="nav">
      <li v-for="item in headerArray">
<!--        接受的是一个变量 需要 v-bin:  简写  :-->
        <img :src="item.imgUrl" alt="">
        <span>{{ item.name }}</span>
      </li>
    </ul>

    <v-course :courseArray="courseArray"></v-course>
    <v-footer :footerArray="footerArray"></v-footer>
  </div>
</template>
<script>
  import Header from "@/components/header/header.vue"
  // 图片的倒入形式必须是 import
  import webImg from "@/assets/web.png"
  import bigdataImg from "@/assets/bigdata.png"
  import moveImg from "@/assets/move.png"
  import webserviceImg from "@/assets/webservice.png"
  import dataImg from "@/assets/data.png"

  import course from "@/components/course/"

  import course1 from "@/assets/course1.jpg";
  import course2 from "@/assets/course2.jpg";
  import course3 from "@/assets/course3.jpg";
  import course4 from "@/assets/course4.jpg";
  import course5 from "@/assets/course5.jpg";

  import footer from "@/components/footer"

  import homeImg from "@/assets/home.png";
  import seaImg from "@/assets/sea.png";
  import downloadImg from "@/assets/download.png";
  import meImg from "@/assets/me.png";

  export default {
    data(){
      return {
        headerArray: [],
        courseArray: [],
        footerArray: [],
      }
    },
    mounted() {
      this.headerArray = [
        {
          imgUrl: webImg,
          name: '前端开发',
        },
        {
          imgUrl: webserviceImg,
          name: '后端开发',
        },
        {
          imgUrl: moveImg,
          name: '移动开发',
        },
        {
          imgUrl: dataImg,
          name: '数据库',
        },
        {
          imgUrl: bigdataImg,
          name: '大数据',
        },
      ];
      this.courseArray = [
        {
          imgUrl: course1,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        },
        {
          imgUrl: course2,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        },
        {
          imgUrl: course3,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        },
        {
          imgUrl: course4,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        },
        {
          imgUrl: course5,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        },
        {
          imgUrl: course1,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        },
        {
          imgUrl: course1,
          title: '实例妙解Sed和Awk的秘密',
          msg: '中级 · 330人在学'
        }
      ];
      this.footerArray = [
        {
          imgUrl: homeImg,
          name: "首页",
        },
        {
          imgUrl: seaImg,
          name: "发现",
        },
        {
          imgUrl:downloadImg,
          name: "下载",
        },
        {
          imgUrl: meImg,
          name: "我的",
        },
      ];
    },
    components:{
      'v-header': Header,
      'v-course': course,
      'v-footer': footer,
    }

  }
</script>
<style>
  .home-page .nav{
    height: 100px;
    padding-top: 44px;
    background: #f3f5f7;
    overflow-x: scroll;
    white-space: nowrap;
    font-size: 0;
  }
  .nav li{
    width: 88px;
    display: inline-block;
    text-align: center;
    font-size: 14px;
  }
  .nav li img{
    display: block;
    width: 32px;
    margin: 20px auto 12px;
  }
</style>
