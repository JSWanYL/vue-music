// 搜索页面相关数据抓取
import {commonParams,option} from 'api/config.js';
import jsonp from 'common/js/jsonp.js';
import axios from 'axios';

export function getHotKey() {
	let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

	let data = Object.assign({}, commonParams, {
		g_tk_new_20200303: 5381,
		g_tk: 5381,
		hostUin: 0,
		platform: 'yqq.json',
        needNewCode: 0
	})

	return jsonp(url, data, option);
}

export function getSearchQuery(query, page, zhida, perpage) {
	let url = '/api/getSearchQuery';

	let data = Object.assign({}, commonParams, {
		ct: 24,
		qqmusic_ver: 1298,
		new_json: 1,
		remoteplace: 'txt.yqq.song',
		searchid: 55209244853714990,
		t: 0,
		aggr: 1,
		cr: 1,
		catZhida: zhida?1:0,
		lossless: 0,
		flag_qc: 0,
		p: page,
		n: perpage,
		w: query,
		g_tk_new_20200303: 5381,
		g_tk: 5381,
		hostUin: 0,
		format: 'json',
		platform: 'yqq.json',
		needNewCode: 0
	})

	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data)
	})
}