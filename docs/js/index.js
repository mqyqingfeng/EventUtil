var getStyle = function(element, prop) {
    return element.currentStyle ? element.currentStyle[prop] : document.defaultView.getComputedStyle(element)[prop];
}
var pre = document.getElementsByTagName("pre");
for (var i = 0, len = pre.length; i < len; i++) {
    var target = document.getElementById(pre[i].getAttribute("data-code") + "-wrapper");
    target.style.height = pre[i].offsetHeight + "px";
}

// 1. 绑定多个不同类型的事件
var div10 = document.getElementById("div1-0");
E.addEvent(div10, 'mouseover', function(event) {
    this.style.backgroundColor = "#3498db";
})
E.addEvent(div10, 'mouseout', function(event) {
    this.style.backgroundColor = "#1abc9c";
})
E.addEvent(div10, 'click', function(event) {
    this.style.backgroundColor = "#9b59b6";
})

// 支持面向对象绑定的方式
var div11 = document.getElementById("div1-1");
E(div11).addEvent('mouseover', function(event){
	this.style.backgroundColor = "#3498db";
})
E(div11).addEvent('mouseout', function(event){
	this.style.backgroundColor = "#1abc9c";
})
E(div11).addEvent('click', function(event){
	this.style.backgroundColor = "#9b59b6";
})

// 2. 绑定多个相同的事件，要求顺序执行函数
var div2 = document.getElementById("div2");

var alertOne = function() { alert('第一个事件函数') }
var alertTwo = function() { alert('第二个事件函数') }
var alertThree = function() { alert('第三个事件函数') }

E.addEvent(div2, 'click', alertOne)
E.addEvent(div2, 'click', alertTwo)
E.addEvent(div2, 'click', alertThree)

// 3. 删除事件
var div3 = document.getElementById("div3");

var remove = function() {
    alert('第一个事件函数');
    E.removeEvent(div3, "click", alertTwo)
}

E.addEvent(div3, 'click', remove)
E.addEvent(div3, 'click', alertTwo)
E.addEvent(div3, 'click', alertThree)

// 4. 触发事件
var div4 = document.getElementById("div4");

E.addEvent(div4, 'click', remove)
E.addEvent(div4, 'click', alertTwo)
E.addEvent(div4, 'click', alertThree)

var triggerBtn = document.getElementById("div4-trigger-btn");
E.addEvent(triggerBtn, 'click', function() {
    E.triggerEvent(div4, 'click')
})

// 5. 阻止冒泡
var div5 = document.getElementById("div5");
var div5Wrapper = document.getElementById("div5-wrapper");

E.addEvent(div5Wrapper, 'click', function() {
    alert("冒泡触发了外层的事件")
})

E.addEvent(div5, 'click', function(event) {
    event.stopPropagation();
    alert("阻止了冒泡")
})

// 6. 阻止默认
var div6 = document.getElementById("div6");

E.addEvent(div6, 'click', function(event) {
    event.preventDefault();
    alert("阻止了默认的跳转行为")
})

var triggerBtn = document.getElementById("div6-trigger-btn");
E.addEvent(triggerBtn, 'click', function() {
    E.triggerEvent(div6, 'click')
})

// 7. event.pageX 和 event.pageY
var div7 = document.getElementById("div7");

E.addEvent(div7, 'click', function(event) {
    alert('event.pageX: ' + event.pageX + '\n' + "event.pageY: " + event.pageY)
})

// 8. event.button
var div8 = document.getElementById("div8");

E.addEvent(div8, 'click', function(event) {
    alert('event.button: ' + event.button)
})

// 9. event.which 0 == left, 1 == middle 2 == right
var div9 = document.getElementById("div9");

E.addEvent(div9, 'keypress', function(event) {
    document.getElementById("input-text").innerHTML = String.fromCharCode(event.which)
})

// 10. 在元素上绑定数据
var div10 = document.getElementById("div10");
var setBtn = document.getElementById("set-data");
var getBtn = document.getElementById("get-data");
var removeBtn = document.getElementById("remove-data");

E.addEvent(setBtn, 'click', function(event) {
    E.setData(div10, 'name', 'Kevin')
})

E.addEvent(getBtn, 'click', function(event) {
    alert(E.getData(div10, 'name'))
})

E.addEvent(removeBtn, 'click', function(event) {
    E.removeData(div10)
})