//获取歌曲播放url

import { commonParams } from 'api/config.js';
import axios from 'axios';
import './test.js';
import { _getGuid } from 'common/js/guid.js';




export function getSongUrl(songs) {
	let url = '/api/getSongUrl';

	//创建songmid和songtype参数
	let songmid = [];
	let songtype = [];

	songs.forEach(item => {
		if(item.data) {
			songmid.push(item.data.songmid);
		}else if(!item.songInfo && !item.data) {
			songmid.push(item.mid);
		}else {
			songmid.push(item.songInfo.mid);
		}


		
		songtype.push(0);
	});

	//获取guid
	let guid = '' + _getGuid();

	//获取data字段
	let dataPara = {
		"req":{
			"module":"CDN.SrfCdnDispatchServer",
			"method":"GetCdnDispatch",
			"param":{"guid":guid,"calltype":0,"userip":""}
		},
		"req_0":{
			"module":"vkey.GetVkeyServer",
			"method":"CgiGetVkey",
			"param":{"guid":guid,"songmid":songmid,"songtype":songtype,"uin":"0","loginflag":1,"platform":"20"}
		},
		"comm":{"uin":0,"format":"json","ct":24,"cv":0}
	}

	//获取sign参数
	let str = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let count = Math.floor(Math.random() * 7 + 10);
    let sign = 'zza';
    for(let i = 0; i < count ; i++){
        sign += str[Math.floor(Math.random() * 36)];
    }
    sign += window.__sign_hash_20200305('CJBPACrRuNy7'+JSON.stringify(dataPara));

    //获取播放url所需全部参数
	let data = Object.assign({}, commonParams, {
		'-': "getplaysongvkey"+(Math.random()+"").replace("0.",""),

		sign: sign,
		loginUin: 0,
		hostUin: 0,
		platform: 'yqq.json',
		needNewCode: 0,
		data: dataPara
	});

	return new Promise((resolve, reject) => {
		let tryTime = 3;
		function request() {
			return axios.get(url, {
				params: data
			}).then(res => {
				res = res.data.dataJson;
				if (res.req_0.code === 0 && res.req_0.data.midurlinfo) {
					let songsUrlList = res.req_0.data.midurlinfo;
					const purlObj = {};
					songsUrlList.forEach(item => {
						if (item.purl) {
							purlObj[item.songmid] = item.purl;
						}
					});
					resolve(purlObj);
				}else {
					//重复尝试获取3次
					retry();
				}
			}).catch(err => {
				console.log(err);
			});
		}
		function retry() {
			if (--tryTime < 0) {
				request();
			}
		}

		request();
	});

}


export function getSongLyric(mid) {
	let url = '/api/getLyric';

	let data = Object.assign({}, commonParams, {
		'-': 'MusicJsonCallback_lrc',
		pcachetime: new Date(),
		songmid: mid,
		hostUin: 0,
		platform: 'yqq.json',
		needNewCode: 0
	})

	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data);
	}).catch(err => {
		console.log(err)
	})
}


