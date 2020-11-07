//封装添加歌曲属性的类
import { getSongUrl } from 'api/song.js';
import {getSongLyric} from 'api/song.js';
import {Base64} from 'js-base64';
import {encode, decode} from 'js-base64';



export class Song {
	constructor(id, mid, singer, name, album, duration, imgUrl, url, albumMid) {
		this.id = id;
		this.mid = mid;
		this.singer = handleSingerArr(singer);
		this.name = name;
		this.album = album;
		this.duration = duration;
		this.imgUrl = imgUrl;
		this.url = url;
		this.albumImg = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg?max_age=2592000`;
	}
	getLyric(){
		//若歌词已经存在，不用重新获取，直接返回歌词
		if (this.lyric) {
			return Promise.resolve(this.lyric);
		}
		return new Promise((resolve, reject) => {
			getSongLyric(this.mid).then(res => {
				if (res.resCode === 0) {
					this.lyric = Base64.decode(res.dataLyric.lyric);
					resolve(this.lyric);
				}else {
					reject('no lyric');
				}
			});
		});
	}
}




//封装处理歌手数组的函数
function handleSingerArr(singerArr) {
	let compose = [];
	singerArr.forEach(item => {
		compose.push(item.name);
	});
	return compose.join('/');
}


//封装处理歌曲数组函数，为歌曲数组添加url属性
export function processSongUrl(filterSongs) {
	if (!filterSongs.length) {
		return;
	}
	return getSongUrl(filterSongs).then((purlObj) => {
		filterSongs.filter((item) => {
			if(!item.songInfo) {
				item.songInfo = item;
			}
			let purl = purlObj[item.songInfo.mid];
			if (purl) {
				item.songInfo.url = purl.indexOf('http') === -1? `http://ws.stream.qqmusic.qq.com/${purl}`: purl;
				return true;
			}
			return false;
		});
		return filterSongs;
	});
}

export function addSongUrl(filterSongs) {
	if (!filterSongs.length) {
		return;
	}
	return getSongUrl(filterSongs).then((purlObj) => {
		filterSongs.filter((item) => {

			let purl = purlObj[item.data.songmid];
			if (purl) {
				item.url = purl.indexOf('http') === -1? `http://ws.stream.qqmusic.qq.com/${purl}`: purl;
				return true;
			}
			return false;
		});
		return filterSongs;
	});
}