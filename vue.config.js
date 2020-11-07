const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const axios = require('axios');


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
            referer: 'https://y.qq.com/',
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

      
      app.get('/api/getDecList',function(req,res) {    //获取推荐歌单数据
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
        const data = req.query;
        axios.get(url,{
          headers: {
            host: 'u.y.qq.com',
            referer: 'https://y.qq.com'
          },
          params: data
        }).then(response => {
          response = response.data;
          if (response.code !== 0) {
            res.json({
              code: 1,
              msg: '推荐歌单数据获取失败'
            })
          }
          const recomPlaylist = response.recomPlaylist.data.v_hot;
          res.json({
            code: 0,
            data: recomPlaylist
          })
        }).catch(err => {
          console.log(err);
        })
      });

      app.get('/api/getSingerList', function(req,res) {   //获取歌手列表数据
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';

        axios.get(url,{
          headers: {
            host: 'u.y.qq.com',
            referer: 'https://u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data;
          if (response.code !== 0) {
            res.json({
              code: 1,
              message: '歌手列表数据获取失败'
            });
          }
          const singerList = response.singerList.data.singerlist;  //歌手列表数组
          res.json({
            dataArr: singerList
          });
        }).catch(err => {
          res.json(err);
        });
      });


      app.get('/api/getSongList', function(req,res) {     //获取歌曲列表数据
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
        const data = req.query;

        axios.get(url, {
          headers: {
            host:'u.y.qq.com',
            referer: 'https://y.qq.com'
          },
          params: data
        }).then(response => {
          response = response.data;
          if (response.code !== 0) {
            res.json({
              msg: '歌曲列表数据获取失败'
            });
            return;
          }
          const songsList = response.singerSongList.data.songList;
          res.json({
            code: 0,
            dataArr: songsList
          })
        }).catch(err => {
          res.json({
            msg: '出错了',
            err: err
          });
        })
      });


      app.get('/api/getSongUrl', function(req,res) {     //获取歌曲播放url
        let url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
        axios.get(url, {
          headers: {
            host: 'u.y.qq.com',
            referer: 'https://u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data;
          if (response.code !== 0) {
            return res.json({
              msg: '歌曲播放url获取失败'
            });
          }
          res.json({
            dataJson: response
          });
        }).catch(err => {
          console.log(err);
        });
      });


      app.get('/api/getLyric', function(req, res) {   //获取歌词

        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
        axios.get(url, {
          headers: {
            host: 'u.y.qq.com',
            referer: 'https://u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data;
          if (response.code !== 0) {
            res.json({
              msg: '歌词获取失败',
              resCode: 1
            })
            return;
          }
          res.json({
            resCode: 0,
            dataLyric: response
          })
        }).catch(err => {
          console.log(err);
        })

      })

      app.get('/api/getSongDisc', function(req, res) {  //获取推荐歌单的歌曲列表
        let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data;
          if (response.code === 0) {
            res.json({
              code: 0,
              dataList: response.cdlist[0].songlist
            });
          }else {
            res.json({
              code: -1,
              msg: 'no songlist'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      });

      app.get('/api/getSearchQuery', function(req, res) {  //获取搜索接口的搜索数据
        let url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp';

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data;
          if (response.code === 0) {
            res.json(response)
          }else {
            res.json({
              code: 1,
              msg: '获取搜索数据失败'
            })
          }
        })
      });

  	}
  }
}