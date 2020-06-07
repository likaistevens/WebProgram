(function (window, document) {
    let Cherry = function(options){
        this.transform = '';
        this._initImg(5);
        this._init(options);
    }
    Cherry.prototype._initImg = function(numbers){
        // 生成元素
        let container = document.querySelector('.cherry-container');
        let img = ``;
        for(var i = 0; i < numbers; i++){
            img += `<img class="cherry" src="cherry.png"> `;
        }
        container.innerHTML = img;
        this.img = document.querySelectorAll('.cherry');
        // 初始化所有元素位置
        let index1 = 1;
        this.img.forEach( (item) => {
            item.style.left = `${ index1 * 100}px`;
            item.style.top = `-30px`;
            index1 ++;
        });
    }
    Cherry.prototype._init = function(){
        this.img.forEach( (item) => {
            this._setTransition(item);
        });
        this._animation(this.img);
        this._transform(this.img, {
            scale: '2,3',
            rotate: '90',
            skew: '20',
        });
    };
    Cherry.prototype._animation = function(imgs){
        let animations = [
            {
                dropDown: ['50px','500px'],
                opacity: '0.1',
            },
            {
                dropDown: ['-10px','500px'],
                opacity: '0.2',
            },
            {
                dropDown: ['-50px','500px'],
                opacity: '0.8',
            },
            {
                dropDown: ['20px','500px'],
                opacity: '0.4',
            },
            {
                dropDown: ['100px','500px'],
                opacity: '0.9',
            }
        ];
        let index2 = 0;
        setTimeout(() => {
            imgs.forEach( (item) => {
                this._dropDown(item, animations[index2]["dropDown"]);
                console.log(animations[index2]["dropDown"]);
                this._opacity(item, animations[index2]["opacity"]);
                index2 ++;
            });
        },500);
    };
    // -------------------------transform属性 动画
    Cherry.prototype._transform = function(imgs,{scale,rotate, skew}){
        setTimeout(() => {
            this._scale(scale);
            this._skew(skew);
            this._rotate(rotate);
            imgs.forEach( (item) => {
                item.style.transform = this.transform;
            });
        },100);
    };
    Cherry.prototype._scale = function(entry){
        console.log(entry);
        if(entry)
            this.transform +=  `scale(${ entry }) `;
    };
    Cherry.prototype._skew = function(ang){
        console.log(ang);
        if(ang)
            this.transform += `skew(${ ang }deg) `;
    };
    Cherry.prototype._rotate = function(ang){
        console.log(ang);
        if(ang)
            this.transform += `rotate(${ ang }deg) `;
    };

    // -------------------------style属性 动画
    Cherry.prototype._dropDown = function($img,[x,y]){
        $img.style.top = y;
        $img.style.left = x;
    };
    Cherry.prototype._opacity = function($img, value){
        $img.style.opacity = value;
    };
    // transition
    Cherry.prototype._setTransition = function ($img) {
        let times = {
            top: '15',
            left: '15',
            opacity: '10',
            transform: '10',
        }
        let t = times;
        let timingfun = 'linear';
        $img.style.transition = `top ${ t['top'] }s ${ timingfun }, left ${ t['left'] }s ${ timingfun }, opacity ${ t['opacity'] }s ${ timingfun }, transform ${ t['transform'] }s ${ timingfun }`
    };
    window.$Cherry = Cherry;
})(window, document)