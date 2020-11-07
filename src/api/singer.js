//获取歌手页面的数据
import { commonParams, option } from 'api/config.js';
import axios from 'axios';
import './test.js';
// import jsonp from 'common/js/jsonp.js';

export const getSingerList = function() {    //获取歌手列表数据
	const url = '/api/getSingerList';
	const data = Object.assign({}, commonParams, {

		sign: 'zzaujmepdrzwaqar2f3fef04bda3a286eeb40136f6b80f4a',
		loginUin: 0,
		hostUin: 0,
		platform: 'yqq.json',
		needNewCode: 0,
		'-': "recom"+(Math.random()+"").replace("0.",""),
		data: {"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}
	});

	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data.dataArr)
	}).catch(err => {
		console.log(err);
	});
};

//jsonp方法获取数据失败
// export const getSongList = function(singerId) {      //获取歌曲列表数据
// 	const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
// 	const data = Object.assign({}, commonParams, {
// 		sign: 'zza972213mhaz0lauf6be8abd941f9f2b62c18f39dd6266e6',
// 		loginUin: 0,
// 		hostUin: 0,
// 		platform: 'yqq.json',
// 		needNewCode: 0,
// 		data: {"comm":{"ct":24,"cv":0},"singerSongList":{"method":"GetSingerSongList","param":{"order":1,"singerMid":singerId,"begin":0,"num":10},"module":"musichall.song_list_server"}}
// 	})
// 	return jsonp(url, data, option);
// }


export const getSongList = function(singerId) {
	const url = '/api/getSongList';

	let data = {"comm":{"ct":24,"cv":0},"singerSongList":{"method":"GetSingerSongList","param":{"order":1,"singerMid":singerId,"begin":0,"num":100},"module":"musichall.song_list_server"}}
	let str = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let count = Math.floor(Math.random() * 7 + 10);
    let sign = 'zza';
    for(let i = 0; i < count ; i++){
        sign += str[Math.floor(Math.random() * 36)];
    }
    sign += window.__sign_hash_20200305('CJBPACrRuNy7'+JSON.stringify(data));

	const datas = Object.assign({}, commonParams, {
		'-': "getSingerSong"+(Math.random()+"").replace("0.",""),
		sign: sign,
		loginUin: 0,
		hostUin: 0,
		platform: 'yqq.json',
		needNewCode: 0,
		data: data
	});
	return axios.get(url, {
		params: datas
	}).then(res => {
		return Promise.resolve(res.data.dataArr);
	}).catch(err => {
		console.log(err);
	});
}