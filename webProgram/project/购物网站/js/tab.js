(function ($) {
    'use strict';
    function Tab($elem,options){
        this.$elem = $elem;
        this.options = options;
        this.$container = this.$elem.find('.container');

        this.$items = this.$elem.find('.tab-item');
        this.$panels = this.$elem.find('.tab-panel');

        this.itemNum = this.$items.length;
        this.curIndex = this._getCorrectIndex(this.options.activeIndex);

        this._init();
    }

    Tab.DEFAULTS = {
        event: 'mouseenter', // click
        css3: false,
        js: false,
        animation: 'fade',
        activeIndex: 0,
        interval: 0,
        delay: 0,
    };
    Tab.prototype._init = function(){
        var self = this,
            timer = null;

        // init show
        this.$items.removeClass('tab-item-active');
        this.$items.eq(this.curIndex).addClass('tab-item-active');

        this.$panels.eq(this.options.activeIndex).show();
        // this.$panels.eq(this.curIndex).show();
        this.$elem.trigger('tab-show' , [this.curIndex,this.$panels[this.curIndex]]);

        // showHide init
        this.$panels.showHide(this.options);

        // trigger event
        this.$panels.on('show shown hide hidden',function (e) {
            self.$elem.trigger('tab-' + e.type, [self.$panels.index(this),this]);
        });

        // bind event
        this.options.event = this.options.event === 'click' ? 'click' : 'mouseenter';
        this.$elem.on(this.options.event, '.tab-item', function () {
            var tabItem = this;
            // 鼠标从第一个经过第二个移到第三个，到第二个会有定时器，在规定的时间内，鼠标移出去了，则不会执行第二个显示的命令。
            if(self.options.delay){  // delay
                clearTimeout(timer);
                setTimeout(function () {
                    // jQuery内置 $('selector').toggle() 是对元素操作。的如果元素隐藏就显示，如果显示就隐藏   display：none    不适用于visibility:hidden
                    // 此处的toggle是自己写的
                    // this指的是 tab-item
                    self.toggle(self.$items.index(tabItem));
                },self.options.delay);
            }else{   // immediate
                self.toggle(self.$items.index(tabItem));
            }

        });

        // auto
        if(this.options.interval && !isNaN(Number(this.options.interval))){
            this.$container.hover($.proxy(this.pause,this),$.proxy(this.auto,this));
            this.auto();
        }
    };

    Tab.prototype._getCorrectIndex = function(index){
        if(isNaN(Number(index))) return 0;
        if(index < 0)   return this.itemNum - 1;
        if(index > this.itemNum - 1)    return 0;
        return index;
    }
    Tab.prototype.toggle = function(index){
        var self = this;
        if(this.curIndex === index)  return;

        this.$panels.eq(index).showHide('show');
        this.$panels.eq(this.curIndex).showHide('hide');

        this.$items.eq(this.curIndex).removeClass('tab-item-active');
        this.$items.eq(index).addClass('tab-item-active');

        this.curIndex = index;

    };
    Tab.prototype.auto = function(){
        var self = this;
        this.intervalId = setInterval(function () {
            self.toggle(self._getCorrectIndex(self.curIndex+1));
        },this.options.interval);
    };
    Tab.prototype.pause = function(){
        clearInterval(this.intervalId);
    };
    $.fn.extend({
        tab : function (option,value) {
            return this.each(function () {
                var $this = $(this),
                    tab = $this.data('tab'),
                    options = $.extend({},Tab.DEFAULTS,$this.data(),typeof option === 'object' && option);
                if(!tab){   // 是不是第一次

                    $this.data('tab',tab = new Tab($this,options))
                }

                if(typeof tab[option] === 'function'){
                    tab[option](value);
                }
            });
        }
    })
})(jQuery)