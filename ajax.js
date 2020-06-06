var $ = {
    ajax:function (option) {
        var xhr = null,
            url = options.url,
            // 设置了method,可以在options里面获取method,没有设置的话，这里就是undefined,就会默认设置成'GET'
            method = options.method || 'GET',
            async = typeof (options.async) === "undefined" ? true : options.async;
        console(async);
        if(typeof XMLHttpRequest != "undefined"){
            xhr = new XMLHttpRequest();
        }else if(typeof ActiveXObject != "undefined"){
            // 将所有可能出现的ActiveXObject版本放在一个数组中
            var xhrArr = ['Microsoft.XMLHTTP','MSXML2.XMLHTTP.6.0','MSXML2.XMLHTTP.4.0',
                'MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP.2.0']
            // 遍历创建XMLHttpRequest对象
            var len = xhrArr.length;
            for(var i = 0; i < len; i++){
                try{
                    // 创建XMLHttpRequest对象
                    xhr = new ActiveXObject(xhr[i]);
                    break;
                }catch (e) {

                }
            }
        }else{
            throw new Error('No XHR object available.');
        }
    }
}

$.ajax(
    {
    url:"",
    method:"get",
    async:true,
    data:{},
    dataType,
    sucess:function () {

    },
})