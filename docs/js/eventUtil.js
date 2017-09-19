(function() {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};

    var ArrayProto = Array.prototype;

    var push = ArrayProto.push;

    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports.E = _;
    } else {
        root.E = _;
    }

    _.VERSION = '1.0.0';

    var nextGuid = 1;

    var tidyUp = function(elem, type) {
        function isEmpty(object) {
            for (var prop in object) {
                return false;
            }
            return true;
        }
        var data = _.getData(elem);

        if (data.handlers[type].length === 0) {
            delete data.handlers[type];

            if (document.removeEventListener) {
                elem.removeEventListener(type, data.dispatcher, false);
            } else if (document.detachEvent) {
                elem.detachEvent("on" + type, data.dispatcher);
            }
        }

        if (isEmpty(data.handlers)) {
            delete data.handlers;
            delete data.dispatcher;
        }

        if (isEmpty(data)) {
            _.removeData(elem)
        }
    }

    _.addEvent = function(elem, type, fn) {

        if (!elem) throw new Error('addEvent 方法未传入参数')

        var data = _.getData(elem);
        if (!data.handlers) data.handlers = {};
        if (!data.handlers[type]) {
            data.handlers[type] = [];
        }
        if (!fn.guid) fn.guid = nextGuid++;

        data.handlers[type].push(fn);

        if (!data.dispatcher) {
            data.disabled = false;
            data.dispatcher = function(event) {
                if (data.disabled) return;
                event = _.fixEvent(event);

                var handlers = data.handlers[event.type];
                if (handlers) {
                    for (var n = 0; n < handlers.length; n++) {
                        handlers[n].call(elem, event);
                    }
                }
            }
        };

        if (data.handlers[type].length == 1) {
            if (document.addEventListener) {
                elem.addEventListener(type, data.dispatcher, false)
            } else if (document.attachEvent) {
                elem.attachEvent("on" + type, data.dispatcher);
            }
        }
    }

    _.removeEvent = function(elem, type, fn) {

        var data = _.getData(elem);

        if (!data.handlers) return;

        var removeType = function(t) {
            data.handlers[t] = [];
            tidyUp(elem, t)
        };

        if (!type) {
            for (var t in data.handlers) removeType(t);
            return;
        }



        var handlers = data.handlers[type];
        if (!handlers) return;

        if (!fn) {
            removeType(type);
            return;
        }



        if (fn.guid) {
            for (var n = 0; n < handlers.length; n++) {
                if (handlers[n].guid === fn.guid) {
                    handlers.splice(n--, 1);
                }
            }
        }

        tidyUp(elem, type);
    };

    _.triggerEvent = function(elem, event) {
        var elemData = _.getData(elem),
            parent = elem.parentNode || elem.ownerDocument;
        if (typeof event === "string") {
            event = {
                type: event,
                target: elem
            }
        }
        event = _.fixEvent(event);

        if (elemData.dispatcher) {
            elemData.dispatcher.call(elem, event);
        }

        if (parent && !event.isPropagationStopped()) {
            _.triggerEvent(parent, event);
        } else if (!parent && !event.isDefaultPrevented()) {
            var targetData = _.getData(event.target)

            if (event.target[event.type]) {
                targetData.disabled = true;
                event.target[event.type]();
                targetData.disabled = false;
            }
        }
    };

    _.fixEvent = function(event) {

        function returnTrue() { return true; }

        function returnFalse() { return false; }

        if (!event || !event.stopPropagation) {
            var old = event || window.event;
            event = {};
            for (var prop in old) {
                event[prop] = old[prop];
            }

            // 修复 target
            if (!event.target) {
                event.target = event.srcElement || document;
            }

            // 修复 relatedTarget
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

            // 修复 阻止默认
            event.preventDefault = function() {
            	old.returnValue = false;
                event.returnValue = false;
                // 为 true 表明已经调用了 preventDefault
                event.isDefaultPrevented = returnTrue;
            }

            event.isDefaultPrevented = returnFalse;

            // 修复 阻止进一步的冒泡或者捕获
            event.stopPropagation = function() {
            	old.cancelBubble = true;
                event.cancelBubble = true;
                event.isPropagationStopped = returnTrue;
            }

            event.isPropagationStopped = returnFalse;

            // 修复 阻止进一步的冒泡或者捕获，摈并且阻止任何事件处理程序
            event.stopImmediatePropagation = function() {
                this.isImmediatePropagationStopped = returnTrue;
                this.stopPropagation();
            };

            event.isImmediatePropagationStopped = returnFalse;

            // pageX 和 pageY
            if (event.clientX != null) {
                var doc = document.documentElement,
                    body = document.body;
                event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                    (doc && doc.clientLeft || body && body.clientLeft || 0);

                event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // charCode 键盘事件的键盘码
            event.which = event.charCode || event.keyCode;

            // 0 == left, 1 == middle 2 == right
            if (event.button != null) {
                event.button = (event.button & 1 ? 0 :
                    (event.button & 4 ? 1 :
                        (event.button & 2 ? 2 : 0)));
            }
        }

        return event;
    }

    var cache = {},
        guidCounter = 1,
        expando = "data" + (new Date).getTime();

    _.getData = function(elem, key) {
        var guid = elem[expando];
        if (!guid) {
            guid = elem[expando] = guidCounter++;
            cache[guid] = {};
        }
        if (!!key) {
            return cache[guid][key]
        }
        return cache[guid];
    };

    _.setData = function(elem, key, value) {
        var guid = elem[expando];
        if (!guid) {
            guid = elem[expando] = guidCounter++;
            cache[guid] = {};
        }
        cache[guid][key] = value;
        return cache[guid]
    }

    _.removeData = function(elem) {
        var guid = elem[expando];
        if (!guid) return;
        delete cache[guid];
        try {
            delete elem[expando]
        } catch (e) {
            if (elem.removeAttribute) {
                elem.removeAttribute(expando);
            }
        }
    };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var isArrayLike = function(collection) {
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    var each = function(obj, callback) {
        var length, i = 0;

        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        }

        return obj;
    }

    var isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };

    var functions = function(obj) {
        var names = [];
        for (var key in obj) {
            if (isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    var mixin = function(obj) {
        each(functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return func.apply(_, args);
            };
        });
        return _;
    };

    mixin(_);

    _.prototype.value = function() {
        return this._wrapped;
    };

}());