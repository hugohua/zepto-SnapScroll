/**
 * Created by admin on 14-4-17.
 */

(function ($,window) {
    var rAF = window.requestAnimationFrame  ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
        function (callback) { window.setTimeout(callback, 1000 / 60); };

    var hasTouch = 'ontouchstart' in window,
        resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup',
        cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';

    /**
     * 定义一个插件 Plugin
     */
    var SnapScroll = (function () {

        function SnapScroll(element, options) {
            this.$el = $(element);
            //一些参数
            this.options = $.extend({}, $.fn.snapscroll.defaults,options);

            //初始化调用一下
            this.init();
        }


        /**
         * 写法二
         * 将插件所有函数放在prototype的大对象里
         * @type {{}}
         */
        SnapScroll.prototype = {
            //将构造函数的指向重新定位到Plugin
            constructor:SnapScroll,

            name:'scroll',

            version:'0.0.1',

            init:function(){

                this.$pages             = this.$el.children();              //所有页面zepto对象
                this.length             = this.$pages.length -1;            //页面个数
                this.width              = this.$el.width();
                this.height             = this.$el.height();                //容器高度
                this.curIndex           = 0;                                //当前展示页面
                this.newIndex           = 0;                                //需要切换到下一页的索引
                this.startTime          = null;                             //开始时间
                this.drag               = null;                             //是否处于拖动状态
                this.startY             = null;                             //touch start的值
                this.direction          = null;                             //拖动的方向
                this.directionLocked    = null;                             //方向初始化控制值
                this.$target            = null;                             //确定拖动的目标

                this._initEvent();
                console.log('init');
            },

            /**
             * 初始化事件
             * @private
             */
            _initEvent:function(){
                this.$el.on(startEvent, $.proxy(this.handleEvent, this))
                        .on(moveEvent, $.proxy(this.handleEvent, this))
                        .on(endEvent, $.proxy(this.handleEvent, this))
                        .on(cancelEvent, $.proxy(this.handleEvent, this));
                this.$pages.on('webkitTransitionEnd', $.proxy(this.handleEvent, this));
                window.addEventListener(resizeEvent, this, false)
            },

            handleEvent:function(e){
                switch (e.type){
                    case 'tap': this._start(e);break;
                    case startEvent :
                        this._start(e);
                        break;
                    case moveEvent :
                        this._move(e);
                        break;
                    case endEvent :
                    case cancelEvent:
                        this._end(e);
                        break;
                    case 'webkitTransitionEnd':
                        this._flip();
                        break;
                    case resizeEvent:
                        this._resize();
                }
            },

            _start:function(e){
                //如果正在移动状态则返回
                if(this.moved) return;
                var point = hasTouch ? e.touches[0] : e;
                this.startTime = Date.now();
                this.drag      = true;
                this.startX    = point.pageX;
                this.startY    = point.pageY;       //start Y
            },

            /**
             * 移动
             * @param e
             * @private
             */
            _move: function (e) {
                e.preventDefault();
                e.stopPropagation();
                //如果正在移动状态 或者 不处于拖曳状态 则返回
                if(this.moved || !this.drag) return;

                var point       = hasTouch ? e.touches[0] : e,
                    deltaX      = point.pageX - this.startX,
                    deltaY      = point.pageY - this.startY,
                    x, y,_direction;
                //绝对值
                this.absDistX   = Math.abs(deltaX);
                this.absDistY   = Math.abs(deltaY);
                //10px用于方向性预测
                if(this.absDistX < 10 && this.absDistY < 10 ) return;
//                debugger;
                //第一次移动则锁住 仅执行一次
                if(!this.directionLocked){
                    _direction = this.absDistX - this.absDistY - this.options.directionLockThreshold > 0;
                    if((this.options.scroll === 'n' && _direction) || (this.options.scroll === 'h') ){
                        this.directionLocked = 'h';  //横向
                        this.direction = deltaX > 0 ? 'LEFT' : 'RIGHT';
                    }else{
                        this.directionLocked = 'v';  //竖向
                        this.direction = deltaY > 0 ? 'DOWN' : 'UP';
                    }
                    //上一页
                    if(this.direction === 'LEFT' ||this.direction === 'DOWN'){
                        this.newIndex = this.curIndex - 1;
                    }else{
                        this.newIndex = this.curIndex + 1;
                    }

                    //判断是否需要循环
                    if(this.options.loop){
                        if(this.newIndex < 0) this.newIndex = this.length;
                        if(this.newIndex > this.length) this.newIndex = 0;
                    }
                    this.$target = this.$pages.eq(this.newIndex);
                    this.$el.trigger('start:' + this.name,[this.curIndex,this.newIndex,this.direction]);
                }

                if(!this.$target) return;

                if(this.direction === 'UP'){
                    x = 0;
                    y = this.height + deltaY;
                }else if(this.direction === 'DOWN'){
                    x = 0;
                    y = deltaY -this.height;
                }else if(this.direction === 'LEFT'){
                    x = deltaX -this.width;
                    y = 0;
                }else if(this.direction === 'RIGHT'){
                    x = this.width + deltaX;
                    y = 0;
                }
                this._translate(x,y);

            },

            _end:function(e){
                var x =0 ,y = 0,vThreshold,hThreshold;
                //还原默认状态
                this.directionLocked = null;
                this.drag = null;
                //如果没有移动目标 则直接退出
                if(!this.$target) return;
                this.moved = true;
                this.change = true;
                //判断距离
                vThreshold = this.height / this.absDistY > this.options.scrollThreshold;
                hThreshold = this.width / this.absDistX > this.options.scrollThreshold;

                //4分之1不到的距离就回退
                if(this.direction === 'UP' && vThreshold){
                    x = 0;
                    y = this.height;
                    this.change = null;

                }else if(this.direction === 'DOWN' && vThreshold){
                    x = 0;
                    y = -this.height;
                    this.change = null;

                }else if(this.direction === 'LEFT' && hThreshold){
                    x = this.width;
                    y =0;
                    this.change = null;

                }else if(this.direction === 'RIGHT' && hThreshold){
                    x = -this.width;
                    y = 0;
                    this.change = null;
                }
                this._scrollTo(x,y);

            },

            /**
             * 最后动画停止时调用
             * @param e
             * @private
             */
            _flip:function(e){
                this._offTranslate();
                this.directionLocked = null;
                this.moved = null;
                if(this.change){
                    this.$pages.eq(this.curIndex).removeClass('show');
                    this.$target.addClass('show');
                    this.curIndex = this.newIndex;
                }
                this.$target.removeClass('active').removeAttr('style');
                this.$target = null;
                this.change = null;
                this.$el.trigger('done:' + this.name,[this.newIndex,this.direction]);
            },

            _resize:function(){
                //重新设置容器高度
                this.width = this.$el.width();
                this.height = this.$el.height();
            },

            /**
             * CSS3实现滚动到指定的地方
             * @param x 距离
             * @param y 距离
             * @private
             */
            _translate: function (x,y) {
                var me = this;
                //将上rAF位移
                rAF(function(){
                    me.$target.addClass('active').css({
                        '-webkit-transform': 'translate3d('+ x +'px,'+ y +'px,0)'
                    })
                });
            },

            /**
             * CSS3滑动距离
             * @param x
             * @param y
             * @param speed
             * @param easing
             * @private
             */
            _scrollTo:function(x,y, speed, easing){
                speed = speed || this.options.speed;
                this.$target.css('-webkit-transition','-webkit-transform '+ speed +'ms');
                this._translate(x,y);
            },

            _offTranslate:function(){
                this.$target.css('-webkit-transition','-webkit-transform 0ms');
            },

            /**
             * TODO:尚未完成哈
             * 跳转到指定页面
             * @param idx 页面索引
             * @param direction 方向 v,h
             */
            goTo:function(idx,direction){
                if (this.curIndex==idx || this.isAnimating) return;
                this.newIndex = idx;
                this.$target = this.$pages.eq(this.newIndex);
                //判断方向 v竖向
                if(this.options.scroll === 'n' && direction === 'v'){
//                    if()
                }
            }




        };

        return SnapScroll;

    })();


    /**
     * 这里是将Plugin对象 转为jq插件的形式进行调用
     * 定义一个插件 snapscroll
     */
    $.fn.snapscroll = function(options){
        return this.each(function () {
            var $this = $(this),
                instance = $.fn.snapscroll.lookup[$this.data('snapscroll')];
            if (!instance) {
                $.fn.snapscroll.lookup[++$.fn.snapscroll.lookup.i] = new SnapScroll(this,options);
                $this.data('snapscroll', $.fn.snapscroll.lookup.i);
                instance = $.fn.snapscroll.lookup[$this.data('snapscroll')];
            }

            if (typeof options === 'string') return instance[options].apply(instance,Array.prototype.slice.call(arguments, 1));
        })
    };

    $.fn.snapscroll.lookup = {i: 0};

    /**
     * 插件的默认值
     */
    $.fn.snapscroll.defaults = {
        directionLockThreshold: 5,          //方向锁定阈值，判断用户的拖动意图，是倾向x方向拖动还是y方向
        scroll:'n',                         //左右滚动h / 上下滚动v /左右上下都可滚动n
        scrollThreshold:4,                  //百分比，4表示页面的4/1，单位n*100%
        speed:400,                          //页面滚动速度，单位ms
        loop: true                          //是否循环
    };

})(Zepto,window);

