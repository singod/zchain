/**
 * �ѱ�����ת��Ϊhash����
 * @param {HTMLElement} form����
 * @return {hash}
 * @example
 *         formToHash(document.forms[0]);
 */
function formToHash(form){
	var hash = {}, el;
	for(var i = 0,len = form.elements.length;i < len;i++){
		el = form.elements[i];
		if(el.name == "" || el.disabled) continue;
		switch(el.tagName.toLowerCase()){
		case "fieldset":
			break;
		case "input":
			switch(el.type.toLowerCase()){
			case "radio":
				if(el.checked)
					hash[el.name] = el.value;
				break;
			case "checkbox":
				if(el.checked){
					if(!hash[el.name]){
						hash[el.name] = [el.value];
					}else{
						hash[el.name].push(el.value);
					}
				}
				break;
			case "button":
				break;
			case "image":
				break;
			default:
				hash[el.name] = el.value;
				break;
			}
			break;
		case "select":
			if(el.multiple){
				for(var j = 0, lens = el.options.length;j < lens; j++){
					if(el.options[j].selected){
						if(!hash[el.name]){
							hash[el.name] = [el.options[j].value];
						}else{
							hash[el.name].push(el.options[j].value);
						}
					}
				}
			}else{
				hash[el.name] = el.value;
			}
			break;
		default:
			hash[el.name] = el.value;
			break;
		}
	}
	form = el = null;
	return hash;
}
/**
 * �Ѻ��б����ݵ�hash����ת��Ϊ����
 * @param {obj} hash����
 * @return {Array}
 * @example
 *   var aData = formHashToArray(hash);
 */
function formHashToArray(hash){
	var a = [];
	for(var k in hash){
		if(typeof hash[k] == "string"){
			a.push(k + "=" + encodeURIComponent(hash[k]));
		}else{
			for(var i = 0, len = hash[k].length; i < len; i++){
				a.push( k + "=" + encodeURIComponent(hash[k][i]));
			}
		}
	}
	return a;
}