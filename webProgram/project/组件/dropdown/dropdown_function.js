// 一个自我调用的匿名函数
// 传入jQuery这个变量，设置局部变量为$， 结果就是传入jQuery，然后局部变量$=jQuery，这样做，防止$被占用（被占用这里就会报错），但是jQuery很少会被占用
(function ($) {
    'use strict';

    // --------------------------------------用构造函数实现--------------------------------------
    // 构造函数
    function Dropdown(elem,options) {
        this.$elem = $(elem),
        // 不通过this保存，只能在构造函数局部调用，没法通过 object.options 这种方法，在外面直接调用对象的属性。
        // 用this传递一下，就相当于每个dropdown对象都有这个属性了
        this.options = options,
        this.$layer = this.$elem.find('.dropdown-layer'),
        this.activeClass = options.active + '-active';
        this.$layer.showHide(options);

        var self = this;

        // 在showHide里面，已经trigger发送了消息，并在执行showHide的对象上接收了。 所以，只需要直接绑定消息的事件，然后执行就可以了。不需要又在dropdown对象的show，hide方法里面去trigger消息
        this.$layer.on('show shown hide hidden',function (e) {
            // console.log(e.type);
            // 但此时，showHide的对象是layer，需要把layer的show hide状态消息转化为$elem的下拉菜单状态消息
            // 此时就可以用dropdown当前的对象去接受消息，执行操作
            self.$elem.trigger('dropdown-'+ e.type);
        })
        // 错误写法。  前面，包括下面这行第一个this，指代的都是Dropdown这个对象，但是hover后面的this，指代的是hover这个事件前面的对象，即this.$elem，这是一个dom元素。无法调用show，hide方法
        // this.$elem.hover(this.show(),this.hide());

        // 把dropdown对象保存下来，然后在事件里直接针对对象来调用方法
        // var self = this;
        // this.$elem.hover(function () {
        //     self.show();
        // },function (){
        //     self.hide();
        // });

        // 另外一种写法，利用$.proxy()修改函数的指定对象
        // 在proxy里，this指代的还是dropdown对象，把show的对象转变成this，返回的还是show这个函数，只是修改了函数对象而已。  前面也利用到了proxy进行传参
        // this.$elem.hover($.proxy(this.show,this),$.proxy(this.show,this));

        if(options.event === 'click'){
            this.$elem.click(function (e) {
                    // 在外面保存对象，在里面调用对象方法。   方法里面this 指代的是事件前面的this.$elem，是一个dom对象
                    self.show();
                    // 阻止事件冒泡，因为，点击$elem的时候，会冒泡到document上面，document绑定了click事件也会被触发，效果就是点击后show执行，立马执行了hide
                    e.stopPropagation();
            });
            // 两种绑定click事件的方法。  直接 .click(function)  和 .on('click',function)
            $(document).on('click',$.proxy(this.hide,this));
        }else{
            this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));
        }

    }
    // show和hide方法可以在构造函数里写。 但是，每次我们实例化一个对象，都会开辟一个新空间，重新存放一次这两个函数本体。
    // 但实际上对于所有对象，这两个函数是一样的，不需要重新存放函数。 所以，可以在对象的原型中写入函数，然后new对象的时候，只需要存放对象本身就行了
    // new出来的新对象可以通过原型链去查找show和hide方法
    Dropdown.prototype.show = function(){
        // 设置定时效果，可以当鼠标连续从第一个按钮经过第二个划到第三个的时候，第二个下拉菜单不显示。因为第二个菜单刚执行show，开了定时器，具体show函数没执行，就执行了hide，清除了定时器
        // 判断一下需不需要定时器。不需要定时器就直接执行。 因为，如果用户输入delay为0，不需要定时器，定时器延迟设为0，依旧会等待排队完成，才开始设置定时器开始执行。
        // 差距不大，可以增加这个判断，也可以不要
        if(this.options.delay){
            // timer 里的function 内部的this，指代的就是window，而不是当前的dropdown对象了
            var self = this;
            // 把这个计时器要通过this保存在对象中，然后调用hide的时候，清掉这个计时器
            this.timer = setTimeout(function () {
                self.$elem.addClass(self.activeClass);
                self.$layer.showHide('show');
            },this.options.delay);
        }else{
            this.$elem.addClass(this.activeClass);
            this.$layer.showHide('show');
        }
    };
    Dropdown.prototype.hide = function () {
        if(this.options.delay){
            clearTimeout(this.timer);
        }
        this.$elem.removeClass(this.activeClass);
        this.$layer.showHide('hide');
    };
    // 默认的参数，相当于一个常量，基本不修改。  可以存到prototype，但是原型通常用来保存方法。
    // 构造函数，也可以理解为一个对象，我们可以让对象直接保存这个常量。
    Dropdown.DEFAULTS = {
        event: 'hover',
        css3 : false,
        js : false,
        animation : 'fade',
        delay : 0,
        active : 'dropdown',
    };

    // --------------------------------------直接用function实现--------------------------------------
    function dropdown(element,options) {
        var $elem = $(element),
            $layer = $elem.find('.dropdown-layer'),
            activeClass = $elem.data('active') + '-active';

        $layer.showHide(options);

        $elem.hover(function () {
            $elem.addClass(activeClass);
            $layer.showHide('show');
        },function () {
            $elem.removeClass(activeClass);
            $layer.showHide('hide');
        })
    }

    var defaults = {
        css3 : false,
        js : false,
        animation : 'fade',
    };

    // 直接function调用的jQuery拓展
    // $.fn.extend({
    //     dropdown_extend:function (option) {
    //         return this.each(function () {
    //             // 里面三个参数，后面的，对应覆盖前面的，如果没有，就不会修改。  所以，效果就是，如果没有设置defaults就传空。
    //             // 如果有defaults但是不传参，就是defaults。  如果传入options，或者options只有某几个属性，那么就会把这某几个属性改成options，其他还是defaults的
    //             var options = $.extend({},defaults,option);
    //             dropdown(this,options);
    //         });
    //     }
    // });

    // 用构造函数实现的jQuery拓展
    $.fn.extend({
        dropdown_extend:function (option) {
            return this.each(function () {
                // console.log($(this).data);
                // 如果元素属性data-active已经有了，用户没有在option传入active参数，就会选择到已经有的data-active
                var options = $.extend({},Dropdown.DEFAULTS,$(this).data(),option);
                new Dropdown(this,options);
            });
        }
    });
})(jQuery)