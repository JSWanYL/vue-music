//获取排行榜页面相关数据
import {commonParams,option} from 'api/config.js';
import jsonp from 'common/js/jsonp.js';

export function getTopList() {
	let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

	const data = Object.assign({}, commonParams, {
		uin: 0,
		needNewCode: 1,
		platform: 'h5',
		format: 'jsonp'
	});

  	return jsonp(url, data, option);
}


export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5',
    format: 'json'
  })

  return jsonp(url, data, option)
}
