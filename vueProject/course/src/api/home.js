import axios from 'axios';
import { SUCC_CODE, TIMEOUT, HOME_RECOMMEND_PAGE_SIZE, jsonpOptions} from './config';
// import jsonp from 'jsonp';

import jsonp from "assets/js/jsonp";

// 获取幻灯片数据--ajax
export const getHomeSlider = () => {
  // 之前获取数据之后 需要用回调函数返回数据  axios解决异步问题  本身就返回一个promise对象
  return axios.get('http://www.imooc.com/api/home/slider',
    {
      // 通常发送请求都会有个timeout，即超过这个时间判断为超时
      timeout: TIMEOUT
    }).then(res => {
    // 这里res是全部数据，但其实很多信息不需要，所以需要加工，先判断数据有效性，然后处理
    if(res.data.code === SUCC_CODE ) {
      return res.data.slider;

      throw new Error('获取数据失败');
    }
 }).catch(err => {
   if(err){
     console.log(err);
   }
   return [
     {
       linkUrl: 'http://www.imooc.com/',
       picUrl: require('assets/img/404.png'),
     }
   ];
   //只要上面catch内部没有手动抛出错误，后面的then还是可以继续执行的
  }).then(data => {
    return new Promise(resolve => {
      setTimeout(() =>{
        resolve(data);
      }, 1000)
    })
  });
}


// 获取热门推荐数据
export const getHomeRecommend = (page=HOME_RECOMMEND_PAGE_SIZE, psize=20) => {
  const url = 'https://ju.taobao.com/json/tg/ajaxGetItemsV2.json';
  const params = {
    page,
    psize,
    type: 0,
    frontCatId: ''
  };

  return jsonp(url, params, jsonpOptions).then(res => {
    // console.log(res);
    if(res.code === '200'){
      return res;
    }

    throw new Error('获取数据失败');
  }).catch(err => {
    if(err){
      console.log(err);
    }
    return [
      {
        linkUrl: 'http://www.imooc.com/',
        picUrl: require('assets/img/404.png'),
      }
    ];

    //只要上面catch内部没有手动抛出错误，后面的then还是可以继续执行的
    // 如果catch捕获到了错误，name下面data就会是err
  }).then(data => {
    return new Promise(resolve => {
      setTimeout(() =>{
        resolve(data);
      }, 1000)
    })
  });
}
