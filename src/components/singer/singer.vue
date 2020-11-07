<template>
	<div class="singer-view" ref="singerView">
		<listview :dataArr="singerListData" :shortCutArr="shortCutListData" @select="goToDetailPage" ref="listView"></listview>
		<!-- 歌手详情页面 -->
		<transition name='detail'>
			<router-view></router-view>
		</transition>
	</div>


</template>



<script>
import { getSingerList } from 'api/singer.js';
import { addObj } from 'common/js/singer.js';
import Listview from 'base/listview/listview.vue';
import { mapMutations } from 'vuex';
//导入文字转拼音库
import cnchar from 'cnchar';
const HOT_TITLE = '热门';
import {playListMixin} from 'common/js/mixin.js';

export default {
	mixins: [playListMixin],
	data() {
		return {
			singerListData: []
		}
	},
	created() {

	},
	mounted() {
		setTimeout(() => {
			this._getSingerList();
		}, 20)
	},
	computed: {
		shortCutListData() {         //将数据转换为侧边列需要的数据格式
			let shortCutList = [];
			this.singerListData.forEach(item => {
				shortCutList.push(item.title[0].toUpperCase());
			});
			return shortCutList;
		}
	},
	methods: {
		handlePlaylist(playlist) {
			let bottom = playlist.length > 0 ? '60px' : '';
			this.$refs.singerView.style.bottom = bottom;
			this.$refs.listView.refresh();
		},
		_getSingerList() {
			getSingerList().then(res => {
				console.log(res)
				let singerList = this._getNameFirstLetter(res);
				this.singerListData = this._handleSingerList(singerList);
				console.log(this._handleSingerList(singerList));
			})
		},
		_getNameFirstLetter(list) {      //将获取到的数据添加首字母的属性
			list.forEach(item => {
				item.firstLetter = item.singer_name.spell('first', 'low')[0].toLowerCase();
			});
			return list;
		},
		_handleSingerList(list) {        //将获取到的数据处理成指定格式
			let hotArr = [];
			let hotObj = {};
			hotObj.title = HOT_TITLE;
			hotObj.content = [];
					 
			list.forEach((item, i) => {
				if (i < 10) {
					let obj = addObj(item.singer_mid, item.singer_name, item.singer_pic);
					hotObj.content.push(obj);
				}
			})
			hotArr.push(hotObj);
			
			let letterObj = {};
			list.forEach(item => {
				if (letterObj[item.firstLetter]) {
					let obj = addObj(item.singer_mid, item.singer_name, item.singer_pic);
					letterObj[item.firstLetter].push(obj);
				}else{
					letterObj[item.firstLetter] = [];
					let obj = addObj(item.singer_mid, item.singer_name, item.singer_pic);
					letterObj[item.firstLetter].push(obj);
				}
			});

			let letterArr = [];
			for(let key in letterObj) {
				let obj = {};
				obj.title = key;
				obj.content = letterObj[key];
				letterArr.push(obj);
			}
			letterArr.sort((val1, val2) => {
				return val1.title.localeCompare(val2.title);
			});
			
			let singerListArr = hotArr.concat(letterArr);
			return singerListArr;
		},
		goToDetailPage(item) {
			this.$router.push(`/singer/${item.id}`);    //跳转路由
			this.setSingers(item);                      //设置state中共享数据
		},
		...mapMutations({
			setSingers: 'SET_SINGERS'
		})
	},
	components: {
		Listview
	}
}


</script>




<style scoped lang="stylus">
@import '~common/stylus/variable.styl';

.singer-view
	position: fixed
	top: 88px
	bottom: 0
	left: 0
	right: 0
	background-color: #fff
	overflow: hidden
.detail-enter,
.detail-leave-to
	opacity: 0
	transform: translateX(100%)
.detail-enter-active,
.detail-leave-active
	transition: all 0.3s

</style>