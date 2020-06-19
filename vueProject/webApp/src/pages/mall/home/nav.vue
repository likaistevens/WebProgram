<template>
  <nav class="nav">
    <ul class="nav-list">
      <li
        class="nav-item"
        v-for="(item, index) in navs"
        :key="index">
        <a :href="item.linkUrl" class="nav-link">
          <img :src="item.picUrl" class="nav-pic">
          <span>{{item.text}}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
  import { navItems } from "./config";

  export default {
    name: "nav",
    data() {
      return {
        // data里的数据，会在绑定一个get/set方法，便于从服务器更新数据，但是这种加载的数据，只需要一次。
        // 所以不在data里面写，写到create里面，加载绑定一次就好了
        // navs: navItems,
      };
    },
    created() {
      // 放到config.js中
      this.navs = navItems;
    },
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";

  .nav {
    width: 100%;
    padding-top: 15px;
    background-color: #fff;

    &-list {
      display: flex;
      /*flex布局是不管有多少都排成一行，但是现在不想让它排满 flex-wrap：wrap  允许拆行*/
      flex-wrap: wrap;
    }

    &-item {
      /*每个元素20% 正好一行五个*/
      width: 20%;
      margin-bottom: 15px;
    }

    &-link {
      @include flex-center(column);
    }

    &-pic {
      width: 60%;
      margin-bottom: 8px;
    }
  }
</style>
