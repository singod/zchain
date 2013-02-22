/*
 */
function isFunction( obj ) {
	return Object.prototype.toString.call(obj) === "[object Function]";
}

function isArray( obj ) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}

function isPlainObject( obj ) {
	if(!obj || obj===window || obj===document || obj===document.body ) 
		return false;
	return 'isPrototypeOf' in obj && Object.prototype.toString.call(obj)==='[object Object]';
}

function isEmptyObject( obj ) {
	for ( var name in obj ) {
		return false;
	}
	return true;
}

function evalJs(str){
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	try{
		script.appendChild( document.createTextNode(str) );
	}catch(e){
		script.text = str;
	}

	head.insertBefore(script,head.firstChild);
	head.removeChild(script);
}

/*
  isHTMLControl(window/document/div)
  isHTMLControl(new Object)
  isHTMLControl({nodeType:1})
 */
function isHtmlControl(obj) { 

	var d = document.createElement("div");
	try{
		d.appendChild(obj.cloneNode(true));
		return obj.nodeType==1 ? true : false;
	}catch(e){
		return obj==window || obj==document;
	}
}	

var makeArray = function(obj) {
	// IE9/Firefox/Safari/Chrome/Opera
	return slice.call(obj,0);
}
try{
	slice.call(document.documentElement.childNodes, 0)[0].nodeType;
}catch(e){
	// IE6/7/8
	makeArray = function(obj) {
		var res = [];
		for(var i=0,len=obj.length; i<len; i++) {
			res[i] = obj[i];
		}
		return res;

	}
}

// from seajs
function removeComments(code) {
    return code
        .replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n')
        .replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
}


// 预加载JS from <<JavaScript Patterns>>
function preload(url) {
	var obj, body
	if (/*@cc_on!@*/!1) {
		obj = new Image()
		obj.src = url 
	} else {
		obj = document.createElement('object')
		body = document.body
		obj.width = 0
		obj.height = 0
		obj.data = url
		body.appendChild(obj)
	}
}
preload('http://code.jquery.com/jquery-1.8.0.js')

// 获取flash对象
function thisMovie(movieName) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		if(navigator.appVersion.match(/9./i)!="9."){
			return window[movieName];
		}else{
			return document[movieName];
		}
	} else {
		 return document[movieName];
	}
}



