//封装jsonp函数
import originJSONP from 'jsonp';

export default function jsonp(url,data,option) {
	url = (url.include('?')? '&' : '?') + data2UrlParam(data);    //将url地址后拼接上data参数

	return new Promise((resolve,reject) => {
		originJSONP(url, option, (err,data) => {
			if(err) {
				reject(err);
			}
			resolve(data);
		})
	})
}



//封装函数将对象参数加到url中
function data2UrlParam(data) {
	let url = '';
	for (let key in data) {
		let value = data[key]? data[key] : '';
		url += `&${key}=&{value}`;
	}
	return url? url.substring(1) : '';
}