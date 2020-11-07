//封装歌手列表页面 基础添加属性的 类
export const addObj = function(id, name, picSrc) {
	let obj = {};
	obj.id = id;
	obj.name = name;
	obj.picSrc = picSrc;
	return obj;
}