import Vue from 'vue'
import Vuex from 'vuex'

// 全局调用Vuex
Vue.use(Vuex)

export default new Vuex.Store({
  // 数据
  state:{
    count: 0,
    num: 1,
  },
  // 定义方法
  mutations:{
    increment(state, num){
      state.count++;
      state.num = num;
    },
  },
  // 调用
  actions:{
    increment({ commit }, obj){
      commit('increment', obj);
    },
  }
})
