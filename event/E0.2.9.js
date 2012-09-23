﻿/**
 * Event v0.2.9
 * 1, 解决IE fn中丢失this
 * 2, 统一了事件对象作为fn的第一个参数
 * 3, 解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等
 * 4, remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 5, remvoe方法新增删除元素所有的监听器(参数传el)
 * 6, 解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome中顺序)
 * 8, add方法新增once参数，fn只执行一次
 * 9, 增加对非html元素(普通对象)自定义事件---观察者模式
 * 10,增加dispatch方法
 */
var E = (function(){
	
	function _each( ary, callback ) {

		for( var i=0; i<ary.length; ) { 
			if( callback( i, ary[i] ) ) 
				i=0;
			else
				i++;
		}
	}

	function _remove( el, type ) {

		if(el.removeEventListener){
			el.removeEventListener( type, el.listeners[type]['_fn_'], false );
			
		}else if(el.detachEvent){
			el.detachEvent( 'on'+type, el.listeners[type]['_fn_'] );

		}

		delete el.listeners[type];
	}

	function _fixEvent( evt, el ) {		
		evt.stopPropagation = evt.stopPropagation || function(){ this.cancelBubble = true; };
		evt.preventDefault = evt.preventDefault || function(){ this.returnValue = false;};			
		if(!evt.target) evt.target = evt.srcElement;
		if(!evt.currentTarget) evt.currentTarget = el;

		return evt;
	}

	function _isHtmlControl(obj) { 

		var d = document.createElement("div");
		try{
			d.appendChild(obj.cloneNode(true));
			return obj.nodeType==1 ? true : false;
		}catch(e){
			return obj==window || obj==document;
		}
	}	

	function add( el, type, fn, once ) {
		
		el.listeners = el.listeners || {};
		var listeners = el.listeners[type] = el.listeners[type] || [];
		!once ? listeners.push( fn ) : listeners.push( {one:fn} );
		
		if( _isHtmlControl(el) ){

			if ( !listeners['_fn_'] ){

				listeners['_fn_'] = function(e){
					
					var evt = e || window.event;
						evt = _fixEvent( evt, el );

					for(var i=0,fn;fn=listeners[i++];){
						
						if( typeof fn=="function" ){
							fn.call( el, evt );	
						}else{
							fn.one.call( el, evt );
							remove( el, type, fn.one );
							i--;
						}
					}
				}
				if( el.addEventListener ){
					el.addEventListener( type, listeners['_fn_'], false );
				}else if(el.attachEvent){
					el.attachEvent('on' + type,  listeners['_fn_'] );
				}

			}

		}else {
			if ( !listeners['_fn_'] ){

				listeners['_fn_'] = function(){

					for(var i=0,fn;fn=listeners[i++];){
					
						if( typeof fn=="function" ){
							fn.call( el );	
						}else{
							fn.one.call( el );
							remove( el, type, fn.one );
							i--;
						}
					}				
				}
			}

			el[ type ] = listeners['_fn_'];
		}
	}

	function remove( el, type, fn ) {
		
		if(!el.listeners) return;

		//只传参数el
		if( !type && !fn ){
			for( var t in el.listeners ){
				_remove( el, t );
			}
			return;
		}

		//传参数el，type
		if( type && !fn && el.listeners[type] ){
			_remove( el, type );			
			return;
		}
		
		//传参数el，type，fn
		var listeners = el.listeners && el.listeners[type];
		if( listeners ) {
			_each(listeners,function( i, f ) {
				if( f==fn || f.one==fn )
					return listeners.splice( i, 1 );											
			});
			if( listeners.length == 0 )
				delete el.listeners[type];
		}
		
	}

	function dispatch( el, type, args) {
		try{
			if(el.dispatchEvent){
				var evt = document.createEvent('Event');
				evt.initEvent(type,true,true);
				el.dispatchEvent(evt);
			}else if(el.fireEvent){
				el.fireEvent('on'+type);
			}else{
				el[ type ]();
			}
		}catch(e){alert(e);};
	}

	return {add: add, remove: remove, dispatch: dispatch};

})();