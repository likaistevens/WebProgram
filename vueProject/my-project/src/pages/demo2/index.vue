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
    <div>{{msg | capitalize}}</div>    <!--123  绑定过滤器 对输入的变量 进行过滤器对应的操作， 过滤器函数写在下面-->

    <div>----------------------计算属性---------------------</div>
    <div>{{msg.split('').reverse().join('')}}</div>
    <div>{{reverseMessage}}</div>      <!--翻转字符串  将上面的js操作写在计算属性中，模板跟js分离 -->

    <div>----------------------class和style绑定   v-bind指令---------------------</div>
    <div></div>              <!--动态绑定一个或者多个特性  原始写法v-bind:class 缩写 :class  -->
    <div>Class绑定</div>
    <!--绑定1：   {active: isActive, 'text-danger':hasError} -->
    <div class="static"
        v-bind:class="{active: isActive, 'text-danger':hasError}">
        class1        <!--isActive为true的时候 class里面会加入active  hasError为true，加入text-danger-->
    </div>
    <!--绑定2：   classObject     缩写 : -->
    <div :class="classObject" >class2</div>
    <!--绑定3：   [activeClass, errorClass]   传入一个数组  下面两种一样的意思-->
    <div :class="[activeClass, errorClass]" >class2</div>
    <div :class="['active', 'text-danger']" >class2</div>

    <div>Style绑定</div>
    <!--原始-->
    <div style="color: red; font-size: 36px">style原始</div>
    <!--绑定1：   {color: activeColor, fontSize:'16px'} -->
    <div :style="{'color': activeColor, 'fontSize':fontSize + 'px'}">style1</div>
    <!--绑定2：   styleObject -->
    <div :style="styleObject" >style2</div>
    <!--绑定3：   [baseClass, overridingStyles] -->
    <div :style="[baseStyle, overrideStyle]" >style3</div>


    <div>----------------------条件渲染 指令---------------------</div>
    <div>v-if  v-else v-else if</div>
    <h1 v-if="ok">Yes</h1>    <!--ok 是true 标签会执行（显示）  false 标签不会显示-->
    <div v-if="type === 'A'">A</div>
    <div v-else-if="type === 'B'">B</div>
    <div v-else-if="type === 'C'">C</div>
    <div v-else>Not A/B/C</div>

    <div v-show="isShow">v-show</div>    <!--于v-if类似  传入boolean-->

    <div>----------------------列表渲染 指令---------------------</div>
    <!--用法1： v-for="item in items" 数组-->
    <ul id="example-1">
      <li v-for="item in items">
        {{ item.message }}            <!--循环生成li标签-->
      </li>
    </ul>
    <!--用法2： v-for="(item,index) in items" 数组-->
    <ul id="example-2">
      <li v-for="(item,index) in items">
        {{ index }} - {{ item.message }}            <!--index为数组下标  相当于从items这个数组中同时取到下标index和item两个变量-->
      </li>
    </ul>
    <!--用法3： v-for="(value,key) in object" 对象-->
    <ul id="example-3">
      <li v-for="(value,key) in object">
        {{ value }} - {{ key }}            <!--index为数组下标  相当于从items这个数组中同时取到下标index和item两个变量-->
      </li>
    </ul>

    <div>----------------------事件处理器---------------------</div>
    <div>v-on   缩写 @     v-onm:click   缩写@click</div>
    <div id="example-4">
      <button v-on:click="counter += 1">增加1</button>
      <p>这个按钮被点击了{{ counter }}次</p>
    </div>
    <div id="example-5">
      <!--greet是下面methods里面定义的一个方法-->
      <button @click="greet('hello')">Greet 方法</button>
    </div>
    <div @click="dothis2">     <!--不传参数 就只写方法名 不要括号-->
      <button @click.stop="doThis">.stop  阻止事件冒泡</button>
    </div>

    <div>----------------------自定义组件---------------------</div>
    <!--先在components文件夹下创建组件，组件文件格式跟普通页面一样，然后在script下面引入组件，接下来再export default的components里面注册组件。最后，组件名就可以当做标签使用-->
    <countDown style="color: red"></countDown>
    <countDown col="blue" @end="ending" ></countDown>

    <div>----------------------过渡效果---------------------</div>
    <div id="demo">
      <button v-on:click="show = !show"> Toggle </button>   <!--点击按钮 把show这个变量变成相反   效果就是 点击按钮，显示和隐藏标签-->
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
    </div>

    <div>----------------------vue router---------------------</div>
    <!--npm install 引入vue-router包  实现页面跳转功能-->
    <div>https://router.vuejs.org/zh-cn/</div>
    <!--用法1: <router-link to="/demo1">demo1</router-link>-->
    <router-link to="/demo1">用法1 跳转 demo1</router-link>     <!--最简单的跳转 不传入参数-->
    <!--用法2: to="{name:'demo1', params:{ userId:123 }}"-->
    <!--这里的name是在index.js里面配置路由的时候， 给你们，每个页面定的name-->
    <!--params传入参数，在index.js里面配置路由的时候，在path后面 :变量名  来引用这个变量   path: '/demo1/:userId',  -->
    <!--也可以在目标页面 通过  this.$route.params.变量名  来调用参数  例子参考 demo1下 mounted-->
    <router-link :to="{name:'demo1', params:{ userId:123 }}">用法2 传入参数并 跳转 demo1</router-link>
    <!--传入 query。  query里面是一些键值对。 同理 这个query也可以在目标页面进行调用  例子参考 demo1下 mounted-->
    <!--结果    http://localhost:8080/#/demo1/123?plan=private-->
    <router-link :to="{name:'demo1', params:{ userId:123 }, query:{ plan: 'private'}}">Query</router-link>
    <!--用法3: this.$router.push( { path:'/demo1' } )-->
    <!--通过js跳转， toURL是methods里面的一个方法。 这个方法的实现是借助 this.$router.push( { path:'/demo1' } ) 这种跳转方法来实现的-->
    <button @click="toURL">点我跳转</button>
    <!--用法4: this.$router.push( {name:'demo1', params:{ userId:123 }} )-->
    <!--同上面用法3一样 只不过可以传入参数  toURL方法也是写在methods里面-->
    <button @click="toURL">点我跳转（传入参数）</button>
    <!--用法5: this.$router.push( {name:'demo1', params:{ userId:123 }}, query:{ plan: 'private'}})-->
    <!--传入参数params和query  结合用法2 用法3 看-->

    <div>----------------------状态管理 vuex---------------------</div>
    <!--npm install vuex 引入vuex包  全局状态管理，所有页面共享数据, 所有页面都可以吧数据放到数据共享池中-->
    <div>https://vuex.vuejs.org/zh-cn/</div>
    <!--    设置数据： this.$store.dispatch('increment', 100000);-->
    <!--    获取数据： this.$store.state.num-->
    <!--在src/main.js 里 import store from './store/'  并在main.js下面添加 store这个目录-->
    <!--src下创建store文件夹  文件夹里面创建 index.js-->
    <div>
      <div>状态管理vuex</div>
      <div>{{ vuexState1 }}--{{ vuexState2 }}</div>       <!--点击按钮，第一个数据变0，第二个变成10000，之后每次点击按钮，第一个数据++，第二个数据不变-->
      <button @click="changeState">change</button>
    </div>

    <div>----------------------slot插槽---------------------</div>
    <!--用于组件调用 先在components中定义组件。 组件中包含slot插槽-->
    <!--    再在页面中 将插件import， 并在component里定义。 然后就可以将组件名作为标签使用 -->
    <!--    此时，组件作为标签名的元素里都是组件模板里的内容，但是模板里的slot中间相当于预留了位置，需要当前页面传入-->
    <slotTest>
      <div>123</div>
      <p slot="bottomSlot">888</p>   <!--指定放入某个插槽-->
    </slotTest>

    <div>---------------------- vue-resource请求 ---------------------</div>
    <!--    npm install vue-resource-->
    <div>https://github.com/pagekit/vue-resource</div>
    <!--    this.$http.get('/someURL');-->
    <!--    this.$http.post('/someURL',{foo: 'bar'});-->
    <!--    在main.js中 import VueResource from 'vue-resource'     Vue.use(VueResource)-->
    <!--    这个请求数据命令 通常放到mounted里面执行   具体用法 参照下面 mounted()-->

    <div>---------------------- 移动组件库 Mint UI ---------------------</div>
