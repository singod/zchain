/**
 * 
 * JavaScript ModelDialog v0.5
 * Copyright (c) 2011 snandy
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * Date: 2011-10-08 
 * 
 * 
 * new ModelDialog({
 *		 caption	 标题 '对话框标题'(默认)
 *		 template	 主体内容 ''(默认)
 *		 dialogCls	 对话框className 'md-dialog'(默认)
 *		 headCls	  头部className 'md-head'(默认)
 *		 btnCloseCls 关闭按钮className 'md-close'(默认)
 *		 bodyCls	 主体className 'md-body'(默认)
 *		 shadowBg	遮盖层背景色 'gray'(默认)
 *		 shadowOpy	 遮盖层透明的 0.2(默认)
 *		 dragable	 是否可拖拽 true(默认)
 *		 dragInWin	是否仅在窗口内拖动 (true)默认  与area互斥
 *		 area		  [minX,maxX,minY,maxY] 与dragInWin互斥
 * });
 */
ModelDialog = function(){
	
var px = 'px';
var isIE = /msie/.test(navigator.userAgent.toLowerCase());

function getViewSize(){
	return {w: window['innerWidth'] || document.documentElement.clientWidth,
			h: window['innerHeight'] || document.documentElement.clientHeight};
}
function getFullSize(){
	var w = Math.max(document.documentElement.clientWidth ,document.body.clientWidth) + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	var h = Math.max(document.documentElement.clientHeight,document.body.clientHeight) +  Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	w = Math.max(document.documentElement.scrollWidth,w);
	h = Math.max(document.documentElement.scrollHeight,h);
	return {w:w,h:h};	
}
function $(tag){
	return new $.prototype.init(tag);
}
$.prototype = {
	init : function(tag){
		this[0] = document.createElement(tag);
		return this;		
	},
	setCls : function(cls){
		this[0].className = cls;
		return this;
	},
	setSty : function(name,val){
		name=='opacity' ? 
			isIE ? 
				this[0].style.filter = 'Alpha(Opacity=' + val*100 + ')' : 
				this[0].style.opacity = val :
			this[0].style[name] = val;
		return this;
	},
	css : function(str){
		this[0].style.cssText = str;
		return this;
	},
	html : function(str){
		this[0].innerHTML = str;
		return this;
	}
}
$.prototype.init.prototype = $.prototype;

function ModelDialog(opt){
	this.dialogCls = opt.dialogCls || 'md-dialog';
	this.headCls = opt.headCls || 'md-head';
	this.btnCloseCls = opt.btnCloseCls || 'md-close';
	this.bodyCls = opt.bodyCls || 'md-body';
	this.shadowBg = opt.shadowBg || 'gray';
	this.shadowOpy = opt.shadowOpy || '0.2';
	this.caption = opt.caption || "对话框标题";
	this.template = opt.template || '';
	this.dragable = opt.dragable != false;
	this.dragInWin = opt.dragInWin != false;
	this.area = opt.area;
	this.dialog = null;
	this.head = null;
	this.label = null;
	this.btnClose = null;
	this.body = null;
	this.shadow = null;
	this.init();
}
ModelDialog.prototype = {
	init : function(){
		var _this = this;
		this.dialog = $('div').setCls(this.dialogCls).css('position:absolute;z-index:100;')[0];
		this.head = $('div').setCls(this.headCls)[0];
		this.label = $('label').html(this.caption)[0];
		this.btnClose = $('div').setCls(this.btnCloseCls)[0];
		this.on(this.btnClose,'click',function(){
			_this.close();
		});
		this.head.appendChild(this.label);
		this.head.appendChild(this.btnClose);
		this.body = $('div').setCls(this.bodyCls)[0];
		this.setContent(this.template);
		var hd = $('div').setCls('hd')[0];
		var ft = $('div').setCls('ft')[0];
		var bd = $('div').setCls('bd')[0];
		
		bd.appendChild(this.head);
		bd.appendChild(this.body);
		this.dialog.appendChild(hd);
		this.dialog.appendChild(bd);
		this.dialog.appendChild(ft);
		this.createShadow();
		document.body.appendChild(this.shadow);
		document.body.appendChild(this.dialog);
		this.moveToCenter();
		// 计算拖拽范围  
		// 标准模式下：clientWidth=width+padding；offsetWidth=width+padding+border
		if(this.dragable){
			if(this.dragInWin){
				var maxX = getFullSize().w - this.dialog.offsetWidth;
				var maxY = getViewSize().h - this.dialog.offsetHeight;
				this.dragdrop(this.dialog,{
					bridge : this.head,
					area : [0,maxX,0,maxY]
				});
				return;
			}
			if(this.area){
				this.dragdrop(this.dialog,{
					bridge : this.head,
					area : this.area
				});
				return;
			}				
			this.dragdrop(this.dialog,{
				bridge : this.head
			});
			
		}

	},
	destroy : function(){
		this.dialog = null;
		this.head = null;
		this.label = null;
		this.btnClose = null;
		this.body = null;
		this.shadow = null;
	},		
	createShadow : function(){
		var str = 'position:absolute;left:0px;top:0px;z-index:1' + 
			';width:' + getFullSize().w + px +
			';height:' + getFullSize().h + px +
			';background:' + this.shadowBg +
			';opacity:' + this.shadowOpy +
			';filter:Alpha(Opacity=' + this.shadowOpy*100 + ');';
		var _this = this;	
		this.shadow = $("div").setCls('md-shadow').css(str)[0];
		this.on(window,'resize',function(){
			if(_this.shadow) {
				_this.shadow.style.width = getFullSize().w + px;
				_this.shadow.style.height = getFullSize().h + px;
				_this.moveToCenter();   
			}

		});			
	},
	moveTo : function(x, y){
		this.dialog.style.left = x + px;
		this.dialog.style.top = y + px;
	},
	moveToCenter : function(){
		var size = getViewSize();
		var x = (size.w-50)/2 - (this.dialog.clientWidth-50)/2;
		var y = (size.h- 50)/2 - (this.dialog.clientHeight-50)/2 + document.documentElement.scrollTop;
		this.moveTo(x, y);
	},
	setCaption : function(v){
		this.caption = v;
		this.label.innerHTML = v;
	},
	setContent : function(str){
		this.template = str;
		this.body.innerHTML = str;
	},
	close : function(){
		if(this.dialog && this.shadow) {
			document.body.removeChild(this.dialog);
			document.body.removeChild(this.shadow);
		}
		this.destroy();
	},		
	on : function(el, type, fn){
		el.addEventListener ? 
			el.addEventListener(type, fn, false) :
			el.attachEvent("on" + type, fn);
	},
	un : function(el,type,fn){
		el.removeEventListener ?
			el.removeEventListener(type, fn, false) :
			el.detachEvent("on" + type, fn);
	},
	dragdrop : function(){
		return function(el,opt){
			var _this=this,
				ele,
				diffX,
				diffY,
				dragX=true,
				dragY=true,
				minX,
				maxX,
				minY,
				maxY,
				bridge;
			ele = el;
			opt && opt.dragX===false && (dragX=false);
			opt && opt.dragY===false && (dragY=false);
			opt && opt.area && typeof opt.area[0]==='number' && (minX=opt.area[0]);
			opt && opt.area && typeof opt.area[1]==='number' && (maxX=opt.area[1]);
			opt && opt.area && typeof opt.area[2]==='number' && (minY=opt.area[2]);
			opt && opt.area && typeof opt.area[3]==='number' && (maxY=opt.area[3]);
			opt && opt.bridge && (bridge=opt.bridge);	
			ele.style.position = 'absolute';
			bridge ?
				this.on(bridge,'mousedown',mousedown) :
				this.on(ele,'mousedown',mousedown);
			function mousedown(e){
				e = e || window.event;
				if(window.captureEvents){//标准DOM
					e.stopPropagation();
					_this.on(window, "blur", mouseup);
					e.preventDefault();
				}else if(ele.setCapture){//IE
					_this.on(ele, "losecapture", mouseup);
					ele.setCapture();
					e.cancelBubble = true; //IE
				}
				_x = e.clientX;
				_y = e.clientY;
				diffX = e.clientX - ele.offsetLeft;
				diffY = e.clientY - ele.offsetTop;
				_this.on(document,'mousemove',mousemove);
				_this.on(document,'mouseup',mouseup);
			}
			function mousemove(e){
				e = e || window.event;
				var moveX = e.clientX - diffX,
					moveY = e.clientY - diffY;
				moveX < minX && (moveX = minX); // left 最小值
				moveX > maxX && (moveX = maxX); // left 最大值
				moveY < minY && (moveY = minY); // top 最小值
				moveY > maxY && (moveY = maxY); // top 最大值
				
				dragX && (ele.style.left = moveX + 'px');
				dragY && (ele.style.top =  moveY + 'px');
			}
			function mouseup(e){
				ele.style.cursor = '';
				_this.un(document,'mousemove',mousemove);
				_this.un(document,'mouseup',mouseup);
				if(window.releaseEvents){//标准DOM
					_this.un(window, "blur", mouseup);
				}else if(ele.releaseCapture){//IE
					_this.un(ele, "losecapture", mouseup);
					ele.releaseCapture();
				}

			}
		}
	}()
	
}

return ModelDialog;
}();
