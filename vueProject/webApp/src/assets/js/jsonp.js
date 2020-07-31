import jsonp from 'jsonp';

const parseParam = param => {
  // param是一个对象
  // param = {
  //   size: 1,
  //   page: 2,
  // }
  let params = [];
  for (const key in param){
    // 把param都放到params这个数组中
    params.push([key, param[key]]);
    // [[size: 1],[page: 2]]
  }
  return params.map(value => value.join('=')).join('&');
}

export default (url, data, options) => {
  // url后面有？就直接&拼接。  没有？就先加？
  url += (url.indexOf('?') < 0 ? '?' : '&') + parseParam(data);

    // 把jsonp这个插件自己封装成一个promise对象
    return new Promise((resolve, reject) => {
      // jsonp官方api  jsonp(url, options, callback)
      jsonp(url, options, (err, data) => {
        if(err){
          reject(err);
        }else{
          resolve(data);
        }
      });
    }).catch(err => {
      console.log(err);
    });
}
