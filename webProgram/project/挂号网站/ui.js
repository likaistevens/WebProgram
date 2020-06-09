// 搜索框组件
$.fn.UiSearch = function(){
    var ui = $(this);
    // $(expression, [context])   expression是选择器，后面context是可选，指定某一个范围内选择元素。    在context里面查找expression选中的元素
    $('.ui-search-selected',ui).on('click',function () {
        $('.ui-search-select-list').show();
        // 阻止事件冒泡  跟event.stopPropagation() 同理  如果不阻止，点击'.ui-search-selected' 之后，同时会一直冒泡并触发 $('body').on('click',function ()
        return false;
        // event.stopPropagation();
    });
    $('.ui-search-select-list a',ui).on('click',function () {
        // 选择一个内容后，将selected的内容修改为选择的内容
        $('.ui-search-selected').text($(this).text());
        $('.ui-search-select-list').hide();
        // 阻止事件冒泡  跟event.stopPropagation() 同理
        return false;
        // event.stopPropagation();
    });
    $('body').on('click',function () {
        // 点击任何区域都会隐藏列表
        $('.ui-search-select-list').hide();
    })
}

// 选项卡组件
// ui-tab 定规
/*
*  @param {string} header TAB组件的选项卡切换部分className，里面有若干个 .item
*  @param {string} content TAB组件的内容区域部分className，里面有若干个 .item
*  @option {string} focus_prefix 选项卡高亮样式前缀  可选
* */
$.fn.UiTab = function (header,content,focus_prefix) {
    var ui = $(this);
    // 选项卡标签
    var tabs = $(header,ui);
    // 选项卡里的内容
    var cons = $(content,ui);
    // 有就等于  没有就空白   有些组件需要高亮部分的css样式 不是针对item_focus ，可能会带有一些前缀
    var focus_prefix = focus_prefix || '';
    tabs.on('click',function () {
        // 当前点击的元素 在父元素中的index
        var index = $(this).index();
        tabs.removeClass(focus_prefix + 'item_focus').eq(index).addClass(focus_prefix + 'item_focus');
        cons.hide().eq(index).show();
    })
}

// js 回到顶部组件
$.fn.UiBackTop = function(){
    var ui = $(this);
    var el = $('<a class="ui-backTop" href="#0"></a>');
    ui.append(el);

    $(window).on('scroll',function () {
        // 页面指定了DTD，即指定了DOCTYPE时，使用document.documentElement.scrollTop。
        // 页面没有DTD，即没指定DOCTYPE时，使用document.body.scrollTop。      $('body').scrollTop()
        var top = $(document.documentElement).scrollTop();
        // 用window也是可以的
        // var top = $(window).scrollTop();
        // console.log(top);
        if(top > 300){
            el.show();
        }else{
            el.hide();
        }
    });
    el.on('click',function () {
        // 回到顶部的操作
        $(window).scrollTop(0);
    })
}

// 页面的脚本逻辑
// 1。左右箭头翻页
// 2。翻页进度点联动
// 3。最后一页要回到第一页
// 4。进度点点击要切换对应页面
// 5。没有点击，自动滚动
// 6。滚动过程中屏蔽其他操作
$.fn.UiSlider = function(){
    var ui = $(this);
    var wrap = $('.ui-slide-wrap');
    var btn_prev = $('.ui-slide-arrow .left',ui);
    var btn_next = $('.ui-slide-arrow .right',ui);
    var tips = $('.ui-slide-process .item',ui)
    var items = $('.ui-slide-wrap .item',ui);

    // 预定义
    var current = 0,
        size = items.length,
        width = items.eq(0).width(),
        enableAuto = true;

    // 设置自动滚动感应  鼠标在wrap中，不要自动滚动
    wrap
    .on('mouseover',function () {
        enableAuto = false;
        // console.log('in');
    })
    .on('mouseout',function () {
        enableAuto = true;
        // console.log('out');
    })


    // 具体操作
    wrap
    .on('move_to',function (ev,index) {
        // 当不知道别人的参数有什么作用，传递什么参数，可以在函数里写debugger，然后触发函数后，控制台输入arguments，可以查看这个函数被传递进来什么参数。
        // 下面  wrap.triggerHandler('move_to');，目的是跳转到指定页面，肯定要传入index。 wrap.triggerHandler('move_to',index)。  然后，此处
        // debugger，发现arguments里面就有两个变量，第一个是jQuery.event，第二个是index。所以，就需要在这个函数的arguments里面写两个变量接受传来的两个参数
        // debugger
        // console.log(index,width)
        // wrap元素的偏移，向左
        wrap.css('left',index * width * -1);
        tips.removeClass('item_focus').eq(index).addClass('item_focus');
    })
    .on('move_prev',function () {
        if(current <= 0){
            current = size;
        }
        current = current -1 ;
        wrap.triggerHandler('move_to',current);
    })
    .on('move_next',function () {
        if(current >= size - 1){
            current = -1;
        }
        current = current + 1 ;
        wrap.triggerHandler('move_to',current);
    })
    .on('auto_move',function () {
        // setTimeout 延迟触发，一次    setInterval 循环触发
        setInterval(function () {
            enableAuto && wrap.triggerHandler('move_next');
        },2000);
    })
    .triggerHandler('auto_move');


    // 时间
    btn_prev.on('click',function () {
        wrap.triggerHandler('move_prev');
    });
    btn_next.on('click',function () {
        wrap.triggerHandler('move_next');
    });
    tips.on('click',function () {
        var index = $(this).index();
        wrap.triggerHandler('move_to',index);
    })

}

// 多级联动菜单组件
// 当前菜单发生变化，会重置当前菜单之下所有菜单，更新下一集彩蛋的内容




// 页面的脚本逻辑
$(function () {
    $('.ui-search').UiSearch();

    $('.content-tab').UiTab('.caption > .item', '.block > .item');

    // .content-tab .block .item 每一个item也相当于一个选项卡。
    $('.content-tab .block .item').UiTab('.block-caption > a', '.block-content > .block-wrap','block-caption-');

    $('body').UiBackTop();

    $('.ui-slide').UiSlider();
});
