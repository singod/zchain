/**
 * Event v0.2.5
 * 1,解决IE fn中丢失this
 * 2,统一了事件对象作为fn的第一个参数
 * 3,解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等统一使用w3c标准方式
 * 4,remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 5,remvoe方法新增删除元素所有的监听器(参数传el)
 * 6,add方法增加once参数，仅执行一次
 * 7,增加_find方法，解决fn只能添加el[type]一次 
 */
var E = {

	add : function(el, type, fn, once) {
		
		el.listeners = el.listeners || {};
		el.listeners[type] = el.listeners[type] || [];
		var listeners = el.listeners[type], func;
		
		//相同同el，type，fn只能添加一次
		if(this._find(el,type,fn)) return false; 
		
		//w3c
		if(el.addEventListener){
			
			if(once){
				var fun = function(){
					fn.apply(el,arguments);
					el.removeEventListener(type, fun, false);
				};
				el.addEventListener(type, fun, false);
				func = fun;
			}else{
				el.addEventListener(type, fn, false);
				func = fn;
			}					
		//IE
		}else if(el.attachEvent){
			
			var fun = function(){
				var evt = window.event;
				evt.stopPropagation = function(){ this.cancelBubble = true; };
				evt.preventDefault = function(){ this.returnValue = false;	};
				evt.target = evt.srcElement;
				evt.currentTarget = el;
				event.relatedTarget = event[(event.target == event.fromElement ? "to": "from") + "Element"];				
				fn.call(el,evt);
			};
			if(once){
				func = function(){
					fun();
					el.detachEvent('on' + type, func);
				}
				el.attachEvent('on' + type, func);

			}else{
				fun['_fn_'] = fn;
				el.attachEvent('on' + type, fun);
				func = fun;
			}
			
		}

		listeners.push(func);

	},
	_find : function(el, type, fn) {
		var listeners = el.listeners, typeListeners = listeners[type], fun;
		if(typeListeners){
			for(var i=0,obj;obj=typeListeners[i++];){
				fun = obj.fn;
				if( (fun['_fn_'] && fun['_fn_']==fn) || fun==fn ){	
					return true;
				}	
			}
			return false;
		}
	},
	_remove : function(el,type,fn) {
		if(!fn.fn && el.removeEventListener){
			el.removeEventListener(type, fn, false);
		}else if(el.detachEvent){
			el.detachEvent('on' + type, fn);
		}
	},
	remove : function(el,type,fn) {
		var listeners = el.listeners, typeListener = listeners[type], fun, idx;

		//只传参数el
		if(!type && !fn){
			for(var type in listeners){
				for(var i=0,obj;obj=listeners[type][i++];){
					this._remove(el,type,obj.fn);				
				}
			}
			delete el.listeners;
			return;
		}

		//传参数el，type
		if(type && !fn){
			for(var j=0,obj;obj=listeners[type][j++];){
				this._remove(el,type,obj.fn);
			}
			delete listeners[type];
			return;
		}
		
		//传参数el，type，fn
		for(var i=0,obj;obj=typeListener[i++];){
			fun = obj.fn, idx = obj.idx;

			if(fun['_fn_'] && fun['_fn_']==fn){				
				this._remove(el,type,fun);
				typeListener.splice(idx-1, 1);
				break;										
			}else if(fun==fn){					
				this._remove(el,type,fn);
				typeListener.splice(idx-1, 1);
				break;
			}
		}
		
	}
};
