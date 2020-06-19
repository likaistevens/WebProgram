<template>
    <div class="recommend">
      <h3 class="recommend-title">热卖推荐</h3>
      <div class="loading-container" v-if="!recommends.length">
        <me-loading inline/>
      </div>
      <ul class="recommend-list" v-else>
        <li class="recommend-item" v-for="(item, index) in recommends" :key="index">
          <router-link
            class="recommend-link"
            :to="{name: 'home-product', params: {id: item.baseinfo.itemId}}"
          >
            <p class="recommend-pic"><img class="recommend-img" v-lazy="item.baseinfo.picUrlNew"></p>
            <p class="recommend-name">{{item.name.shortName}}</p>
            <p class="recommend-origPrice"><del>¥{{item.price.origPrice}}</del></p>
            <p class="recommend-info">
              <span class="recommend-price">¥<strong class="recommend-price-num">{{item.price.actPrice}}</strong></span>
              <span class="recommend-count">{{item.remind.soldCount}}件已售</span>
            </p>
          </router-link>
        </li>
      </ul>
    </div>
</template>

<script>
  import { getHomeRecommend } from "api/home";
  import MeLoading from 'base/loading'

  export default {
    name: "HomeRecommend",
    data(){
      return {
        recommends: [],
        curPage: 1,
        totalPage: 1,
      }
    },
    created() {
      this.getRecommend(1);
    },
    methods: {
      update(){
        return this.getRecommend();
      },
      getRecommend(){
        if(this.curPage > this.totalPage){
          // 返回一个失败的Promise实例。传入的参数会原封不动抛出去
          return Promise.reject(new Error('没有更多'));
        }
        return getHomeRecommend(this.curPage).then(data => {
          return new Promise(resolve => {
            if(data){
              // console.log(data);
              this.curPage ++;
              this.totalPage = data.totalPage;
              // this.recommends = data.itemList;
              // 如果直接采用上述方法赋值，那么每次recommend都会是一个page内item的数量，我们需要随着curPage的增加，this.recommend里面存储的item越来越多
              // concat 返回一个新的数组。该数组是通过把所有 arrayX 参数添加到 arrayObject 中生成的。如果要进行 concat() 操作的参数是数组，那么添加的是数组中的元素，而不是数组。
              this.recommends = this.recommends.concat(data.itemList);
              // 抛出loaded事件，并传出参数     此事件用于更新滚动条
              this.$emit('loaded', this.recommends);
              this.$emit('loadPullUp', this.recommends);

              // 只有上面if判断通过，data有值，才resolve，然后后面可以继续then
              resolve();
            }
          })
        });
      },
    },
    components: {
      MeLoading,
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/mixins";
  .recommend{
    &-title{
      position: relative;
      width: 100%;
      padding: 10px 0;
      font-size: $font-size-l;
      text-align: center;
      /*伪类 画出两边的横线*/
      &:before,
      &:after{
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background-color: #ddd;
      }
      &:before{
        left: 0;
      }
      &:after{
        right: 0;
      }
    }

    &-list {
      /*两边向中间挤，超出换行*/
      @include flex-between();
      flex-wrap: wrap;
    }

    &-item {
      width: 49%;
      background-color: #fff;
      box-shadow: 0 1px 1px 0 rgba(0,0,0,0.12);
      margin-bottom: 8px;
    }

    &-link {
      display: block;
    }

    /*!*这里有个小技巧，当页面宽度调整的时候，由于元素的宽高是百分比，且宽高只有一个能设置百分比。 所以页面宽度调整会导致图片不是正方形 *!*/
    &-pic {
      position: relative;
      width: 100%;
      /* 宽度100%之后 高度没法100% 。  可以用padding-top空出一个100% 的宽度。 预留空白正方形*/
      padding-top: 100%;    /* width和padding的百分比都是相对父容器的 */
      margin-bottom: 5px;
    }

    &-img{
      /*利用定位，将pic里面的img塞到padding里面画出来的正方形里*/
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &-name {
      height: 36px;
      padding: 0 5px;
      margin-bottom: 8px;
      line-height: 1.5;
      @include multiline-ellipsis();
    }

    &-origPrice {
      padding: 0 5px;
      margin-bottom: 8px;
      color: #ccc;
    }

    &-info {
      @include flex-between();
      padding: 0 5px;
      margin-bottom: 8px;
    }

    &-price {
      color: #e61414;
    }

    &-price-num {
      font-size: 20px;
    }

    &-count {
      color: #999;
    }
  }

  .loading-container {
    padding-top: 100px;
  }
</style>
