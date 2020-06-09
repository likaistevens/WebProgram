// (function ($) {
//     'use strict';
//
//     var Silent = function($elem){
//         this.$elem = $elem;
//         this.$elem.removeClass('transition');
//         this.curX = parseFloat(this.$elem.css('top'));
//         this.curY = parseFloat(this.$elem.css('left'));
//     };
//     Silent.prototype.to = function (x,y) {
//         x = (typeof x === 'number') ? x : this.curX;
//         y = (typeof y === 'number') ? y : this.curY;
//
//         // this.$elem.css('top')  返回的是  100px  这样子的形式，需要提取出来转化为数字
//         if(this.curX === x && this.curY === y) return;
//
//         this.$elem.trigger('move',[this.$elem]);
//
//         this.$elem.css({
//             left: x,
//             top: y,
//         });
//         this.curX = x;
//         this.curY = y;
//
//         this.$elem.trigger('moved',[this.$elem]);
//
//     };
//     Silent.prototype.x = function (x) {
//         if(this.curX === x) return;
//         this.$elem.css({
//             left: x,
//         });
//         this.curX = x;
//     };
//     Silent.prototype.y = function (y) {
//         if(this.curY === y) return;
//         this.$elem.css({
//             top: y,
//         });
//         this.curY = y;
//     };
//
//     var Css3 = function($elem){
//         this.$elem = $elem;
//         this.$elem.addClass('transition');
//         this.curX = parseFloat($elem.css('left'));
//         this.curY = parseFloat($elem.css('top'));
//         this.$elem.css({
//             left: this.curX,
//             top: this.curY,
//         });
//     };
//     Css3.prototype.to = function (x,y) {
//         x = (typeof x === 'number') ? x : this.curX;
//         y = (typeof y === 'number') ? y : this.curY;
//
//         if(this.curX === x && this.curY === y) return;
//
//         var self = this;
//
//         this.$elem.trigger('move',[this.$elem]);
//         this.$elem.off('transitionend').one('transitionend',function () {
//             self.$elem.trigger('moved',[self.$elem]);
//         });
//
//         this.$elem.css({
//             left: x,
//             top: y,
//         });
//
//         this.curX = x;
//         this.curY = y;
//     };
//     Css3.prototype.x = function (x) {
//         this.to(x);
//     };
//     Css3.prototype.y = function (y) {
//         this.to(null,y);
//     };
//
//     var Js = function($elem){
//         this.$elem = $elem;
//         // 如果css有transition  js没法执行动画
//         this.$elem.removeClass('transition');
//         this.curX = parseFloat($elem.css('left'));
//         this.curY = parseFloat($elem.css('top'));
//         this.$elem.css({
//             left: this.curX,
//             top: this.curY,
//         });
//     };
//     Js.prototype.to = function (x,y) {
//         x = (typeof x === 'number') ? x : this.curX;
//         y = (typeof y === 'number') ? y : this.curY;
//
//         if(this.curX === x && this.curY === y) return;
//
//         var self = this;
//
//         this.$elem.trigger('move',[this.$elem]);
//         // 开始下一个动画之前停止上一个动画
//         this.$elem.stop().animate({
//             left: x,
//             top: y,
//         },function () {
//             // 这里可以设置  动画完成之后 回调函数
//             self.$elem.trigger('moved',[self.$elem]);
//         });
//
//         this.curX = x;
//         this.curY = y;
//
//     };
//     Js.prototype.x = function (x) {
//         this.to(x);
//     };
//     Js.prototype.y = function (y) {
//         this.to(null,y);
//     };
//
//     var $box = $('#box'),
//         $goBtn = $('#go-btn'),
//         $backBtn = $('#back-btn'),
//         move = new Js($box);
//
//     $box.on('move moved',function (e,$elem) {
//         console.log(e.type);
//         // console.log($elem);
//     });
//     $goBtn.on('click',function () {
//         move.x(50);
//         // move.to(100,50);
//     });
//     $backBtn.on('click',function () {
//         move.x(0);
//         // move.to(0,20);
//     });
//
//
//     $.fn.extend({
//         move: function () {
//
//         }
//     })
//
// })(jQuery)

