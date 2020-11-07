//封装打乱数组的方法
function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomArr(arr) {
	let _arr = arr.slice();
	for(let i = 0; i < _arr.length; i++) {
		let k = getRandomNum(0, i);
		let t = _arr[i];
		_arr[i] = _arr[k];
		_arr[k] = t;
	}
	return _arr;
}


//封装节流函数
export function debounce(func, delay) {
	let timer;
	
	return function(...args) {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			func.apply(this,args);
		}, delay);
	}
}