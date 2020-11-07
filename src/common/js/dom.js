//封装一些常用dom操作方法

//给元素添加类名
export const addClass = function(element,className) {
	element.classList.add(className);
}


//封装检测浏览器并自动给属性加前缀的函数
let elementStyle = document.createElement('div').style

let vendor = (() => {
	let prefixNameObj = {
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		ms: 'msTransform',
		standard: 'transform'
	};

	for(let key in prefixNameObj) {
		if (elementStyle[prefixNameObj[key]] !== undefined) {
			return key;
		}
		return false;
	}
})();


export function profixStyle(style) {
	if (vendor === false) {
		return false;
	}
	if (vendor === 'standard') {
		return style;
	}
	return vendor + style.charAt(0).toUpperCase() + style.substring(1);
}