(function ($) {
    'use strict';

    var init = function ($elem) {
        this.$elem = $elem;
        this.curX = parseFloat(this.$elem.css('left'));
        this.curY = parseFloat(this.$elem.css('top'));
    };

    var to = function ($elem,x,y,callback) {
        x = (typeof x === 'number') ? x : this.curX;
        y = (typeof y === 'number') ? y : this.curY;

        if(this.curX === x && this.curY === y) return;

        this.$elem.trigger('move',[this.$elem]);

        if (typeof callback === 'function')
            callback();

        this.curX = x;
        this.curY = y;
    }

    var Silent = function($elem){
        // add.call(ac,5,3);     // 8     也是相当于 add(5,3)   意思是，add这个方法对ac使用。
        // add.apply(ac,[5,3]);  // 8     apply和call一样的，只不过参数是通过数组传入
        // call和apply都可以改变函数的this的指向。
        init.call(this,$elem);
        this.$elem.removeClass('transition');
        console.log("Silent");
    };
    Silent.prototype.to = function (x,y) {
        // x = (typeof x === 'number') ? x : this.curX;
        // y = (typeof y === 'number') ? y : this.curY;
        //
        // // this.$elem.css('top')  返回的是  100px  这样子的形式，需要提取出来转化为数字
        // if(this.curX === x && this.curY === y) return;
        //
        // this.$elem.trigger('move',[this.$elem]);
        // this.$elem.css({
        //     left: x,
        //     top: y,
        // });
        // this.curX = x;
        // this.curY = y;
        //
        // this.$elem.trigger('moved',[this.$elem]);

        var self = this;
        to.call(this,this.$elem,x,y,function () {
            // call 只是改变开始函数里面this的指向
            // console.log(this);      // undefined
            self.$elem.css({
                left: x,
                top: y,
            });
            self.$elem.trigger('moved',[self.$elem]);
        })
    };
    Silent.prototype.x = function (x) {
        this.to(x);
    };
    Silent.prototype.y = function (y) {
        this.to(null,y);
    };

    var Css3 = function($elem){
        init.call(this,$elem);

        this.$elem.addClass('transition');
        this.$elem.css({
            left: this.curX,
            top: this.curY,
        });
        // console.log("Css3");
    };
    Css3.prototype.to = function (x,y) {
        // x = (typeof x === 'number') ? x : this.curX;
        // y = (typeof y === 'number') ? y : this.curY;
        //
        // if(this.curX === x && this.curY === y) return;
        //
        // var self = this;
        //
        // this.$elem.trigger('move',[this.$elem]);
        // this.$elem.off('transitionend').one('transitionend',function () {
        //     self.$elem.trigger('moved',[self.$elem]);
        // });
        //
        // this.$elem.css({
        //     left: x,
        //     top: y,
        // });
        //
        // this.curX = x;
        // this.curY = y;

        var self = this;
        to.call(this,self.$elem,x,y,function () {
            self.$elem.off('transitionend').one('transitionend',function () {
                self.$elem.trigger('moved',[self.$elem]);
            });
            self.$elem.css({
                left: x,
                top: y,
            });
        })
    };
    Css3.prototype.x = function (x) {
        this.to(x);
    };
    Css3.prototype.y = function (y) {
        this.to(null,y);
    };

    var Js = function($elem){
        init.call(this,$elem);
        // 如果css有transition  js没法执行动画
        this.$elem.removeClass('transition');
        console.log("Js");

    };
    Js.prototype.to = function (x,y) {
        // x = (typeof x === 'number') ? x : this.curX;
        // y = (typeof y === 'number') ? y : this.curY;
        //
        // if(this.curX === x && this.curY === y) return;
        //
        // var self = this;
        //
        // this.$elem.trigger('move',[this.$elem]);
        // // 开始下一个动画之前停止上一个动画
        // this.$elem.stop().animate({
        //     left: x,
        //     top: y,
        // },function () {
        //     // 这里可以设置  动画完成之后 回调函数
        //     self.$elem.trigger('moved',[self.$elem]);
        // });
        //
        // this.curX = x;
        // this.curY = y;

        var self = this;
        to.call(this,this.$elem,x,y,function () {
            self.$elem.stop().animate({
                left: x,
                top: y,
            },function () {
                // 这里可以设置  动画完成之后 回调函数
                self.$elem.trigger('moved',[self.$elem]);
            });
        })
    };
    Js.prototype.x = function (x) {
        this.to(x);
    };
    Js.prototype.y = function (y) {
        this.to(null,y);
    };

    // 测试代码
    // var $box = $('#box'),
    //     $goBtn = $('#go-btn'),
    //     $backBtn = $('#back-btn'),
    //     move = new Silent($box);
    //
    // $box.on('move moved',function (e,$elem) {
    //     console.log(e.type);
    //     // console.log($elem);
    // });
    // $goBtn.on('click',function () {
    //     move.x(50);
    //     // move.to(100,50);
    // });
    // $backBtn.on('click',function () {
    //     move.x(0);
    //     // move.to(0,20);
    // });


    var defaults = {
        css3: false,
        js: false,
    };

    var move = function ($elem,options) {
        var mode = null;
        if(options.css3){
            mode = new Css3($elem);
        }else if(options.js){
            mode = new Js($elem);
        }else{
            mode = new Silent($elem);
        }

        return {
            to: $.proxy(mode.to,mode),
            x: $.proxy(mode.x,mode),
            y: $.proxy(mode.y,mode),
        }
    }

    // move($('#box'),{
    //     css3: true,
    //     js: false,
    // }).to(100);


    $.fn.extend({
        move: function (option,x,y) {
            return this.each(function () {
                var $this = $(this),
                    mode = $this.data('move'),
                    options = $.extend({},defaults,typeof option === 'object' && option);

                if(!mode){
                    // $this.data('color',green)   $this.data('color',color = 'green')  都是对的。
                    // 但是 这里需要move（）的返回值，并保存为mode,并保存在data里
                    $this.data('move',mode = move($this,options));
                }

                if(typeof mode[option] === 'function'){
                    mode[option](x,y);
                }
            })
        }
    })

})(jQuery)