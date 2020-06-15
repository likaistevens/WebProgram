import axios from 'axios';
import { SUCC_CODE } from "./config";
import { TIMEOUT } from './config';

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
   ]
  })
}
