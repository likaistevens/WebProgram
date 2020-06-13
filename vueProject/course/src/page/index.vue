<template>
  <div>
    <div id="title">首页</div>
    <ol class="project_list">
      <router-link to="/online-course/home">
        <li>移动端在线课程</li>
      </router-link>
    </ol>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
  #title{
    margin-top: 40px;
    font-size: 30px;
    color: red;
    text-align: center;
  }
  .project_list{
    margin-top: 20px;
    margin-left: 60px;
  }
  .project_list li{
    list-style: decimal;
    font-size: 20px;
    color: red;
  }
</style>
