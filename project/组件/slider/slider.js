// 每次控制两张图片
(function ($) {
    'use strict';
    console.log("slider.js imported");
    function Slider($elem,options){
        this.$elem = $elem;
        this.options = options;

        this.$items = this.$elem.find('.slider-item');
        this.$indicators = this.$elem.find('.slider-indicator');
        this.$controls = this.$elem.find('.slider-control');

        // this.$controlLeft = this.$elem.find('.slider-control-left');
        // this.$controlRight = this.$elem.find('.slider-control-right');

        this.itemNum = this.$items.length;
        // 矫正一下  防止传进来的参数就是超过了index范围
        this.curIndex = this._getCorrectIndex(this.options.activeIndex);

        this._init();
    }
    Slider.DEFAULTS = {
        css3: false,
        js: false,
        animation: 'fade',
        activeIndex: 2,
        interval: 500,
    };

    Slider.prototype._init = function(){
        var self = this;
        this.$elem.trigger('slider-show',[this.curIndex,this.$items[this.curIndex]]);

        // init show
        this.$indicators.removeClass('slider-indicator-active');
        this.$indicators.eq(this.curIndex).addClass('slider-indicator-active');

        // to
        if(this.options.animation == 'slide'){

            // send message
            this.$items.on('move moved',function (e) {
                var index = self.$items.index(this);

                if(e.type === 'move'){
                    if(index === self.curIndex){
                        self.$elem.trigger('slider-hide',[index,this]);
                    }else{
                        self.$elem.trigger('slider-show',[index,this]);
                    }
                }else{          // moved
                    if(index === self.curIndex){
                        // hidden 和 shown需要颠倒过来，因为 _slide函数里，设置了一个计时器，计时器结束后才更新curIndex
                        self.$elem.trigger('slider-hidden',[index,this]);
                    }else{
                        self.$elem.trigger('slider-shown',[index,this]);
                    }
                }
                self.$elem.trigger('slider-' + e.type, [self.$items.index(this),this]);
            });

            this.to = this._slide;
            this.$items.eq(this.curIndex).css('left',0);
            this.$elem.addClass('slider-slide');

            this.itemWidth = this.$items.eq(0).width();

            // move 初始化
            this.$items.move(this.options);

            // js运动方式， 添加了transition会影响，  为了避免每次运动都判断是css还是js。  可以采取这种方式一次判断。
            // 如果某个item有transition，那这个变量就是transition，如果没有，这个变量就是空字符串。说明是js。 下面不会添加或者删除class。
            // 切这个必须放在  .move()执行之后，因为transition是在move初始化的时候给元素添加的
            this.transitionClass = this.$items.eq(0).hasClass('transition') ? 'transition' : '';
        }else{   // fade

            // send message
            this.$items.on('show shown hide hidden', function (e) {
                //     console.log("--");
                // self.$items.index(this) 当前的图片是第几个    this当前想要显示的dom元素
                self.$elem.trigger('slider-' + e.type, [self.$items.index(this),this]);
            });

            this.to = this._fade;
            this.$elem.addClass('slider-fade');
            this.$items.eq(this.curIndex).show();
            // showHide 初始化
            this.$items.showHide(this.options);
        }

        // bind event
        this.$elem.hover(function () {
            self.$controls.show();
            // self.$controlLeft.show();
            // self.$controlRight.show();
        },function () {
            self.$controls.hide();
            // self.$controlLeft.hide();
            // self.$controlRight.hide();
        })
        // 采用事件代理。  通过左右两个按钮的父容器来给两个按钮绑定事件
        this.$elem.on('click','.slider-control-left',function () {
            self.to(self._getCorrectIndex(self.curIndex - 1),1);
        }).on('click','.slider-control-right',function () {
            self.to(self._getCorrectIndex(self.curIndex + 1),-1);
        })
            //通过事件代理 给indicator 绑定
            .on('click','.slider-indicator',function () {
                // console.log(self.$indicators);                   // self.$indicators 是一个数组，里面包含所有小圆点
                // console.log(self.$indicators.index(this));       // 返回当前的小圆点  在这个数组中的index
                // 里面的this指的是点击的那个小圆点点，
                self.to(self._getCorrectIndex(self.$indicators.index(this)));
            });

        // this.$controlLeft.on('click',function () {
        //     self.to(self.curIndex - 1);
        // })
        // this.$controlRight.on('click',function () {
        //     self.to(self.curIndex + 1);
        // })

        // auto
        if(this.options.interval && !isNaN(Number(this.options.interval))){    // isNaN  是否是非数值。   !isNaN  不是非数值，即 是数值
            // this.$elem.hover(function (){
            //     console.log("---")
            // },function () {
            //     console.log("***")
            // });
            this.$elem.hover($.proxy(this.pause,this),$.proxy(this.auto,this));
            this.auto();
        }
    };
    Slider.prototype._getCorrectIndex = function(index){
        if(isNaN(Number(index)))    return 0;
        if(index < 0)   return this.itemNum - 1;
        if(index > this.itemNum - 1)    return 0;
        return index;
    };
    Slider.prototype._activeIndicators = function(index){
        this.$indicators.eq(this.curIndex).removeClass('slider-indicator-active');
        this.$indicators.eq(index).addClass('slider-indicator-active');
    };
    Slider.prototype.to = function(index){
        // 为了只判断一次  to方法放到init里面
    };
    Slider.prototype._fade = function(index){
        // 当前索引值就是要跳转的索引值 什么都不做
        if(index === this.curIndex) return;

        this.$items.eq(this.curIndex).showHide('hide');
        this.$items.eq(index).showHide('show');

        this._activeIndicators(index);

        this.curIndex = index;
        // console.log(this.curIndex);
    };
    Slider.prototype._slide = function(index,direction){
        var self = this;

        if(this.curIndex == index)  return;

        // 确定滑入滑出的方向
        if(!direction){
            if(this.curIndex < index){
                direction = -1;
            }else if(this.curIndex > index){
                direction = 1;
            }
        }
        // 设置指定滑入幻灯片的初始位置
        // 幻灯片放入初始位置的过程需要瞬间，所以需要移除transition
        this.$items.eq(index).removeClass(this.transitionClass).css('left',-1 * direction * this.itemWidth);

        // 当前幻灯片滑出可视区域，指定幻灯片划入可视区域
        // 设置一个延迟 异步
        setTimeout(function () {
            self.$items.eq(self.curIndex).move('x',direction * self.itemWidth);
            self.$items.eq(index).addClass(self.transitionClass).move('x',0);
            // 这整个过程是 _slide里面最慢的，所以需要等这个过程执行完之后，再更新index。  不然就会导致，index更新之后 再去执行这个操作
            self.curIndex = index;
        },20);

        // 激活indicator
        this._activeIndicators(index);

    };
    Slider.prototype.auto = function(){
        var self = this;
        this.intervalId = setInterval(function () {
            self.to(self._getCorrectIndex(self.curIndex + 1),-1);
        },this.options.interval)
    };
    Slider.prototype.pause = function(){
        clearInterval(this.intervalId);
    };

    $.fn.extend({
        slider: function (option) {
            return this.each(function () {
                var $this = $(this),
                    slider = $this.data('slider'),
                    options = $.extend({},Slider.DEFAULTS,$this.data(),typeof option === 'object' && option);

                if(!slider){
                    $this.data('slider',slider = new Slider($this,options));
                }

                if (typeof slider[option] === 'function'){
                    slider[option]();
                }
            })
        }
    })
})(jQuery)


