const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const axios = require('axios');
const ERR_OK = require('./src/api/config.js');

module.exports = {
 chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
  },
  devServer: {          //通过devServer建立的服务端向qq服务端接口发送请求(axios),不存在跨域且可以设置host和refer
  	before (app) {      //而后前端通过axios对devServer服务端发送请求
  		app.get('/api/getBannerTop',function(req,res) {
  			const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
  			const jumpPrefix = 'https://y.qq.com/n/yqq/album/';

  			axios.get(url,{
  				headers: {
            referer: 'https://u.y.qq.com/',
  					host: 'u.y.qq.com'
  				},
  				params: req.query
  			}).then((response) => {
  				response = response.data;
  				if (response.code === 0) {
  					let bannerDataArr = response.focus.data.shelf.v_niche[0].v_card;
  					let slider = [];
  					for (let i = 0; i < bannerDataArr.length; i++) {
  						let sliderItem = {};
  						sliderItem.id = bannerDataArr[i].id;
  						sliderItem.imgUrl = bannerDataArr[i].cover;
  						sliderItem.imgLink = `${jumpPrefix}${bannerDataArr[i].subid}.html`;
  						slider.push(sliderItem);
  					}
  					res.json({
  						code: 0,
  						data: {
  							slider
  						}
  					});
  				}else {
  					res.json({
              code: 1,
              msg: 'fail',
              data: {
                response
              }
            });
  				}
  			}).catch(err => {
  				console.log(err);
  			});
  		});
  	}
  }
}