define(function(){function a(a){var b=attr=="className"?a.className:a.getAttribute(attr);if(b){if(!val)return!0;if(reg.test(b))return!0}return!1}function b(b,c,d){var e=RegExp("(?:^|\\s+)"+d+"(?:\\s+|$)"),f=-1,g,h=-1,i=[];while(g=b[++f])a(g)&&(i[++h]=g);return i}return function(a,c){var d=a,e=document,f=/^#[\w\-]+/,g=/^([\w\-]+)?\.([\w\-]+)/,h=/^([\w\*]+)$/,i=/^([\w\-]+)?\[([\w]+)(=(\w+))?\]/,c=c==undefined?document:typeof c=="string"?e.getElementById(c.substr(1,c.length)):c;if(f.test(d))return e.getElementById(d.substr(1,d.length));if(c.querySelectorAll){if(c.nodeType==1){var j=c.id,k=c.id="__$$__";try{return c.querySelectorAll("#"+k+" "+d)}catch(l){}finally{j?c.id=j:c.removeAttribute("id")}}return c.querySelectorAll(d)}if(g.test(d)){var m=d.split("."),n=m[0],o=m[1],p,q,r=[];if(c.getElementsByClassName){var s=c.getElementsByClassName(o);if(n){for(var t=0,p=s.length;t<p;t++)s[t].tagName.toLowerCase()==n&&r.push(s[t]);return r}return s}return q=c.getElementsByTagName(n||"*"),b(q,"className",o)}if(h.test(d))return c.getElementsByTagName(d);if(i.test(d)){var m=i.exec(d),q=c.getElementsByTagName(m[1]||"*");return b(q,m[2],m[4])}}}),define(function(){var a=window.document,b=window.navigator,c=b.userAgent,d=b.platform,e=window.RegExp,f=/\./g,g=function(a){var b=0;return parseFloat(a.replace(f,function(){return b++===1?"":"."}))},h={},i,j,k="unknow";if(/Windows|Win32/.test(c)){k="win";if(/Windows NT\s([^;]+)/.test(c))switch(e.$1){case"5.0":case"5.1":k="win2k";break;case"6.0":k="vista";break;case"6.1":k="win7"}}else if(/Macintosh/.test(c))k="mac";else if(d==="X11")k="unix";else if(/rhino/i.test(c))k="rhino";else if(d==="iPad"||d==="iPhone"||/i(?:Phone|Pad)/.test(c))k="iOS";h.os=k,/KHTML/.test(c)&&(h.webkit=1),(h.webkit=/AppleWebKit\/([^\s]*)/.test(c))||(h.ie=/MSIE\s([^;]*)/.test(c))||(h.opera=/Opera[\s\/]([^\s]*)/.test(c))||(h.gecko=/Gecko\/([^\s]*)/.test(c))||(h.unknown=!0),i=e.$1,h.webkit?(h.webkit=g(i),/Safari\/([^\s]*)/.test(c)&&(k="safari",j="Version",/Chrome\/([^\s]*)/.test(c)&&(k="chrome",j="Chrome"),h[k]=g((new e(j+"/([^s]*)")).test(c)&&e.$1))):h.gecko&&(i=/rv:([^\s\)]*)/.test(c)&&e.$1,/Firefox\/([^\s]*)/.test(c)&&(h.firefox=g(e.$1))),i=i||e.$1,i&&(h.version=g(i));if(h.ie){h.ie=h.version,h.ie>=8&&a.documentMode!==5&&(h.ie=a.documentMode);if(h.ie<=6)try{a.execCommand("BackgroundImageCache",!1,!0)}catch(l){}}return h.isStrict=a.compatMode==="CSS1Compat",h})