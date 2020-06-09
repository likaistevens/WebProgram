// hover() 方法规定当鼠标指针悬停在被选元素上时要运行的两个函数。
// 方法触发 mouseenter 和 mouseleave 事件
// 这样用js操作，直接修改css样式涉及到重绘和回流，影响性能
// $('.dropdown').hover(function () {
//     var $dropdown = $(this);
//
//     $dropdown.find('.dropdown-toggle').css({
//         'background-color':'#fff',
//         'border-color':'#cdd0d4'
//     });
//     $dropdown.find('.dropdown-arrow').css({
//         'background-image':'url("img/dropdown-arrow-active.png")'
//     });
//     $dropdown.find('.dropdown-layer').show();
//
// },function () {
//     var $dropdown = $(this);
//
//     $dropdown.find('.dropdown-toggle').css({
//         'background-color':'',
//         'border-color':'#f3f5f7'
//     });
//     $dropdown.find('.dropdown-arrow').css({
//         'background-image':'url("img/dropdown-arrow.png")'
//     });
//     $dropdown.find('.dropdown-layer').hide();
//
// })

// /*用js控制增加class属性，来实现下拉菜单*/
// $('.dropdown').hover(function () {
//     $(this).addClass('dropdown-active');
// },function () {
//     $(this).removeClass('dropdown-active');
// })