<!--    npm i mint-ui@1 -S -->
<!--    main.js中引入  import Mint from 'mint-ui'     Vue.use(Mint)-->
    <div>https://mint-ui.github.io/docs/#/zh-cn</div>
    <div>
      <div>移动组件库 Mint UI</div>
    </div>

    <!-- -->


    </div>
</template>
<script>
  import countDown from "../../components/countDown";
  import slotTest from '../../components/slotTest.vue';
  import { Toast } from 'mint-ui';

  export default {
    // 是一个函数 全局变量的定义   数据绑定
    data(){
      return{
        msg: 'hello world',
        num: 2,
        rawHtml: '<span>我是一个span标签</span>',
        red: 'red active',

        isActive: true,
        hasError: false,
        classObject: {
          'active': true,
          'text-danger': true,
        },
        activeClass: 'active',
        errorClass: 'text-danger',

        activeColor: 'red',
        fontSize: 36,
        styleObject:{
          'color': 'red',
          'fontSize': '36px',
        },
        baseStyle:{
          'color': 'red',
        },
        overrideStyle:{
          'fontSize': '36px',
        },

        ok: true,
        type: 'B',
        isShow: true,

        items:[
          {message: 'foo'},
          {message: 'Bar'},
        ],
        object:{
          key1: 'value1',
          key2: 'value2',
        },

        counter: 0,

        show: true,

        vuexState1: '123',
        vuexState2: '123',
      }
    },
    // 计算属性   computed 是个对象 里面定义函数  通常用于计算属性
    computed: {
      aDouble(){
        return this.num * 2;
      },
      reverseMessage(){
        return this.msg.split('').reverse().join('');
      }
    },
    // 也是个对象 里面定义函数 不过是用于事件绑定的函数
    methods: {
      say(h){    // 可以传入参数
        alert(h);
      },
      change(){
        this.red = 'blue';
      },
      greet(h){
        alert(h);
      },
      dothis2(){
        alert('dothis2');
      },
      doThis(){
        alert('doThis');
      },
      ending(){
        console.log("已经结束了");
      },
      toURL(){
        // this.$router.push({ path: '/demo1/123' });     //用法3 不传入参数
        this.$router.push( {name:'demo1', params:{ userId:456 }} );    // 用法4 传入参数 结果http://localhost:8080/#/demo1/456
      },
      changeState(){
        // 取出公共数据
        this.vuexState1 = this.$store.state.count;    // 从store里面取出state.count 赋值给当前的变量

        // 修改公共数据
        this.$store.dispatch('increment', 10000);     // 调用store里面的方法，修改公共数据
        this.vuexState2 = this.$store.state.num;
      },
    },
    mounted() {
      Toast('提示信息');
      // get请求  不传入参数
      this.$http.get('/someURL.php').then(response => {
        // success callback
        console.log(response.body);
      }, response => {
        // error callback

      });
      // post请求  传入参数
      this.$http.post('/someURL.php', {foo: 'bar'}).then(response => {
        // success callback
        console.log(response.body);
      }, response => {
        // error callback

      });
      // get请求 通过params传入参数
      this.$http.get('/someURL.php', {params: {foo: 'bar'}, headers: {'X-custom': '...'}} ).then(response => {
        // success callback
        console.log(response.body);
      }, response => {
        // error callback

      });



    },


    filters:{
      capitalize(){
        return '123';
      }
    },

    components:{
      countDown,
      // 也可以这样给组件一个名字，这样引入标签的时候就需要用组件的名字作为标签   <count-down>
      // 'count-down': countDown,
      slotTest,
    }
  }
</script>
<style>
  /*显示隐藏的过程分析
  1.显示状态
  2.隐藏状态
  leave 离开      三个阶段：   leave ----> leave-active  ---->  leave-to

  1.隐藏状态
  2.显示状态
  enter 进入     三个阶段：    enter ----> enter-active  ---->  enter-to
  */
  /* 会自动调用两个过程 三个阶段的样式   name是transition标签里面定义的  .name-阶段名    .fade-enter-active */
  .fade-enter-active, .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  /* 因为一开始标签就是显示的，opacity:1  所以这个状态的样式写了是多余的 */
  /* .fade-leave{ opacity: 1; } */
</style>
