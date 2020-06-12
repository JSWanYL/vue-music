//获取推荐页面数据（轮播图、推荐歌单）
//import jsonp from 'common/js/jsonp.js';
import {commonParams} from './config.js'
import axios from 'axios';


export function getRecommend() {     //获取轮播图页面数据
	const url = '/api/getBannerTop';
	const data = Object.assign({},commonParams,{  //配置qq音乐接口所需的參數
		hostUin: 0,
		platform: 'yqq.json',
		needNewCode: 0,
		inCharset: 'utf8',
		format: 'json',
		'-': "recom"+(Math.random()+"").replace("0.",""),
		data: {
	      'comm': { 'ct': 24 },
	      'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
	      'recomPlaylist': {
	        'method': 'get_hot_recommend',
	        'param': { 'async': 1, 'cmd': 2 },
	        'module': 'playlist.HotRecommendServer'
	      },
	      'playlist': {
	        'method': 'get_playlist_by_category',
	        'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
	        'module': 'playlist.PlayListPlazaServer'
	      },
	      'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
	      'new_album': {
	        'module': 'newalbum.NewAlbumServer',
	        'method': 'get_new_album_info',
	        'param': { 'area': 1, 'sin': 0, 'num': 10 }
	      },
	      'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
	      'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
	      'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} }
	    }
	});
	return axios.get(url, {
		params: data
	}).then(res => {
		return res.data;
	})
}