// 使用组件形式 实现下拉菜单
// 按需加载
(function ($) {
    'use strict';
    /*$('.menu').on('dropdown-show',function (e) {
        console.log($(this));
        var $this = $(this),
            dataLoad = $this.data('load');
        if(!dataLoad)   return;
        if(!$this.data('loaded')){
            var $layer = $this.find('.dropdown-layer'),
                html = '';
            $.getJSON(dataLoad,function (data) {
                setTimeout(function () {
                    for(var i = 0; i < data.length; i++){
                        html += '<li><a href="'+ data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
                    }
                    $layer.html(html);
                $this.data('loaded',true);
                },1000);
            });
        }
    });*/

    // menu
    // 设置一个命名空间，减少全局方法
    var dropdown = {};
    $('.menu')
        .on('dropdown-show',function (e) {
            dropdown.loadOnce($(this),dropdown.buildMenuItem);
        })
        .dropdown_extend({
            css3:false,
            js:true,
            delay:0,
            animation : 'slideUpDown',
        });
    // 拆分后的函数
    dropdown.loadOnce = function ($elem,success) {
        var dataLoad = $elem.data('load');
        if(!dataLoad)   return;
        if(!$elem.data('loaded')){
            $elem.data('loaded',true);
            $.getJSON(dataLoad).done(function (data) {

                if (typeof success === 'function')   success($elem,data);
            }).fail(function () {
                $elem.data('loaded',false);
            });
        }
    };
    // 拆分后的函数
    dropdown.buildMenuItem = function ($elem,data) {
        setTimeout(function () {
            var html = '';
            if (data.length === 0)  return;
            for(var i = 0; i < data.length; i++){
                html += '<li><a href="'+ data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
            }
            $elem.find('.dropdown-layer').html(html);
        },1000);
    };

    // cart
    $('#cart').on('dropdown-show', function() {
        dropdown.loadOnce($(this), function($elem, data) {
            dropdown.buildCartItem($elem, data);
            dropdown.updateCart($elem, data);
        });
    }).dropdown_extend({
        css3: true,
        js: false
    });

    dropdown.buildCartItem=function($elem, data) {
        var html = "";
        if (data.length === 0) { // no goods
            html += '<div class="cart-nogoods"><i class="icon cart-nogoods-icon fl">&#xe600;</i><div class="cart-nogoods-text fl">购物车里还没有商品<br />赶紧去选购吧！</div></div>';
            $elem.find('.dropdown-layer').html(html);
            return;
        }

        html += '<h4 class="cart-title">最新加入的商品</h4><ul class="cart-list">';

        for (var i = 0; i < data.length; i++) {
            html += '<li class="cart-item"><a href="###" target="_blank" class="cart-item-pic fl"><img src="' + data[i].pic + '" alt="" /></a><div class="fl"><p class="cart-item-name text-ellipsis"><a href="###" target="_blank" class="link">' + data[i].name + '</a></p><p class="cart-item-price"><strong>￥' + data[i].price + ' x ' + data[i].num + '</strong></p></div><a href="javascript:;" title="删除" class="cart-item-delete link fr">X</a></li>';
        }

        html += '</ul><div class="cart-info"><span class="fl">共 <strong class="cart-total-num">0</strong> 件商品　共计<strong class="cart-total-price">￥ 0.00</strong></span><a href="###" target="_blank" class="cart-info-btn btn fr">去购物车</a></div>';

        // setTimeout(function(){
        $elem.find('.dropdown-layer').html(html);
        // },1000);
    };

    dropdown.updateCart = function($elem, data) {
        var $cartNum = $elem.find('.cart-num'),
            $cartTotalNum = $elem.find('.cart-total-num'),
            $cartTotalPrice = $elem.find('.cart-total-price'),
            dataNum = data.length,
            totalNum = 0,
            totalPrice = 0;

        if (dataNum === 0) { // no goods
            return;
        }

        for (var i = 0; i < dataNum; i++) {
            totalNum += +data[i].num;
            totalPrice += +data[i].num * +data[i].price;
        }

        $cartNum.html(totalNum);
        $cartTotalNum.html(totalNum);
        $cartTotalPrice.html('￥' + totalPrice);
    };

    // header search
    var search = {};
    search.$headerSearch = $('#header-search');
    search.$headerSearch.html = '',
    search.$headerSearch.maxNum = 10;
    // 获得数据处理
    search.$headerSearch.on('search-getData',function (e,data) {
        var $this = $(this);
        search.$headerSearch.html = search.$headerSearch.createHeaderSearchLayer(data,search.$headerSearch.maxNum);

        $this.search('appendLayer',search.$headerSearch.html);

        if(search.$headerSearch.html){
            $this.search('showLayer');
        }else{
            $this.search('hideLayer');
        }
    }).on('search-noData',function (e) {
        $(this).search('hideLayer').search('appendLayer','');
    }).on('click','.search-layer-item',function () {
        // console.log($(this).html());      .search-layer-item 的 html内容
        search.$headerSearch.search('setInputVal',$(this).html());
        search.$headerSearch.search('submit');
    });


    search.$headerSearch.search({
        autocomplete: true,
        css3 : true,
        js : false,
        animation: 'slideUpDown',
        getDataInterval : 0,
    });

    // 获取数据，生成html
    search.$headerSearch.createHeaderSearchLayer = function (data, maxNum) {
        var html = '',
            dataNum = data['result'].length;

        if (dataNum === 0) {
            return '';
        }
        for (var i = 0; i < dataNum; i++) {
            if (i >= maxNum) break;
            html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
        }
        return html;
    }

    // focus-category
    $('#focus-category').find('.dropdown')
        .on('dropdown-show',function () {
            dropdown.loadOnce($(this),dropdown.createCategoryDetails);
        }).dropdown_extend({
        css3: false,
        js: true,
        animation: 'fadeSlideLeftRight',
    })
    dropdown.createCategoryDetails = function ($elem,data) {
        var html = '';
        for(var i = 0; i < data.length; i++){
            html += '<dl class="category-details cf">' +
                        '<dt class="category-details-title fl">' +
                            '<a href="###" target="_blank" class="category-details-title-link">' + data[i].title + '</a>' +
                        '</dt>' +
                        '<dd class="category-details-item fl">';
            for(var j = 0; j < data[i].items.length; j ++){
                html += '<a href="###" target="_blank" class="link">'+data[i].items[j]+'</a>';
            }
            html += '</dd></dl>';
        }
        $elem.find('.dropdown-layer').html(html);
    };




    // focus slider
    var slider = {};
    slider.$focusSlider = $('#focus-slider');
    slider.loadImg = function(url, imgLoaded, imgFailed){
        // 创建一个image对象
        var image = new Image();
        // image加载完之后 会触发 onload事件    还可以写作  <img src="w3javascript.gif" onload="fun()">  重新定义fun()
        image.onload = function () {
            if(typeof imgLoaded === 'function'){
                imgLoaded(url);
            }
        };
        image.onerror = function(){
            if(typeof imgFailed === 'function'){
                imgFailed(url);
            }
        }
        // src的修改必须在onload绑定事件之后。  避免 图片加载速度过快，快于解码器阅读代码速度，导致图片加载完，触发onload，但是却还没有定义到onload函数。
        setTimeout(function () {
            image.src = url;
        },1000);
    };
    slider.lazyLoad = function($elem){
        // 保存每张图片是否加载的状态
        $elem.items = {};
        $elem.loadItemNum = 0;   // 加载完了的图片数量
        $elem.totalItemNum = $elem.find('.slider-img').length;     // 根据元素个数算出需要加载的图片数量
        // 这里需要给回调函数命名，后面图片加载完，需要用这个函数名清除函数事件
        $elem.on('slider-show',$elem.loadItem = function (e,index,elem) {
            if ($elem.items[index] !== 'loaded'){
                // 该图片没加载过 就加载
                $elem.trigger('slider-loadItem',[index,elem]);
            }
        });
        $elem.on('slider-loadItem',function (e,index,elem) {
            // 按需加载
            var $imgs = $(elem).find('.slider-img');

            // each用法1：  $.each(arr,function(i,val){ }      //each第一个参数是遍历的对象，第二个参数是回调函数。 回调函数第一个参数表示遍历的数组的下标，第二个参数表示下标对应的值。在json中可以换为key和value
            // $("input:hidden").each(function(i,val){ }      //第一个参数表示索引下标，第二个参数表示当前索引元素
            $imgs.each(function (i,el) {
                var $img = $(el);

                slider.loadImg($img.data('src'),function (url) {
                    $img.attr('src',url);

                    $elem.items[index] = 'loaded';
                    $elem.loadItemNum ++;
                    // console.log(index + ':loaded');
                    if($elem.loadItemNum === $elem.totalItemNum){
                        // 全部加载完了
                        $elem.trigger('slider-itemsLoaded');
                    }
                },function (url) {
                    console.log("Image Load Failed");
                    // 显示备用图片
                    $img.attr('src','../img/focus-slider/placeholder.png');
                });
            });
        });
        $elem.on('slider-itemsLoaded',function (e) {
            console.log("Focus Slider Items Loaded");
            // 所有图片加载完了 就清除加载图片这个事件   清除 'slider-show'这个事件绑定的slider.$focusSlider.loadItem这个函数
            $elem.off('slider-show',$elem.loadItem);
        });
    };
    slider.lazyLoad(slider.$focusSlider);
    slider.$focusSlider.slider({
        css3: true,
        js: false,
        animation: 'slide',    // slide
        activeIndex: 4,
        interval: 1000,  // 0 不切换
        loop: true,
    });


    // todays slider
    slider.$todaysSlider = $('#todays-slider');

    slider.lazyLoad(slider.$todaysSlider);

    slider.$todaysSlider.slider({
        css3: true,
        js: false,
        animation: 'slide',    // slide
        activeIndex: 4,
        interval: 1000,  // 0 不切换
        loop: true,
    });


    // floor
    var floor = {};
    floor.$floor = $('.floor');
    floor.lazyLoadFloorImgs = function($elem){
        // 保存每张图片是否加载的状态
        $elem.items = {};
        if(!$elem.loadItemNum){
            $elem.loadItemNum = 0;    // 加载完了的图片数量
        }
        $elem.totalItemNum = $elem.find('.floor-img').length;     // 根据元素个数算出需要加载的图片数量
        // 这里需要给回调函数命名，后面图片加载完，需要用这个函数名清除函数事件
        $elem.on('tab-show',$elem.loadItem = function (e,index,elem) {
            if ($elem.items[index] !== 'loaded'){
                // 该图片没加载过 就加载
                $elem.trigger('tab-loadItem',[index,elem]);
            }
        });
        $elem.on('tab-loadItem',function (e,index,elem) {
            // 按需加载
            var $imgs = $(elem).find('.floor-img');

            // each用法1：  $.each(arr,function(i,val){ }      //each第一个参数是遍历的对象，第二个参数是回调函数。 回调函数第一个参数表示遍历的数组的下标，第二个参数表示下标对应的值。在json中可以换为key和value
            // $("input:hidden").each(function(i,val){ }      //第一个参数表示索引下标，第二个参数表示当前索引元素
            $imgs.each(function (i,el) {
                var $img = $(el);

                // 调用slider下的 loadImg方法方法
                slider.loadImg($img.data('src'),function (url) {
                    $img.attr('src',url);
                    $elem.items[index] = 'loaded';
                    $elem.loadItemNum ++;
                    // console.log(index + ':loaded');

                    if($elem.loadItemNum === $elem.totalItemNum){
                        // 全部加载完了
                        $elem.trigger('tab-itemsLoaded');
                    }
                },function (url) {
                    console.log("Image Load Failed");
                    // 显示备用图片
                    $img.attr('src','img/floor/placeholder.png');
                });
            });
        });
        $elem.on('tab-itemsLoaded',function (e) {
            console.log("Tab Items Loaded");
            // 所有图片加载完了 就清除加载图片这个事件   清除 'slider-show'这个事件绑定的slider.$focusSlider.loadItem这个函数
            $elem.off('tab-show',$elem.loadItem);
        });
    };

    /*$floor.each(function (_, elem) {
        floor.lazyLoadFloorImgs($(elem));
    });

    $floor.tab({
        event: 'mouseenter', // click
        css3: false,
        js: false,
        animation: 'fade',
        activeIndex: 0,
        interval : 0,
        delay: 500,
    });*/

    floor.floorData = [
        {
            num: '1',
            text: '服装鞋包',
            tabs: ['大牌', '男装', '女装'],
            items: [
                [
                    {
                        name: '匡威男棒球开衫外套2015',
                        price: 479
                    }, {
                    name: 'adidas 阿迪达斯 训练 男子',
                    price: 335
                }, {
                    name: '必迈BMAI一体织跑步短袖T恤',
                    price: 159
                }, {
                    name: 'NBA袜子半毛圈运动高邦棉袜',
                    price: 65
                }, {
                    name: '特步官方运动帽男女帽子2016',
                    price: 69
                }, {
                    name: 'KELME足球训练防寒防风手套',
                    price: 4999
                }, {
                    name: '战地吉普三合一冲锋衣',
                    price: 289
                }, {
                    name: '探路者户外男士徒步鞋',
                    price: 369
                }, {
                    name: '羽绒服2015秋冬新款轻薄男士',
                    price: 399
                }, {
                    name: '溯溪鞋涉水鞋户外鞋',
                    price: 689
                }, {
                    name: '旅行背包多功能双肩背包',
                    price: 269
                }, {
                    name: '户外旅行双肩背包OS0099',
                    price: 99
                }
                ], [
                    {
                        name: '匡威男棒球开衫外套2015',
                        price: 479
                    }, {
                        name: 'adidas 阿迪达斯 训练 男子',
                        price: 335
                    }, {
                        name: '必迈BMAI一体织跑步短袖T恤',
                        price: 159
                    }, {
                        name: 'NBA袜子半毛圈运动高邦棉袜',
                        price: 65
                    }, {
                        name: '特步官方运动帽男女帽子2016',
                        price: 69
                    }, {
                        name: 'KELME足球训练防寒防风手套',
                        price: 4999
                    }, {
                        name: '战地吉普三合一冲锋衣',
                        price: 289
                    }, {
                        name: '探路者户外男士徒步鞋',
                        price: 369
                    }, {
                        name: '羽绒服2015秋冬新款轻薄男士',
                        price: 399
                    }, {
                        name: '溯溪鞋涉水鞋户外鞋',
                        price: 689
                    }, {
                        name: '旅行背包多功能双肩背包',
                        price: 269
                    }, {
                        name: '户外旅行双肩背包OS0099',
                        price: 99
                    }
                ], [
                    {
                        name: '匡威男棒球开衫外套2015',
                        price: 479
                    }, {
                        name: 'adidas 阿迪达斯 训练 男子',
                        price: 335
                    }, {
                        name: '必迈BMAI一体织跑步短袖T恤',
                        price: 159
                    }, {
                        name: 'NBA袜子半毛圈运动高邦棉袜',
                        price: 65
                    }, {
                        name: '特步官方运动帽男女帽子2016',
                        price: 69
                    }, {
                        name: 'KELME足球训练防寒防风手套',
                        price: 4999
                    }, {
                        name: '战地吉普三合一冲锋衣',
                        price: 289
                    }, {
                        name: '探路者户外男士徒步鞋',
                        price: 369
                    }, {
                        name: '羽绒服2015秋冬新款轻薄男士',
                        price: 399
                    }, {
                        name: '溯溪鞋涉水鞋户外鞋',
                        price: 689
                    }, {
                        name: '旅行背包多功能双肩背包',
                        price: 269
                    }, {
                        name: '户外旅行双肩背包OS0099',
                        price: 99
                    }
                ]
            ]
        }, {
            num: '2',
            text: '个护美妆',
            tabs: ['热门', '国际大牌', '国际名品'],
            items: [
                [
                    {
                        name: '韩束红石榴鲜活水盈七件套装',
                        price: 169
                    }, {
                    name: '温碧泉八杯水亲亲水润五件套装',
                    price: 198
                }, {
                    name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                    price: 79.9
                }, {
                    name: '吉列手动剃须刀锋隐致护',
                    price: 228
                }, {
                    name: 'Mediheal水润保湿面膜',
                    price: 119
                }, {
                    name: '纳益其尔芦荟舒缓保湿凝胶',
                    price: 39
                }, {
                    name: '宝拉珍选基础护肤旅行四件套',
                    price: 299
                }, {
                    name: '温碧泉透芯润五件套装',
                    price: 257
                }, {
                    name: '玉兰油多效修护三部曲套装',
                    price: 199
                }, {
                    name: 'LOREAL火山岩控油清痘洁面膏',
                    price: 36
                }, {
                    name: '百雀羚水嫩倍现盈透精华水',
                    price: 139
                }, {
                    name: '珀莱雅新柔皙莹润三件套',
                    price: 99
                }
                ], [
                    {
                        name: '韩束红石榴鲜活水盈七件套装',
                        price: 169
                    }, {
                        name: '温碧泉八杯水亲亲水润五件套装',
                        price: 198
                    }, {
                        name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                        price: 79.9
                    }, {
                        name: '吉列手动剃须刀锋隐致护',
                        price: 228
                    }, {
                        name: 'Mediheal水润保湿面膜',
                        price: 119
                    }, {
                        name: '纳益其尔芦荟舒缓保湿凝胶',
                        price: 39
                    }, {
                        name: '宝拉珍选基础护肤旅行四件套',
                        price: 299
                    }, {
                        name: '温碧泉透芯润五件套装',
                        price: 257
                    }, {
                        name: '玉兰油多效修护三部曲套装',
                        price: 199
                    }, {
                        name: 'LOREAL火山岩控油清痘洁面膏',
                        price: 36
                    }, {
                        name: '百雀羚水嫩倍现盈透精华水',
                        price: 139
                    }, {
                        name: '珀莱雅新柔皙莹润三件套',
                        price: 99
                    }
                ], [
                    {
                        name: '韩束红石榴鲜活水盈七件套装',
                        price: 169
                    }, {
                        name: '温碧泉八杯水亲亲水润五件套装',
                        price: 198
                    }, {
                        name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                        price: 79.9
                    }, {
                        name: '吉列手动剃须刀锋隐致护',
                        price: 228
                    }, {
                        name: 'Mediheal水润保湿面膜',
                        price: 119
                    }, {
                        name: '纳益其尔芦荟舒缓保湿凝胶',
                        price: 39
                    }, {
                        name: '宝拉珍选基础护肤旅行四件套',
                        price: 299
                    }, {
                        name: '温碧泉透芯润五件套装',
                        price: 257
                    }, {
                        name: '玉兰油多效修护三部曲套装',
                        price: 199
                    }, {
                        name: 'LOREAL火山岩控油清痘洁面膏',
                        price: 36
                    }, {
                        name: '百雀羚水嫩倍现盈透精华水',
                        price: 139
                    }, {
                        name: '珀莱雅新柔皙莹润三件套',
                        price: 99
                    }
                ]
            ]
        }, {
            num: '3',
            text: '手机通讯',
            tabs: ['热门', '品质优选', '新机尝鲜'],
            items: [
                [
                    {
                        name: '摩托罗拉 Moto Z Play',
                        price: 3999
                    }, {
                    name: 'Apple iPhone 7 (A1660)',
                    price: 6188
                }, {
                    name: '小米 Note 全网通 白色',
                    price: 999
                }, {
                    name: '小米5 全网通 标准版 3GB内存',
                    price: 1999
                }, {
                    name: '荣耀7i 海岛蓝 移动联通4G手机',
                    price: 1099
                }, {
                    name: '乐视（Le）乐2（X620）32GB',
                    price: 1099
                }, {
                    name: 'OPPO R9 4GB+64GB内存版',
                    price: 2499
                }, {
                    name: '魅蓝note3 全网通公开版',
                    price: 899
                }, {
                    name: '飞利浦 X818 香槟金 全网通4G',
                    price: 1998
                }, {
                    name: '三星 Galaxy S7（G9300）',
                    price: 4088
                }, {
                    name: '华为 荣耀7 双卡双待双通',
                    price: 1128
                }, {
                    name: '努比亚(nubia)Z7Max(NX505J)',
                    price: 728
                }
                ], [
                    {
                        name: '摩托罗拉 Moto Z Play',
                        price: 3999
                    }, {
                        name: 'Apple iPhone 7 (A1660)',
                        price: 6188
                    }, {
                        name: '小米 Note 全网通 白色',
                        price: 999
                    }, {
                        name: '小米5 全网通 标准版 3GB内存',
                        price: 1999
                    }, {
                        name: '荣耀7i 海岛蓝 移动联通4G手机',
                        price: 1099
                    }, {
                        name: '乐视（Le）乐2（X620）32GB',
                        price: 1099
                    }, {
                        name: 'OPPO R9 4GB+64GB内存版',
                        price: 2499
                    }, {
                        name: '魅蓝note3 全网通公开版',
                        price: 899
                    }, {
                        name: '飞利浦 X818 香槟金 全网通4G',
                        price: 1998
                    }, {
                        name: '三星 Galaxy S7（G9300）',
                        price: 4088
                    }, {
                        name: '华为 荣耀7 双卡双待双通',
                        price: 1128
                    }, {
                        name: '努比亚(nubia)Z7Max(NX505J)',
                        price: 728
                    }
                ], [
                    {
                        name: '摩托罗拉 Moto Z Play',
                        price: 3999
                    }, {
                        name: 'Apple iPhone 7 (A1660)',
                        price: 6188
                    }, {
                        name: '小米 Note 全网通 白色',
                        price: 999
                    }, {
                        name: '小米5 全网通 标准版 3GB内存',
                        price: 1999
                    }, {
                        name: '荣耀7i 海岛蓝 移动联通4G手机',
                        price: 1099
                    }, {
                        name: '乐视（Le）乐2（X620）32GB',
                        price: 1099
                    }, {
                        name: 'OPPO R9 4GB+64GB内存版',
                        price: 2499
                    }, {
                        name: '魅蓝note3 全网通公开版',
                        price: 899
                    }, {
                        name: '飞利浦 X818 香槟金 全网通4G',
                        price: 1998
                    }, {
                        name: '三星 Galaxy S7（G9300）',
                        price: 4088
                    }, {
                        name: '华为 荣耀7 双卡双待双通',
                        price: 1128
                    }, {
                        name: '努比亚(nubia)Z7Max(NX505J)',
                        price: 728
                    }
                ]
            ]
        }, {
            num: '4',
            text: '家用电器',
            tabs: ['热门', '大家电', '生活电器'],
            items: [
                [
                    {
                        name: '暴风TV 超体电视 40X 40英寸',
                        price: 1299
                    }, {
                    name: '小米（MI）L55M5-AA 55英寸',
                    price: 3699
                }, {
                    name: '飞利浦HTD5580/93 音响',
                    price: 2999
                }, {
                    name: '金门子H108 5.1套装音响组合',
                    price: 1198
                }, {
                    name: '方太ENJOY云魔方抽油烟机',
                    price: 4390
                }, {
                    name: '美的60升预约洗浴电热水器',
                    price: 1099
                }, {
                    name: '九阳电饭煲多功能智能电饭锅',
                    price: 159
                }, {
                    name: '美的电烤箱家用大容量',
                    price: 329
                }, {
                    name: '奥克斯(AUX)936破壁料理机',
                    price: 1599
                }, {
                    name: '飞利浦面条机 HR2356/31',
                    price: 665
                }, {
                    name: '松下NU-JA100W 家用蒸烤箱',
                    price: 1799
                }, {
                    name: '飞利浦咖啡机 HD7751/00',
                    price: 1299
                }
                ], [
                    {
                        name: '暴风TV 超体电视 40X 40英寸',
                        price: 1299
                    }, {
                        name: '小米（MI）L55M5-AA 55英寸',
                        price: 3699
                    }, {
                        name: '飞利浦HTD5580/93 音响',
                        price: 2999
                    }, {
                        name: '金门子H108 5.1套装音响组合',
                        price: 1198
                    }, {
                        name: '方太ENJOY云魔方抽油烟机',
                        price: 4390
                    }, {
                        name: '美的60升预约洗浴电热水器',
                        price: 1099
                    }, {
                        name: '九阳电饭煲多功能智能电饭锅',
                        price: 159
                    }, {
                        name: '美的电烤箱家用大容量',
                        price: 329
                    }, {
                        name: '奥克斯(AUX)936破壁料理机',
                        price: 1599
                    }, {
                        name: '飞利浦面条机 HR2356/31',
                        price: 665
                    }, {
                        name: '松下NU-JA100W 家用蒸烤箱',
                        price: 1799
                    }, {
                        name: '飞利浦咖啡机 HD7751/00',
                        price: 1299
                    }
                ], [
                    {
                        name: '暴风TV 超体电视 40X 40英寸',
                        price: 1299
                    }, {
                        name: '小米（MI）L55M5-AA 55英寸',
                        price: 3699
                    }, {
                        name: '飞利浦HTD5580/93 音响',
                        price: 2999
                    }, {
                        name: '金门子H108 5.1套装音响组合',
                        price: 1198
                    }, {
                        name: '方太ENJOY云魔方抽油烟机',
                        price: 4390
                    }, {
                        name: '美的60升预约洗浴电热水器',
                        price: 1099
                    }, {
                        name: '九阳电饭煲多功能智能电饭锅',
                        price: 159
                    }, {
                        name: '美的电烤箱家用大容量',
                        price: 329
                    }, {
                        name: '奥克斯(AUX)936破壁料理机',
                        price: 1599
                    }, {
                        name: '飞利浦面条机 HR2356/31',
                        price: 665
                    }, {
                        name: '松下NU-JA100W 家用蒸烤箱',
                        price: 1799
                    }, {
                        name: '飞利浦咖啡机 HD7751/00',
                        price: 1299
                    }
                ]
            ]
        }, {
            num: '5',
            text: '电脑数码',
            tabs: ['热门', '电脑/平板', '潮流影音'],
            items: [
                [
                    {
                        name: '戴尔成就Vostro 3800-R6308',
                        price: 2999
                    }, {
                    name: '联想IdeaCentre C560',
                    price: 5399
                }, {
                    name: '惠普260-p039cn台式电脑',
                    price: 3099
                }, {
                    name: '华硕飞行堡垒旗舰版FX-PRO',
                    price: 6599
                }, {
                    name: '惠普(HP)暗影精灵II代PLUS',
                    price: 12999
                }, {
                    name: '联想(Lenovo)小新700电竞版',
                    price: 5999
                }, {
                    name: '游戏背光牧马人机械手感键盘',
                    price: 499
                }, {
                    name: '罗技iK1200背光键盘保护套',
                    price: 799
                }, {
                    name: '西部数据2.5英寸移动硬盘1TB',
                    price: 419
                }, {
                    name: '新睿翼3TB 2.5英寸 移动硬盘',
                    price: 849
                }, {
                    name: 'Rii mini i28无线迷你键盘鼠标',
                    price: 349
                }, {
                    name: '罗技G29 力反馈游戏方向盘',
                    price: 2999
                }
                ], [
                    {
                        name: '戴尔成就Vostro 3800-R6308',
                        price: 2999
                    }, {
                        name: '联想IdeaCentre C560',
                        price: 5399
                    }, {
                        name: '惠普260-p039cn台式电脑',
                        price: 3099
                    }, {
                        name: '华硕飞行堡垒旗舰版FX-PRO',
                        price: 6599
                    }, {
                        name: '惠普(HP)暗影精灵II代PLUS',
                        price: 12999
                    }, {
                        name: '联想(Lenovo)小新700电竞版',
                        price: 5999
                    }, {
                        name: '游戏背光牧马人机械手感键盘',
                        price: 499
                    }, {
                        name: '罗技iK1200背光键盘保护套',
                        price: 799
                    }, {
                        name: '西部数据2.5英寸移动硬盘1TB',
                        price: 419
                    }, {
                        name: '新睿翼3TB 2.5英寸 移动硬盘',
                        price: 849
                    }, {
                        name: 'Rii mini i28无线迷你键盘鼠标',
                        price: 349
                    }, {
                        name: '罗技G29 力反馈游戏方向盘',
                        price: 2999
                    }
                ], [
                    {
                        name: '戴尔成就Vostro 3800-R6308',
                        price: 2999
                    }, {
                        name: '联想IdeaCentre C560',
                        price: 5399
                    }, {
                        name: '惠普260-p039cn台式电脑',
                        price: 3099
                    }, {
                        name: '华硕飞行堡垒旗舰版FX-PRO',
                        price: 6599
                    }, {
                        name: '惠普(HP)暗影精灵II代PLUS',
                        price: 12999
                    }, {
                        name: '联想(Lenovo)小新700电竞版',
                        price: 5999
                    }, {
                        name: '游戏背光牧马人机械手感键盘',
                        price: 499
                    }, {
                        name: '罗技iK1200背光键盘保护套',
                        price: 799
                    }, {
                        name: '西部数据2.5英寸移动硬盘1TB',
                        price: 419
                    }, {
                        name: '新睿翼3TB 2.5英寸 移动硬盘',
                        price: 849
                    }, {
                        name: 'Rii mini i28无线迷你键盘鼠标',
                        price: 349
                    }, {
                        name: '罗技G29 力反馈游戏方向盘',
                        price: 2999
                    }
                ]
            ]
        }
    ];
    floor.buildFloor = function  (floorData) {
        var html = '';
        html += '<div class="container">';
        html += floor.buildFloorHead(floorData);
        html += floor.buildFloorBody(floorData);
        html += '</div>';

        return html;
    };
    floor.buildFloorHead = function (floorData){
        var html = '';
        html += '<div class="floor-head">';
        html += '<h2 class="floor-title fl"><span class="floor-title-num">'+floorData.num+'F</span>' +
            '<span class="floor-title-text">'+ floorData.text+'</span></h2>'
        html += '<ul class="tab-item-wrap fr">';

        for(var i = 0; i < floorData.tabs.length; i++){
            html += '<li class="fl"><a href="javascript:;" class="tab-item tab-item-active">'+floorData.tabs[i]+'</a></li>';
            if(i != floorData.tabs.length - 1){

                html += '<li class="floor-divider fl text-hidden">分隔线</li>';
            }
        }

        html += '</ul>';
        html += '</div>';

        return html;
    };
    floor.buildFloorBody = function (floorData){
        var html = '';

        html += '<div class="floor-body">';
        for(var i = 0; i < floorData.items.length; i++){
            html += '<ul class="tab-panel">';
            for(var j = 0; j < floorData.items[i].length; j++){
                html += '<li class="floor-item fl">';
                html += '<p class="floor-item-pic"><a href="###" target="_blank">' +
                    '<img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/'+floorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="" /></a></p>';
                html += '<p class="floor-item-name"><a href="###" target="_blank" class="link">'+floorData.items[i][j].name+'</a></p>';
                html += '<p class="floor-item-price">'+floorData.items[i][j].price+'</p>';
                html += '</li>';
            }
            html += '</ul>';
        }
        html += '</div>';

        return html;
    };
    floor.lazyLoadFloor = function(){
        var items = {},
            loadItemNum = 0,
            totalItemNum = floor.$floor.length,
            loadItemFn = null;

        $doc.on('floor-show',loadItemFn = function (e,index,elem) {
            if (items[index] !== 'loaded'){
                $doc.trigger('floor-loadItem',[index,elem]);
            }
        });
        $doc.on('floor-loadItem',function (e,index,elem) {
            var html = floor.buildFloor(floor.floorData[index]),
                $elem = $(elem);
            // console.log(floor.floorData[index]);
            items[index] = 'loaded';
            loadItemNum ++;

            if(loadItemNum === totalItemNum){
                $doc.trigger('floor-itemsLoaded');
            }
            setTimeout(function () {
                $elem.html(html);
                // 激活floor item的按需加载
                floor.lazyLoadFloorImgs($elem);
                // 出现在可视范围内的元素  激活选项卡
                $elem.tab({
                    event: 'mouseenter', // click
                    css3: false,
                    js: false,
                    animation: 'fade',
                    activeIndex: 0,
                    interval : 0,
                    delay: 500,
                });
            },1000);
        });
        $doc.on('floor-itemsLoaded',function (e) {
            console.log("Floor Items Loaded");
            // 所有图片加载完了 就清除加载图片这个事件   清除 'slider-show'这个事件绑定的slider.$focusSlider.loadItem这个函数
            $doc.off('floor-show',loadItemFn);
            $win.off('scroll resize',floor.timeToShow);
        });
    };

    var $win = $(window),
        $doc = $(document);

    floor.isVisible = function ($elem) {
        // scrollTop()滚动条滚过的高度
        return $win.height() + $win.scrollTop() > $elem.offset().top && $win.scrollTop() < $elem.offset().top + $elem.height();
    };
    floor.timeToShow = function (){
        floor.$floor.each(function (index,elem) {
            if(floor.isVisible($(elem))){
                // console.log($(elem) + 'is visible');
                $doc.trigger('floor-show',[index,elem]);
            }
        });
    };

    // 窗口滚动，或者窗口大小变化    例如开关控制台，可视范围变大，发出resize事件
    $win.on('scroll resize',function () {
        clearTimeout(floor.floorTimer);
        // mouseenter  mousemove scroll 这种事件流  会特别频繁地触发。  设置一个延迟，可以减少次数 ，稀释时间流
        floor.floorTimer = setTimeout(floor.timeToShow,250);
    });
    floor.lazyLoadFloor();
    floor.timeToShow();

    // elevator
    floor.whichFloor = function () {
        var num = -1;

        // 循环每个楼层  当滚动条滚过的高度 大于 楼层顶部高度  就返回楼层数
        floor.$floor.each(function (index,elem) {
            var floorData = floor.floorData[index],
            $elem = $(elem);

            num = index;
            // 滚动条滚过高度没达到  return false 继续下一次循环 而不是结束整个函数
            // 二分之一的可见区域高度 是偏移量。   当楼层上边到达可是区域一半高度就会认为到达了该楼层
            if($win.scrollTop() < $elem.offset().top - $win.height() / 2){
                console.log('scroll' + $win.scrollTop());
                num = index - 1;
                return false;
            }
        });
        return num;
    }
    floor.$elevator = $('#elevator');
    floor.$elevator.$items = floor.$elevator.find('.elevator-item');
    floor.setElevator = function () {
        var num = floor.whichFloor();
        if(num === -1){
            floor.$elevator.fadeOut();
        }else {
            floor.$elevator.fadeIn();
            floor.$elevator.$items.removeClass('elevator-active');
            floor.$elevator.$items.eq(num).addClass('elevator-active');
        }
    };
    floor.setElevator();
    $win.on('scroll resize',function () {
        clearTimeout(floor.elevatorTimer);
        floor.elevatorTimer = setTimeout(floor.setElevator, 250);
    });
    // 绑定点击事件  点击电梯跳转对应楼层， 可以对每个楼层循环遍历绑定事件。但更好的是用事件代理
    floor.$elevator.on('click','.elevator-item',function () {
        // 对html 和body设置属性 达到跳转的目的
        console.log($(this).index());
       $('html,body').animate({
           scrollTop: floor.$floor.eq($(this).index()).offset().top,
       });
    });

    // toolbar
    // 回到顶部的功能  最简单的是在html里按钮的链接设置为 #  <a href="#" id="backToTop" class="toolbar-item">  但这样是瞬间返回
    $('#backToTop').on('click',function () {
        // 动画效果 回到顶部
        $('html,body').animate({
            scrollTop: 0,
        });
    });
})(jQuery)
