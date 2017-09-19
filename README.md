# EventUtil

## 介绍

用于抹平 IE 旧版本(IE8 及以下) 与现代浏览器在事件绑定的差异。

[https://mqyqingfeng.github.io/EventUtil/](https://mqyqingfeng.github.io/EventUtil/)

## 兼容性

支持 IE5+

## 依赖

原生 JavaScript 实现，无依赖。

## 说明

IE 旧版本与现代浏览器在事件绑定上的区别有：

<table>
    <tr>
        <th>事件绑定</th>
        <th>现代浏览器</th>
        <th>IE8 及以下</th>
        <th>区别</th>
    </tr>
    <tr>
        <td>添加事件</td>
        <td>
            addEventListener
        </td>
        <td>attachEvent</td>
        <td>
            1. attachEvent 第一个参数是 "onclick"，而非 addEventListener 中的 "click"。<br />
            2. 事件处理程序的作用域不同。在 addEventListener 中，this 指向当前元素，而在 attachEvent 中，this 指向 window。<br />
            3. 当添加多个事件处理成时，addEventListener 是按照添加顺序顺序执行，attachEvent 以相反的顺序被触发。
        </td>
    </tr>
    <tr>
        <td>移除事件</td>
        <td>
            removeEventListener
        </td>
        <td>detachEvent</td>
        <td>
            detachEvent 不支持捕获，只能冒泡
        </td>
    </tr>
    <tr>
        <td>事件对象-阻止默认</td>
        <td>preventDefault</td>
        <td>returnValue</td>
        <td></td>
    </tr>
    <tr>
        <td>事件对象-阻止默认</td>
        <td>preventDefault</td>
        <td>returnValue</td>
        <td></td>
    </tr>
    <tr>
        <td>事件对象-阻止冒泡</td>
        <td>stopPropagation</td>
        <td>cancelBubble</td>
        <td></td>
    </tr>
    <tr>
        <td>事件对象-鼠标相对于文档的位置</td>
        <td>event.pageX 和 event.pageY</td>
        <td>无</td>
        <td></td>
    </tr>
    <tr>
        <td>事件对象-键盘码</td>
        <td>event.which</td>
        <td>无</td>
        <td></td>
    </tr>
    <tr>
        <td>事件对象-鼠标按键</td>
        <td>event.button</td>
        <td>event.button</td>
        <td>对应的值不同</td>
    </tr>
    <tr>
        <td>事件对象-目标元素</td>
        <td>target</td>
        <td>srcElement</td>
        <td></td>
    </tr>
    <tr>
        <td>事件对象-关联元素</td>
        <td>relatedTarget</td>
        <td>toElement/fromElement</td>
        <td></td>
    </tr>
</table>

使用 eventUtil 后，不用再担心这些差异，直接按照现代浏览器的使用方法即可。

## 下载

```js
git clone git@github.com:mqyqingfeng/EventUtil.git
```

## 使用

```html
<script src="path/eventUtil.js"></script>
```

或者

```js
import E from 'path/eventUtil.js'
```

## API

### 添加事件

```js
var div1 = document.getElementById("div1");
E.addEvent(div1, 'mouseover', function() {
    this.style.backgroundColor = "#3498db";
})
```

支持面向对象的方式：

```js
var div1 = document.getElementById("div1-1");
E(div1).addEvent('mouseover', function(){
    this.style.backgroundColor = "#3498db";
})
```

### 删除事件

```js
var removeFn = function(){...}
E.removeEvent(div1, "click", removeFn)
```

### 触发事件

```js
E.triggerEvent(div1, 'click')
```

### 事件对象

addEvent 函数中的 event 对象已经是修复后的对象，可以直接使用。

```js
var div1 = document.getElementById("div1");
E.addEvent(div1, 'mouseover', function(event) {
    // 阻止冒泡
    event.stopPropagation();
    // 阻止默认行为
    event.preventDefault();
    // pageX 和 pageY
    event.pageX
    event.pageY
    // target
    event.target
    // relatedTarget
    event.relatedTarget
    // which
    event.which
    // button
    event.button
})
```

### 在元素上保存数据

```js
E.setData(div1, 'name', 'Kevin')
```

### 获取保存在元素上的数据

```js
E.getData(div1, 'name')
```

### 删除保存在元素上的数据

```js
E.removeData(div1)
```
