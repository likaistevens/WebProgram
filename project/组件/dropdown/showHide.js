(function ($) {
    'use strict';
    function init($elem,hiddenCallback){
        if($elem.is(':hidden')){
            $elem.data('status','hidden');
            if(typeof hiddenCallback === 'function')    hiddenCallback();
        }else{
            $elem.data('status','shown');
        }
    }

    function show($elem,callback) {
        if($elem.data('status') === 'show') return;
        if($elem.data('status') === 'shown') return;

        $elem.data('status','show').trigger('show');
        callback();
    }

    function hide($elem,callback) {
        if($elem.data('status') === 'hide') return;
        if($elem.data('status') === 'hidden') return;

        $elem.data('status','hide').trigger('hide');
        callback();
    }

    var silent = {
        init:init,
        // 初始化过程，一开始就给元素的data赋一个值，否则，没有点击按钮之前，窗口是显示的，却还能点击显示按钮
        // 自己的初始化，为了封装性，把初始化相同的部分提取出去
        // init:function($elem){
        //     if($elem.is(':hidden')){
        //         $elem.data('status','hidden');
        //     }else{
        //         $elem.data('status','shown');
        //     }
        // },
        // 封装方法 元素出现前执行showCallback回调函数，元素出现后执行shownCallback， 这两个函数可选传入
        // show : function ($elem,showCallback,shownCallback) {

        show : function ($elem) {
            show($elem,function () {
                $elem.show();
                $elem.data('status','shown').trigger('shown');   // 触发事件 show结束 shown开始
            });
        },

        // 自己的show函数，为了封装性，把相同的部分提取了
        // 发布订阅 只传入元素
        // show : function ($elem) {
        //     // $elem.html('<p>showCallback回调函数相当于在这里执行操作</p>')
        //
        //     // 状态如果是show或者shown，让显示按钮失效
        //     if($elem.data('status') === 'show') return;
        //     if($elem.data('status') === 'shown') return;
        //
        //     // 判断是否传入了回调函数
        //     // if(typeof showCallback === 'function')  showCallback();
        //
        //     // 利用回调函数还是不利于团队合作，可以采用发布订阅的方式  发布=触发事件  订阅=绑定事件
        //
        //     console.log($elem.data('status'));
        //     $elem.data('status','show').trigger('show');    // 触发事件 show开始
        //     // 直接对传入的元素调用show（）方法
        //     $elem.show();
        //     $elem.data('status','shown').trigger('shown');   // 触发事件 show结束 shown开始
        //
        //     // if(typeof shownCallback === 'function')  shownCallback();
        //     // setTimeout(function () {
        //     //     $elem.html($elem.html()+'<p>shownCallback回调函数相当于在这里执行操作</p>')
        //     // },1000);
        // },

        hide : function ($elem) {
            hide($elem,function () {
                $elem.data('status','hide').trigger('hide');
                $elem.hide();
                $elem.data('status','hidden').trigger('hidden');
            })
        },

        // 自己的hide函数，为了封装性，把相同的部分提取了
        // hide : function ($elem) {
        //     if($elem.data('status') === 'hide') return;
        //     if($elem.data('status') === 'hidden') return;
        //
        //     console.log($elem.data('status'));
        //     $elem.data('status','hide').trigger('hide');
        //     $elem.hide();
        //     $elem.data('status','hidden').trigger('hidden');
        //
        // }
    };
    var css3 = {
        // 约定俗成，下划线开头的function，只用于在局部调用
        _init:function($elem,className){
            $elem.addClass('transition');

            // 自己加的
            $elem.css('overflow','hidden');
            init($elem,function () {
                $elem.addClass(className);
            })
        },
        _show:function($elem,className){
            show($elem,function () {
                $elem.off('transitionend').one('transitionend',function () {
                    $elem.data('status','show').trigger('shown');
                })
                $elem.show();
                setTimeout(function () {
                    $elem.removeClass(className);
                },20);
            })
        },
        _hide:function($elem,className){
            hide($elem,function () {
                $elem.off('transitionend').one('transitionend',function () {
                    $elem.hide();
                    $elem.data('status','hidden').trigger('hidden');
                })

                // 这里height设置，是自己移过来的。
                $elem.height($elem.height());

                $elem.addClass(className);
            })
        },
        fade:{
            init: function($elem){
                // $elem.addClass('transition');
                // // 调用封装好的初始化函数
                // init($elem,function () {
                //     $elem.addClass('fadeOut');
                // })
                css3._init($elem,'fadeOut');
            },
            // 自己的初始化，为了封装性，把初始化相同的部分提取出去
            // init:function($elem){
            //     // 初始化的时候 自动添加一个transition的类，因为fade需要transition的过渡动画
            //     $elem.addClass('transition');
            //     if($elem.is(':hidden')){
            //         $elem.data('status','hidden');
            //         // 同理 初始化的时候如果是隐藏状态 自动添加 fadeOut
            //         $elem.addClass('fadeOut');
            //     }else{
            //         $elem.data('status','shown');
            //     }
            // },

            show : function ($elem) {
                css3._show($elem,'fadeOut');
            },

            // 自己的show函数，为了封装性，把相同的部分提取了
            // show : function ($elem) {
            //     if($elem.data('status') === 'show') return;
            //     if($elem.data('status') === 'shown') return;
            //
            //     $elem.data('status','show').trigger('show');
            //     // $elem.one('transitionend',function () {      // 这里用one，不用on，不然每次执行都会绑定一个新的，越来越多。 或者用on之后用off干掉
            //     // 每次elem绑定事件之前，都取消之前的事件，然后重新绑定。  这样子点击显示，然后显示过程没结束就点击隐藏，此时会解除掉之前绑定的显示事件下的操作，重新绑定隐藏操作下需要执行的事件
            //     $elem.off('transitionend').one('transitionend',function () {
            //         $elem.data('status','show').trigger('shown');
            //     })
            //     // 上面是激发$elem额外绑定的事件，下面才是显示
            //     $elem.show();
            //     // 异步  设计一个延迟，不然show（）和下面更改css样式基本是同时执行的，很快，达不到预期的效果
            //     setTimeout(function () {
            //         // 可以这样添加css，但是最优的办法永远是添加移除class，所以新建一个fadeOut样式，把visibility和opacity放到fadeOut里面
            //         // $elem.css({
            //         //     'visibility':'visible',
            //         //     'opacity':1
            //         // });
            //         $elem.removeClass('fadeOut');
            //     },40);
            // },

            hide : function ($elem) {
                css3._hide($elem,'fadeOut');
            },

            // 自己的hide函数，为了封装性，把相同的部分提取了
            // hide : function ($elem) {
            //     if($elem.data('status') === 'hide') return;
            //     if($elem.data('status') === 'hidden') return;
            //
            //     $elem.data('status','hide').trigger('hide');
            //     // 同样在上面激发元素绑定的hide这个事件，下面开始隐藏
            //     // 动画执行完之后元素会有一个事件transitionend，只需要监听这个事件，然后绑定
            //     // $elem.one('transitionend',function () {  // 这里用one，不用on，不然每次执行都会绑定一个新的，越来越多。 或者用on之后用off干掉
            //     $elem.off('transitionend').one('transitionend',function () {
            //         // 动画执行完之后，display改为hidden
            //         $elem.hide();
            //         // 隐藏完成，激发元素绑定的hidden事件
            //         $elem.data('status','hidden').trigger('hidden');
            //     })
            //     $elem.addClass('fadeOut');
            // }
        },
        slideUpDown:{
            init: function($elem){
                // 注意： box的高度除了设置height和padding能撑起来，还可以被里面的内容撑起来。 此时没有height和padding属性，就没有动画变化。
                // 所以，可以获取高度，然后传到元素的高度属性。  这样元素会自动添加 style="height:72px; display:block" 这样的样式，然后动画就会生效
                // 元素要加overflown：hidden
                $elem.height($elem.height());

                css3._init($elem, 'slideUpDownCollapse');
            },
            show : function ($elem) {
                css3._show($elem,'slideUpDownCollapse');
            },
            hide : function ($elem) {
                css3._hide($elem,'slideUpDownCollapse');
            }
        },
        slideLeftRight:{
            init: function($elem){
                $elem.width($elem.width());
                $elem.addClass('transition');
                init($elem,function () {
                    $elem.addClass('slideLeftRightCollapse');
                })
            },
            show : function ($elem) {
                css3._show($elem,'slideLeftRightCollapse');
            },
            hide : function ($elem) {
                css3._hide($elem,'slideLeftRightCollapse');
            }
        },
        fadeSlideUpDown:{
            init: function($elem){
                $elem.height($elem.height());
                $elem.addClass('transition');
                init($elem,function () {
                    $elem.addClass('fadeOut slideUpDownCollapse');
                })
            },
            show : function ($elem) {
                css3._show($elem,'fadeOut slideUpDownCollapse');
            },
            hide : function ($elem) {
                css3._hide($elem,'fadeOut slideUpDownCollapse');
            }
        },
        fadeSlideLeftRight:{
            init: function($elem){
                $elem.width($elem.width());
                $elem.addClass('transition');
                init($elem,function () {
                    $elem.addClass('fadeOut slideLeftRightCollapse');
                })
            },
            show : function ($elem) {
                css3._show($elem,'fadeOut slideLeftRightCollapse');
            },
            hide : function ($elem) {
                css3._hide($elem,'fadeOut slideLeftRightCollapse');
            }
        }
    };
    var js = {
        _init:function($elem){
            // css样式的动画效果会跟js起冲突，所以初始化的时候移除一切风险
            $elem.removeClass('transition');
            init($elem);
        },
        _customInit : function($elem,options){
            // 上面的init是针对jQuery封装好的动画的初始化。  自己写的动画初始化不一样
            // 设置一个对象来保存初始化之前/隐藏之前 元素的属性。
            var styles = {};

            for(var p in options){
                styles[p] = $elem.css(p);
            }
            // 局部的styles对象，需要写在元素的属性中被带出去，才能在别的方法中使用
            $elem.data('styles',styles);

            $elem.removeClass('transition');
            init($elem,function () {
                // 初始化判断是否隐藏，隐藏的话，就让他以js的方式隐藏，避免通过js方式显示的时候无效
                $elem.css(options);
            });
        },
        _show:function($elem,mode){
            // 调用全局下的 show方法。  全局下show 主要是 判断+回调函数
            show($elem,function () {
                // js封装好了的fadeIn    可以传入一个回调函数，在fadeIn执行完毕的时候执行回调函数
                // stop()取消之前的操作，直接执行下一个操作    相当于css3里面的off取消变化
                // 传入的mode是当作字符串处理，就不能通过点来调取方法，就用方括号
                $elem.stop()[mode](function () {
                    // fadeIn执行完之后，修改$elem的status属性为shown，然后触发该元素绑定的shown事件
                    $elem.data('status','shown').trigger('shown');
                });
            })
        },
        _customShow : function($elem){
            show($elem,function () {
                $elem.show();
                $elem.stop().animate($elem.data('styles'),function () {
                    $elem.data('status','shown').trigger('shown');
                })
            });

        },
        _hide:function($elem,mode){
            hide($elem,function () {
                $elem.stop()[mode](function () {
                    $elem.stop().data('status','hidden').trigger('hidden');
                });
            })
        },
        _customHide : function($elem){
            var styles = {};
            for(var p in $elem.data('styles')){
                styles[p] = 0;
            }
            hide($elem,function () {
                $elem.stop().animate(styles,function () {
                    $elem.hide();
                    $elem.data('status','hidden').trigger('hidden');
                })
            });
        },
        fade:{
            init:function ($elem){
                js._init($elem);
            },
            show : function ($elem) {
                js._show($elem,'fadeIn');
            },
            hide : function ($elem) {
                js._hide($elem,'fadeOut');
            }
        },
        slideUpDown:{
            init:function($elem){
                js._init($elem);
            },
            show : function ($elem) {
                js._show($elem,'slideDown');
            },
            hide : function ($elem) {
                js._hide($elem,'slideUp');
            }
        },
        // slideLeftRight没有封装好的函数，需要自己写。原理，利用js控制css属性
        slideLeftRight:{
            init:function($elem){
                js._customInit($elem,{
                    'width':0,
                    'padding-left':0,
                    'padding-right':0,
                })
            },
            // 封装之前的初始化
            // init:function($elem){
            //     // 设置一个对象来保存初始化之前/隐藏之前 元素的属性。
            //     var styles = {};
            //     styles['width'] = $elem.css('width');
            //     styles['padding-left'] = $elem.css('padding-left');
            //     styles['padding-right'] = $elem.css('padding-right');
            //     // 局部的styles对象，需要写在元素的属性中被带出去，才能在别的方法中使用
            //     $elem.data('styles',styles);
            //
            //     $elem.removeClass('transition');
            //     init($elem,function () {
            //         // 初始化判断是否隐藏，隐藏的话，就让他以js的方式隐藏，避免通过js方式显示的时候无效
            //         $elem.css({
            //             'width':0,
            //             'padding-left':0,
            //             'padding-right':0,
            //         });
            //     });
            // },
            show : function ($elem) {
                // 调用全局的show判断
                show($elem,function () {
                    var styles = $elem.data('styles');
                    // 调用js内部的show，让元素显示，然后在进行动画
                    $elem.show();
                    $elem.stop().animate({
                        'width' : styles['width'],
                        'padding-left' : styles['padding-left'],
                        'padding-right': styles['padding-right'],
                    },function () {
                        $elem.data('status','shown').trigger('shown');
                    })
                });
            },
            hide : function ($elem) {
                hide($elem,function () {
                    $elem.stop().animate({
                        'width' : 0,
                        'padding-left' : 0,
                        'padding-right': 0,
                    },function () {
                        // 动画完成之后  隐藏元素，触发绑定事件
                        $elem.hide();
                        $elem.data('status','hidden').trigger('hidden');
                    })
                });
            }
        },
        fadeSlideUpDown:{
            init:function($elem){
                js._customInit($elem,{
                    'opacity':0,
                    'height':0,
                    'padding-top':0,
                    'padding-bottom':0,
                })
            },
            show : function($elem){
                js._customShow($elem);
            },

            // 封装前的show
            // show : function ($elem) {
            //     show($elem,function () {
            //         var styles = $elem.data('styles');
            //         $elem.show();
            //         $elem.stop().animate({
            //             'opacity' : styles['opacity'],
            //             'height' : styles['height'],
            //             'padding-top' : styles['padding-top'],
            //             'padding-bottom': styles['padding-bottom'],
            //         },function () {
            //             $elem.data('status','shown').trigger('shown');
            //             console.log("11")
            //         })
            //     });
            // },

            hide : function ($elem) {
                js._customHide($elem);
            },

            // 封装前的hide
            // hide : function ($elem) {
            //     hide($elem,function () {
            //         $elem.stop().animate({
            //             'opacity' : 0,
            //             'height' : 0,
            //             'padding-top' : 0,
            //             'padding-bottom': 0,
            //         },function () {
            //             $elem.hide();
            //             $elem.data('status','hidden').trigger('hidden');
            //         })
            //     });
            // }
        },
        fadeSlideLeftRight:{
            init:function($elem){
                js._customInit($elem,{
                    'opacity':0,
                    'width':0,
                    'padding-top':0,
                    'padding-bottom':0,
                })
            },
            show : function ($elem) {
                js._customShow($elem);
            },
            hide : function ($elem) {
                js._customHide($elem);
            }
        }
    };


    var defaults = {
        css3 : false,
        js : false,
        animation : 'fade',
    };
    function showHide($elem,options) {
        var mode = null;
        // 里面三个参数，后面的，对应覆盖前面的，如果没有，就不会修改。  所以，效果就是，如果没有设置defaults就传空。
        // 如果有defaults但是不传参，就是defaults。  如果传入options，或者options只有某几个属性，那么就会把这某几个属性改成options，其他还是defaults的
        options = $.extend({},defaults,options);

        if(options.css3){  // css3 transition
            // 判断，如果用户传值错了，执行默认效果
            mode = css3[options.animation] || css3[defaults.animation];
        }else if(options.js){   // js animation
            mode = js[options.animation] || js[defaults.animation];
        }else{    // no animation
            mode = silent;
        }
        mode.init($elem);
        return{
            show: mode.show,
            hide: mode.hide,
        };
    }



    $.fn.extend({
        showHide : function (option) {
            return this.each(function () {
                var $this = $(this),
                    // 如果每次都对mode进行赋值，主函数会调用三次这个showHide。分别是，初始传参，两个bottom绑定的事件
                    // 把mode对象，存在对象的data属性里面，第一次执行，就会给mode赋值，如果没有，就先是null，然后下面if执行，赋值
                    // 如果有了，就不执行if，直接从当前元素的属性中读取
                    mode = $this.data('showHide');
                if(!mode){
                    // 如果option是一个对象，他就会把option传入，如果不是对象，就不会执行，会传入 typeof option === 'object'    为false
                    // $this.data[showHide] = mode
                    $this.data('showHide',mode = showHide($this,typeof option === 'object' && option))
                }

                if(typeof mode[option] === 'function'){
                    // 是函数 才会执行
                    mode[option]($this);
                }
            });
        }
    })


    // 通过在window下设置一个对象，把这个函数带出去
    window.mt = window.mt || {};
    window.mt.showHide = showHide;
})(jQuery);