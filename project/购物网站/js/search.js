// 组件化搜索功能
(function ($) {
    'use strict';

    // 自己创立一个对象 保存缓存数据
    var cache = {
        data: {},
        count : 0,
        addData: function (key,data) {
            if(!this.data[key]){
                this.data[key] = data;
                this.count++;
            }
        },
        readData: function (key) {
            return this.data[key];
        },
        deleteDataByKey: function (key) {
            delete this.data[key];
            this.count--;
        },
        deleteDataByOrder: function (num) {
            // 目前删除了几个
            var deleteCount = 0;

            for(var p in this.data){
                if(deleteCount >= num){
                    break;
                }
                deleteCount++;
                this.deleteDataByKey(p);
            }
        }
    };


    function Search($elem,options) {
        this.$elem = $elem;
        this.options = options;

        this.$input = this.$elem.find('.search-inputbox');
        this.$form = this.$elem.find('.search-form');
        this.$layer =  this.$elem.find('.search-layer');

        // 判断下拉菜单里是否有内容
        this.loaded = false;

        // 事件代理，给Search对象的$elem绑定，即父容器绑定， 当点击父容器下的search-btn按钮的时候，对Search对象执行Search.submit()
        this.$elem.on('click','.search-btn',$.proxy(this.submit,this));

        // 创建这个对象的时候，如果对象有自动完成，就立马执行
        if(this.options.autocomplete){
            this.autocomplete();
        }
    }
    Search.DEFAULTS = {
        autocomplete : false,
        url : 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1588882747591_3075&callback=jsonp3076&k=1&area=c2c&bucketid=2&q=',
        css3:false,
        js:false,
        animation:'fade',
    };
    Search.prototype.submit = function () {
        // 这个submit主要是多了个表单验证  空白无法提交
        console.log("submit");
        if($.trim(this.$input.val()) === ''){
            return false;
        }
       this.$form.submit();
    };
    Search.prototype.autocomplete = function () {
        console.log('autocomplete');
        // console.log(this);    // Search 这个对象
        // console.log(this.getData);  // Search.prototype.getData   输出整个这个function
        // console.log(this.getData());  // 输出undefined 但是  getData这个方法被执行了
        var self = this,
            timer = null;

        this.$input
            // 设置一个定时器，不要每次输入一个字符都发送一次请求。
            .on('input',function (){
                if(self.options.getDataInterval){
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.getData();
                    },self.options.getDataInterval);
                }else{
                    self.getData();
                }
            })
            // on前面是$input，所以这里绑定事件里面的this是input框。 但getData的对象必须是Search，因为options是Search对象内的
            // $.proxy(this.getData, this)   $.proxy()里面维持最外层的关系， 这里面的两个this都是指的search对象，
            // 第一个参数传入一个function，Search对象的getData方法，第二个参数修改这个方法的对象为this，即Search对象本身。
            // .on('input',$.proxy(this.getData, this));
            // 相当于以下代码， 用$self先保存Search对象
            // .on('input',function () {
            //     self.getData();
            // });
            .on('focus',$.proxy(this.showLayer, this))
            // 阻止冒泡，防止触发下面的 $(document).on('click',$.proxy(this.hideLayer,this));
            .on('click',function () {
                return false;
            });
        this.$layer.showHide(this.options);
        // 点击其他区域隐藏下拉框
        $(document).on('click',$.proxy(this.hideLayer,this));
    };
    Search.prototype.getData = function () {
        // console.log('get data run');
        // console.log(this);
        var self = this;
        var inputVal = this.getInputVal();
        // 如果获取到的值为空，直接执行 fail的操作，不去生成url 发送请求
        if(inputVal === '') return  self.$elem.trigger('search-noData');

        if(cache.readData(inputVal))    return self.$elem.trigger('search-getData',[cache.readData(inputVal)]);

        // $.ajax() 方法返回的是浏览器原生的 XMLHttpRequest 对象。   即 jqXHR， 具有abort()方法，终止请求。
        // 上一次ajax请求没完成，就开始了下一次请求，那么需要终止上一次请求，再开始下一次
        if(this.jqXHR)  this.jqXHR.abort();
        $.ajax({
            url : this.options.url + inputVal,
            dataType : 'jsonp',
        }).done(function (data) {
            console.log(data);
            cache.addData(inputVal,data);
            console.log(cache.data);
            console.log(cache.count);
            self.$elem.trigger('search-getData',[data]);
        }).fail(function () {
            self.$elem.trigger('search-noData');
        }).always(function () {
            self.jqXHR = null;
        });
    };
    Search.prototype.showLayer = function () {
        if (!this.loaded)    return;
        this.$layer.showHide('show');
    };
    Search.prototype.hideLayer = function () {
        this.$layer.showHide('hide');
    };


    Search.prototype.getInputVal = function() {
        return $.trim(this.$input.val());
    };

    Search.prototype.setInputVal = function(val) {
        this.$input.val(removeHtmlTags(val));

        function removeHtmlTags(str) {
            return str.toString().replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g,'');
        }
    };

    Search.prototype.appendLayer = function(html) {
        this.$layer.html(html);
        // !! 变boolean
        this.loaded = !!html;
    };

    // 用构造函数实现的jQuery拓展
    $.fn.extend({
        search : function (option,value) {
            return this.each(function () {
                var $this = $(this),
                    search = $this.data('search'),
                    options = $.extend({},Search.DEFAULTS,$this.data(),typeof option === 'object' && option);
                if(!search){   // 是不是第一次

                    $this.data('search',search = new Search($this,options))
                }

                // 提供一个接口，如果 .search（）传入一个option对象，那么就执行上面那些操作，创建了一个Search对象。 如果传入的search[option]是一个函数，那么就执行这个函数。
                if(typeof search[option] === 'function'){
                    // 是函数 才会执行
                    search[option](value);
                }
            });
        }
    })

})(jQuery)


