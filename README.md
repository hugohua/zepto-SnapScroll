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
//是否需要循环，即如果到最后一页，则自动接上第一页
loop:false/true
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
$("#J_pages").on('done:scroll',function(e,data){
            console.info('done event',data)
})

```

##DEMO
看[DEMO](http://oos.me/zepto-SnapScroll/demo.html)

## Changelog
* v0.0.1 项目创建

## Other
[My Blog](http://www.ghugo.com)

