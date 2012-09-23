/**
 * Event v0.2.8
 * 1,���IE fn�ж�ʧthis
 * 2,ͳһ���¼�������Ϊfn�ĵ�һ������
 * 3,����¼�����ļ��������⣬����ֹĬ����Ϊ��ֹͣð�ݵ�ͳһʹ��w3c��׼��ʽ
 * 4,remove��������ɾ��Ԫ��type���͵����м�����(������el��type)
 * 5,remvoe��������ɾ��Ԫ�����еļ�����(������el)
 * 6,�����ͬһ���¼���handlersִ��˳������(IE����FF/Safari/Chrome��˳��)
 * 8,add��������once������fnִֻ��һ��
 *
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
	}

	function add( el, type, fn, once ) {
		
		el.listeners = el.listeners || {};
		var listeners = el.listeners[type] = el.listeners[type] || [];
		!once ? listeners.push( fn ) : listeners.push( {one:fn} );
		
		if( !listeners['_fn_'] ){
			listeners['_fn_'] = function(e){
				
				var evt = e || window.event;
				_fixEvent( evt, el );

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
	}

	function remove( el, type, fn ) {
		
		if(!el.listeners) return;

		//ֻ������el
		if( !type && !fn ){
			for( var t in el.listeners ){
				_remove( el, t );
			}
			return;
		}

		//������el��type
		if( type && !fn && el.listeners[type] ){
			_remove( el, type );			
			return;
		}
		
		//������el��type��fn
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

	return {add: add, remove: remove};
})();