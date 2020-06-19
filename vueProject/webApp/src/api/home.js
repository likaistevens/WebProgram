import axios from 'axios';
import { SUCC_CODE, TIMEOUT, HOME_RECOMMEND_PAGE_SIZE, jsonpOptions} from './config';
// import jsonp from 'jsonp';

import jsonp from "assets/js/jsonp";

// 打乱数组的顺序   刷新幻灯片的时候用到
const shuffule = (arr) => {
  const arrLength = arr.length;
  let i = arrLength;
  let rndNum;

  while( i-- ){
    if(i != (rndNum = Math.floor(Math.random() * arrLength))){
      [arr[i], arr[rndNum]] = [arr[rndNum], arr[i]];
    }
  }
  return arr;
}
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
      // res.data.slider 获取到的所有幻灯片
      let sliders = res.data.slider;
      // 从sliders数组里面随机取一个  slider是只包含一张幻灯片的一个单元素数组
      const slider = [sliders[Math.floor(Math.random() * sliders.length)]];

      // filter遍历sliders数组内每个元素，当后面函数返回真(即随机百分之五十概率)，则返回该元素(保留该元素)
      // 相当于每次获取数据之后，百分之五十左右的会被存储下来展示  随机筛选出来的数组，塞进shuffle打乱，作为新的sliders
      sliders = shuffule(sliders.filter(() => Math.random() >= 0.5));

      // 如果筛选之后sliders里面一个都没有，就把随机选出来的那个作为sliders
      if(sliders.length === 0){
        sliders = slider;
      }
      return sliders;
      // return res.data.slider;
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
