<template>
    <div class="mine-loading" :class="{'mine-loading-inline': inline}">
      <span class="mine-loading-indicator" v-if="indicator==='on'">
        <slot><img src="./loading.gif" alt="Loading..."></slot>
      </span>
      <span class="mine-loading-text" v-if="loadingText">{{loadingText}}</span>
<!--      <span class="mine-loading-text" v-if="text">{{text}}</span>-->
    </div>
</template>

<script>
    export default {
        name: "MeLoading",
        props: {
          indicator: {
            type: String,
            default: 'on',
            validator(value){
              return ['on','off'].indexOf(value) > -1;
            },
          },
          text: {
            type: String,
            default: '加载中...',
          },
          inline: {
            type: Boolean,
            default: false,
          }
        },
      data() {
          return {
            loadingText: this.text,
          }
      },
      methods: {
        // 数据传输过程：
        // this.text ，this是当前loading组件这个VueComponent，this.text是props内的text即在调用loading这个组件的时候
        // 传进来的参数，调用loading组件的是scroll组件。:text="pullDownText" ， scroll组件中，传入text的时候，是绑定了变量pullDownText，而pullDownText
        // 是scroll的data里面设置的变量
        // text， 是当前函数传入的参数，这个函数在scroll里通过$refs获取到loading组件实例后调用  this.$refs.pullDownLoading.setText('hhhhh');
        // 此处，如果直接 this.text = text;  相当于在子组件中修改父组件的pullDownText这个属性值，会报错。
        setText(text){
          // this.text = text;
          // 所以上述方法不行，采用下面的方法，给loading组件单独设置一个loadingText属性值，然后loading组件显示的不再是从scroll传来的text，而是显示loadingText
          this.loadingText = text;
        }
      },
      // 同时设置一个监听，当从scroll传来的text发生变化时，修改loading组件下的自己的loadingText。
      watch: {
          text(text){
            this.loadingText = text;
          }
      }


    };
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .mine-loading{
    overflow: hidden;
    width: 100%;
    height: 100%;
    @include  flex-center(column);

    &.mine-loading-inline{
      flex-direction: row;

      .mine-loading-indicator ~ .mine-loading-text{
        margin-top: 0px;
        margin-left: 6px;
      }
    }
  }

  .mine-loading-indicator ~ .mine-loading-text{
    margin-top: 6px;
  }
</style>
