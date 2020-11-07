//获取推荐页面数据（轮播图、推荐歌单）
//import jsonp from 'common/js/jsonp.js';
import {commonParams} from './config.js'
import axios from 'axios';


export function getRecommend() {     //获取轮播图页面数据
	const url = '/api/getBannerTop';
	const data = Object.assign({},commonParams,{  //配置qq音乐接口所需的參數
		hostUin: 0,
		// sign: 'zzanwkjoq6uavzc1xxff15c4441255ee9ef959d8dacccc3f88',
		sign: 'zza38ym9429cep77ff15c4441255ee9ef959d8dacccc3f88',
		platform: 'yqq.json',
		needNewCode: 0,
		inCharset: 'utf8',
		format: 'json',
		'-': "recom"+(Math.random()+"").replace("0.",""),
		data: {"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"newsong.NewSongServer","method":"get_new_song_info","param":{"type":5}},"new_album":{"module":"newalbum.NewAlbumServer","method":"get_new_album_info","param":{"area":1,"sin":0,"num":20}},"new_album_tag":{"module":"newalbum.NewAlbumServer","method":"get_new_album_area","param":{}},"toplist":{"module":"musicToplist.ToplistInfoServer","method":"GetAll","param":{}},"focus":{"module":"music.musicHall.MusicHallPlatform","method":"GetFocus","param":{}}}
	});
	return axios.get(url, {
		params: data
	}).then(res => {
		return res.data;
	})
}

export function getDecList() {     //获取推荐歌单数据
	const url = '/api/getDecList';
	const data = Object.assign({},commonParams,{
		hostUin: 0,
		// sign: 'zzanwkjoq6uavzc1xxff15c4441255ee9ef959d8dacccc3f88',
		sign: 'zza38ym9429cep77ff15c4441255ee9ef959d8dacccc3f88',
		platform: 'yqq.json',
		needNewCode: 0,
		inCharset: 'utf8',
		format: 'json',
		'-': "recom"+(Math.random()+"").replace("0.",""),
		data: {"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"newsong.NewSongServer","method":"get_new_song_info","param":{"type":5}},"new_album":{"module":"newalbum.NewAlbumServer","method":"get_new_album_info","param":{"area":1,"sin":0,"num":20}},"new_album_tag":{"module":"newalbum.NewAlbumServer","method":"get_new_album_area","param":{}},"toplist":{"module":"musicToplist.ToplistInfoServer","method":"GetAll","param":{}},"focus":{"module":"music.musicHall.MusicHallPlatform","method":"GetFocus","param":{}}}
	});

	return axios.get(url,{
		params: data
	}).then(res => {
		return res.data;
	})
}


export function getSongList(disstid) {   //获取推荐歌单的歌曲列表
	const url = '/api/getSongDisc';
	const data = Object.assign({}, commonParams, {
		utf8: 1,
		type: 1,
		json: 1,
		onlysong: 0,
		new_format: 1,
		disstid,
		g_tk_new_20200303: 5381,
		g_tk: 5381,
		hostUin: 0,
		platform: 'yqq.json',
		needNewCode: 0,
		loginUin: 592150292
	});

	return axios.get(url,{
		params: data
	}).then(res => {
		return res.data;
	})

}