// 所有图片作为一个长条 整体 操作
// (function ($) {
//     'use strict';
//
//     function Slider($elem,options){
//         this.$elem = $elem;
//         this.options = options;
//
//         this.$items = this.$elem.find('.slider-item');
//         this.$indicators = this.$elem.find('.slider-indicator');
//         this.$controls = this.$elem.find('.slider-control');
//
//         // this.$controlLeft = this.$elem.find('.slider-control-left');
//         // this.$controlRight = this.$elem.find('.slider-control-right');
//
//         this.itemNum = this.$items.length;
//         // 矫正一下  防止传进来的参数就是超过了index范围
//         this.curIndex = this._getCorrectIndex(this.options.activeIndex);
//
//         this._init();
//     }
//     Slider.DEFAULTS = {
//         css3: false,
//         js: false,
//         animation: 'fade',
//         activeIndex: 2,
//         interval: 500,
//         loop: false,
//     };
//
//     Slider.prototype._init = function(){
//         var self = this;
//
//         // init show
//         this.$indicators.removeClass('slider-indicator-active');
//         this.$indicators.eq(this.curIndex).addClass('slider-indicator-active');
//
//         // to
//         if(this.options.animation == 'slide'){
//             this.to = this._slide;
//             this.$elem.addClass('slider-slide');
//             this.$container = this.$elem.find('.slider-container');
//             this.itemWidth = this.$items.eq(0).width();
//             this.$container.css('left', -1 * this.curIndex * this.itemWidth);
//             // move init
//             this.$container.move(this.options);
//
//             if(this.options.loop){
//                 // 如果 .append(this.$items.eq(0))  就会把原来的这个0号元素移过来。  原来的会消失
//                 this.$container.append(this.$items.eq(0).clone());
//                 //
//                 this.itemNum ++;
//                 // 解决 item到最后一个，第一个瞬间回到最后的时候，不要动画的问题
//                 this.transitionClass = this.$container.hasClass('transition') ? 'transition' : '';
//             }
//         }else{   // fade
//             // send message
//             this.$items.on('move moved',function (e) {
//                 var index = self.$items.index(this);
//
//                 if(e.type === 'move'){
//                     if(index === self.curIndex){
//                         self.$elem.trigger('slider-hide',[index,this]);
//                     }else{
//                         self.$elem.trigger('slider-hide',[index,this]);
//                     }
//                 }else{          // moved
//                     if(index === self.curIndex){
//                         // hidden 和 shown需要颠倒过来，因为 _slide函数里，设置了一个计时器，计时器结束后才更新curIndex
//                         self.$elem.trigger('slider-hidden',[index,this]);
//                     }else{
//                         self.$elem.trigger('slider-shown',[index,this]);
//                     }
//                 }
//                 self.$elem.trigger('slider-' + e.type, [self.$items.index(this),this]);
//             })
//
//             this.to = this._fade;
//             this.$elem.addClass('slider-fade');
//             this.$items.eq(this.curIndex).show();
//             // showHide 初始化
//             this.$items.showHide(this.options);
//         }
//
//         // bind event
//         this.$elem.hover(function () {
//             self.$controls.show();
//             // self.$controlLeft.show();
//             // self.$controlRight.show();
//         },function () {
//             self.$controls.hide();
//             // self.$controlLeft.hide();
//             // self.$controlRight.hide();
//         })
//         // 采用事件代理。  通过左右两个按钮的父容器来给两个按钮绑定事件
//         this.$elem.on('click','.slider-control-left',function () {
//             self.to(self._getCorrectIndex(self.curIndex - 1),1);
//         }).on('click','.slider-control-right',function () {
//             self.to(self._getCorrectIndex(self.curIndex + 1),-1);
//         })
//             //通过事件代理 给indicator 绑定
//             .on('click','.slider-indicator',function () {
//                 // console.log(self.$indicators);                   // self.$indicators 是一个数组，里面包含所有小圆点
//                 // console.log(self.$indicators.index(this));       // 返回当前的小圆点  在这个数组中的index
//                 // 里面的this指的是点击的那个小圆点点，
//                 self.to(self._getCorrectIndex(self.$indicators.index(this)));
//             });
//
//         // this.$controlLeft.on('click',function () {
//         //     self.to(self.curIndex - 1);
//         // })
//         // this.$controlRight.on('click',function () {
//         //     self.to(self.curIndex + 1);
//         // })
//
//         // auto
//         if(this.options.interval && !isNaN(Number(this.options.interval))){    // isNaN  是否是非数值。   !isNaN  不是非数值，即 是数值
//             // this.$elem.hover(function (){
//             //     console.log("---")
//             // },function () {
//             //     console.log("***")
//             // });
//             this.$elem.hover($.proxy(this.pause,this),$.proxy(this.auto,this));
//             this.auto();
//         }
//     };
//     Slider.prototype._getCorrectIndex = function(index,maxNum){
//         maxNum = maxNum || this.itemNum;
//
//         if(isNaN(Number(index)))    return 0;
//         if(index < 0)   return maxNum - 1;
//         if(index > maxNum - 1)    return 0;
//         return index;
//     };
//     Slider.prototype._activeIndicators = function(index){
//         // this.$indicators.eq(this.curIndex).removeClass('slider-indicator-active');
//         this.$indicators.removeClass('slider-indicator-active');
//         this.$indicators.eq(index).addClass('slider-indicator-active');
//     };
//     Slider.prototype.to = function(index){
//         // 为了只判断一次  to方法放到init里面
//     };
//     Slider.prototype._fade = function(index){
//         // 当前索引值就是要跳转的索引值 什么都不做
//         if(index === this.curIndex) return;
//
//         this.$items.eq(this.curIndex).showHide('hide');
//         this.$items.eq(index).showHide('show');
//
//         this._activeIndicators(index);
//
//         this.curIndex = index;
//         // console.log(this.curIndex);
//     };
//     Slider.prototype._slide = function(index,direction){
//         if(this.curIndex === index) return;
//         this.$container.move('x', -1 * index * this.itemWidth);
//
//         var self = this;
//         // 必须在定时器之前修改curIndex
//         this.curIndex = index;
//
//         // 为了让 附加的克隆的第一张图片 能正确匹配indicator    前面index是正常的0-1-2-3  但是，下面经过getCorrectIndex之后就变成了0-1-2-3-4，所以需要改写一下矫正函数。
//         // 如果循环开启，矫正函数根据当前item的数量还要减一
//         if(this.options.loop && direction){
//             if(direction < 0){   // click right control
//                 if(index === 0){
//
//                     this.$container.removeClass(this.transitionClass).css('left',0);
//                     this.curIndex = index = 1;
//                     setTimeout(function () {
//                         self.$container.addClass(self.transitionClass).move('x',-1 * index * self.itemWidth);
//                     },20);
//                 }
//             }else{   // click left control
//                 if(index === this.itemNum - 1){
//                     // 瞬间从0 跳到最后那个0的复制   然后正常运动。
//                     this.$container.removeClass(this.transitionClass).css('left',-1 * index * this.itemWidth);
//                     // 这里本来是在move之后，更新curIndex，但是为了异步加了计时器之后，需要先更新，再执行move。
//                     this.curIndex = index = this.itemNum - 2;
//                     setTimeout(function () {
//                         self.$container.addClass(self.transitionClass).move('x',-1 * index * self.itemWidth);
//                     },20);
//                 }
//             }
//             index = this._getCorrectIndex(index,this.itemNum - 1);
//         }
//         this._activeIndicators(index);
//     };
//     Slider.prototype.auto = function(){
//         var self = this;
//         this.intervalId = setInterval(function () {
//             // auto 相当于点击right control就好了。  传入一个方向， -1。
//             self.to(self._getCorrectIndex(self.curIndex + 1),-1);
//         },this.options.interval)
//     };
//     Slider.prototype.pause = function(){
//         clearInterval(this.intervalId);
//     };
//
//     $.fn.extend({
//         slider: function (option) {
//             return this.each(function () {
//                 var $this = $(this),
//                     slider = $this.data('slider'),
//                     options = $.extend({},Slider.DEFAULTS,$this.data(),typeof option === 'object' && option);
//
//                 if(!slider){
//                     $this.data('slider',slider = new Slider($this,options));
//                 }
//
//                 if (typeof slider[option] === 'function'){
//                     slider[option]();
//                 }
//             })
//         }
//     })
// })(jQuery)