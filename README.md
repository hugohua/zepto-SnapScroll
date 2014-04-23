snap scroll
=====

snap scroll 是一个移动端手机页面切换插件，可以上下滑动进行切换，暂不支持左右滑动。

因项目需要，该版本目前仅在chrome 和 safari 下运行。


##Use

调用如下语句即可。
```js
$("#J_pages").snapscroll();
```
同时支持以下参
```js
        directionLockThreshold: 5,          //方向锁定阈值，判断用户的拖动意图，是倾向x方向拖动还是y方向
        scroll:'n',                         //左右滚动h / 上下滚动v /左右上下都可滚动n
        scrollThreshold:4,                  //百分比，4表示页面的4/1，单位n*100%
        speed:400,                          //页面滚动速度，单位ms
        loop: true                          //是否循环
```

举个栗子，在调用插件时传递对应的参数即可:
```js

$("#J_pages").snapscroll({
    directionLockThreshold: 5,          //方向锁定阈值，判断用户的拖动意图，是倾向x方向拖动还是y方向
    scroll:'v',                         //左右滚动h / 上下滚动v /左右上下都可滚动n
    scrollThreshold:4,                  //百分比，4表示页面的4/1，单位n*100%
    speed:400,                          //页面滚动速度，单位ms
    loop: true                          //是否循环
});

```

##Method

插件提供以下几个方法调用

//TODO

##Event
插件提供以下几个回调事件
```js
//开始滑动时触发
$("#J_pages").on('start:scroll',function(e,curIndex,newIndex,direction){
    console.info('start event',curIndex,newIndex,direction);
});

//活动结束后触发
$("#J_pages").on('done:scroll',function(e,newIndex,direction){
   console.info('done event',newIndex,direction)
})

```

##DEMO
看[DEMO](http://oos.me/zepto-SnapScroll/demo.html)

## Changelog
* v0.0.2
    1. 新增四向滚动
    2. 修复部分BUG
* v0.0.1 项目创建

## Other
[My Blog](http://www.ghugo.com)