// 完整体的搜索功能   全部使用绑定事件触发
// (function ($) {
//     'use strict';
//     var $search = $('.search'),
//         $input = $search.find('.search-inputbox'),
//         $btn =  $search.find('.search-btn'),
//         $form = $search.find('.search-form'),
//         $layer =  $search.find('.search-layer');
//
//     // 验证
//     // 提交form表单的方法不止是点击按钮，还有例如下面的 $input.parents('form').submit();  所以单单点击按钮时验证还不够。 例如下拉菜单里内容被清空了，点击内容还是会提交
//     // $btn.on('click',function () {
//     //     // $.trim 可以去掉字符串两端的空格。   如果全部为空格的一个字符串，会返回 （空字符）
//     //     if($.trim($input.val()) === ''){
//     //         // 对于一个事件，return false表示阻止默认行为。  btn默认行为是提交。  return false阻止提交
//     //         return false;
//     //     }
//     // })
//     $form.on('submit',function () {
//         // $.trim 可以去掉字符串两端的空格。   如果全部为空格的一个字符串，会返回 （空字符）
//         if($.trim($input.val()) === ''){
//             // 对于一个事件，return false表示阻止默认行为。  btn默认行为是提交。  return false阻止提交
//             return false;
//         }
//     })
//
//
//     // 自动完成
//     // 对于这个事件的选择。  change，需要input内值发生改变，然后blur失去焦点之后才会触发。   keypress会出现一个按钮按下去没松开就连续触发很多次
//     // keypress解决了按下去连续触发的问题，但是按所有案件包括上下左右ctrl等也会触发，并且，复制粘贴过来，不能不触发
//     // input 只需要input内值发生改变，不需要blur都会触发。
//     $input.on('input',function () {
//         // 从淘宝搜索页面发现，搜索框内容改编后自动搜索的jsonp地址是如下地址，其中q是input的id，q= 后面的内容及搜索jsonp的关键词
//         var url = 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1588882747591_3075&callback=jsonp3076&k=1&area=c2c&bucketid=2&q='
//             + $.trim($input.val());
//         // ajax向url的地址发送请求，请求成功的时候，能接收到数据，进行success里的操作
//         $.ajax({
//             url: url,
//             // 设置一个超时错误，如果1毫秒之内没有加载数据，就认为失败了，中断当前操作，执行fail/error
//             // timeout:1,
//             dataType : 'jsonp',
//             // 这种是回调函数的形式， jQuery提供了一种异步调用，可以避免回调
//             // success: function (data) {
//             //     console.log(data);
//             // },
//             // error: function (error) {
//             //     console.log(error);
//             // }
//
//             // done成功 fail失败  always总会执行
//         }).done(function (data) {
//             console.log(data);
//             var html = '',
//                 dataNum = data['result'].length,
//                 maxNum = 5;
//             // 如果没有返回数据（找不到），就清空html里的内容（失败的操作），然后直接结束done操作
//             if(dataNum === 0){
//                 $layer.hide().html('');
//                 return;
//             }
//             for(var i = 0; i < data['result'].length; i++){
//                 if(i >= maxNum) break;
//                 html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
//             }
//             $layer.html(html).show();
//
//             // 这个绑定事件，必须放在layer下拉层里面item都生成的时候进行。  如果放到外面去。  layer里面的内容是还没有生成，无法绑定事件
//             // 不过，虽然确实可以在这里对item进行绑定事件，但是这样每次执行done操作都会绑定事件，损失性能。  所以还是采用事件代理，见下面的layer绑定
//             // $layer.find('.search-layer-item').on('click',function () {
//             //     // input框内value值设置为   $(this)当前点击的item 里面html()的内容
//             //     $input.val($(this).html());
//             //     // 找到input框的父元素那个表单，进行提交操作
//             //     $input.parents('form').submit();
//             // })
//         }).fail(function () {
//             $layer.hide().html('');
//             console.log("fail");
//         }).always(function () {
//             console.log("always");
//         });
//     })
//
//     // 想要点击item进行事件提交，给item直接绑定，不可取，因为item是动态生成的，绑定的时候，item没有生成，无法绑定。
//     // 事件代理  利用冒泡的原理。  jQuery有封装好了的事件代理方法。  .on('当前元素绑定事件','真正执行的元素',function)
//     // 我们真正是想对item进行操作。 现在对layer进行绑定，layer里面任何元素被点击都会触发layer绑定事件。 layer绑定的事件通过事件代理转移到对item执行。
//     // 里面的$(this)是真正执行事件的对象，即item。
//     // 如此，item先生成，没有绑定事件，但是点击item冒泡到layer，执行了layer绑定的事件，事件代理触发，寻找当前的item去执行操作
//     // 事件代理，运用到了一个特点，这个事件不管是直接绑定到item还是item的父元素，都会有一个event.target，都是指向实际点击的元素即item，除非点击的是item意外事件却在父元素内
//     // 然后，冒泡到父元素，执行绑定事件的时候，判断 点击的元素event.target是否是我们想要执行操作的元素，如果是的，就执行操作。
//     $layer.on('click','.search-layer-item',function () {
//         // 淘宝上，某些下拉内容里面有加粗的文字，添加到html里之后带有 br 之类的html标签，点击后会被抓取到input框里面，所以在传递到input框里前要去掉html标签
//         // $input.val($(this).html());
//         console.log("----");
//         console.log($(this).html());
//         $input.val(removeHtmlTags($(this).html()));
//         $form.submit();
//     })
//
//     // 点击外面，下拉菜单隐藏，点击input下拉菜单又显示
//     // 本来可以对input进行focus和blur两个事件解决，但是，blur会跟click事件冲突。
//     // input内输入 -> 下拉出现 -> 鼠标移到下拉item -> 鼠标按下 -> input blur -> item消失 -> 鼠标松开 -> 触发click -> 当前item已经没了，无法得到目标
//     // 所以，选择给除了input外的其他区域绑定一个click事件就好了，这样做，点击其他区域可以隐藏下拉菜单，但是，点击input的时候，会冒泡到document，导致下拉菜单隐藏
//     // 所以还需要给input绑定一个click事件，return false，阻止这个input click要执行的事件，即阻止冒泡
//     $input.on('focus',function () {
//         $layer.show();
//     }).on('click',function () {
//         return false;
//     });
//     $(document).on('click',function (e) {
//         $layer.hide();
//     })
//
//     function removeHtmlTags(str) {
//         return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g,'');
//     }
// })(jQuery);