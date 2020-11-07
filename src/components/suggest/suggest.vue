<!-- 搜索页面---搜索结果列表组件 -->
<template>
	<scroll class="suggest" :pullUpdate="true" @scrollToEnd="searchMore" ref="suggest">
		<ul>
			<li v-for="item in resQueryArr" @click="selectItem(item)" :key="item.id">
				<div class="icon">
					<i :class="iconSelect(item)"></i>
				</div>
				<div class="name">{{ nameSelect(item)}}</div>
			</li>
			<loading :text="''" v-show="hasMore"></loading>
		</ul>
	</scroll>

</template>



<script>
import Scroll from 'base/scroll/scroll.vue';
import {getSearchQuery} from 'api/search.js';
import {addObj} from 'common/js/singer.js';
import {Song} from 'common/js/song.js';
import Loading from 'base/loading/loading.vue';
import {mapMutations, mapActions} from 'vuex';
import {processSongUrl} from 'common/js/song.js';
import {playListMixin} from 'common/js/mixin.js';

export default {
	mixins: [playListMixin],
	data() {
		return {
			query: '',
			page: 1,
			zhida: true,
			perpage: 20,
			resQueryArr: [],
			hasMore: true,
			showList: []
		}
	},
	methods: {
		handlePlaylist(playlist) {
			let bottom = playlist.length? '60px':'';
			this.$refs.suggest.$el.style.bottom = bottom;
			this.$refs.suggest.refresh();
		},
		search(query) {   //获取搜索结果数据
			this.hasMore = true;
			this.page = 1;
			this.$refs.suggest.scrollTo(0, 0);
			getSearchQuery(query, this.page, this.zhida, this.perpage).then(res => {
				if (res.code === 0) {
					//console.log(res.data)
					this._checkMore(res.data);
					let dealArr = this._dealCatchQuery(res.data);
					console.log(dealArr)
					this._nextDealCatchQuery(dealArr).then(result => {
						this.resQueryArr = result
					})
					//console.log(this.resQueryArr)
					console.log(this.resQueryArr)
				}
				
			})
		},
		searchMore() {  //获取下一页搜索结果数据
			if (!this.hasMore) {
				return;
			}
			this.page++;
			getSearchQuery(this.query, this.page, this.zhida, this.perpage).then(res => {
				if (res.code === 0) {
					this._checkMore(res.data);
					let dealArr = this._checkMoreFirstDeal(res.data);
					this._nextDealCatchQuery(dealArr).then(result => {
						this.resQueryArr = this.resQueryArr.concat(result);
					})
					// let nextDealArr = this._nextDealCatchQuery(dealArr);
					// this.resQueryArr = this.resQueryArr.concat(nextDealArr);
				}
			})
		},
		showQueryArr(query) {
			this.query = query;
		},
		iconSelect(item) {
			if (item.s_type === 'singer') {
				return 'icon-mine';
			}else {
				return 'icon-music';
			}
		},
		nameSelect(item) {
			if (item.s_type === 'singer') {
				return item.name;
			}else {
				return `${item.name}-${item.singer}`;
			}
		},
		selectItem(item) {
			if (item.s_type === 'singer') {  //点击的是歌手信息，展示歌手列表
				let singer = {
					id: item.id,
					name: item.name
				}
				this.$router.push(`/search/${singer.id}`);
				this.setSinger(singer);
			}else {       //点击的是歌曲信息，追加点击歌曲到当前列表
				console.log(item)
				let canPlayStr = /^http.*wma$/;
				if (canPlayStr.test(item.url)) {
					alert('此为vip付费歌曲，当前不能播放')
				}else {
					this.insertSong(item);
				}	
			}
			this.$emit('select'); //被点击时，向外派发事件
		},
		scrollToEnd() {
			this.$emit('scrollToEnd');
		},
		_dealCatchQuery(data) {  //对抓取的数据进行第一次处理
			let res = [];
			if (data.zhida && data.zhida.type === 1) {
				data.zhida.zhida_singer.s_type = 'singer'
				res.push(data.zhida.zhida_singer);
			}
			data.song.list.forEach(item => {
				item.s_type = 'song'
				res.push(item)
			});
			return res;
		},
		_checkMoreFirstDeal(data) {
			let res = [];
			data.song.list.forEach(item => {
				item.s_type = 'song'
				res.push(item)
			});
			return res;
		},
		_nextDealCatchQuery(data) {  //对抓取的数据进行第二次处理
			let res = [];
			console.log('执行了');
			if (data[0].s_type === 'singer') {
				console.log('是歌手')
				let item = data[0];
				let obj = addObj(item.singerMID, item.singerName, item.singerPic);
				obj.s_type = 'singer';
				res.push(obj);
				data.shift(); //删除列表头部的歌手信息的item
			}
			var that = this;
			return processSongUrl(data).then(addUrlArr => {
				let lastSongArr = that._normalizeOriginSongList(addUrlArr);
				res = res.concat(lastSongArr);
				console.log(res);
				return res;
			})
		},
		_filterVipSong(list) {     //过滤掉歌曲列表中的VIP歌曲
			let filterSongs = [];
			list.forEach(item => {
				if (item.pay.pay_play !== 1) {
					filterSongs.push(item);
				}
			});
			return filterSongs;
		},
		_normalizeOriginSongList(list) {     //格式化处理歌曲列表数据
			let songList = []; 

			list.forEach(item => {
				item = item.songInfo;
				songList.push(new Song(item.id, item.mid, item.singer, item.name, item.album.name, item.interval, null, item.url, item.album.mid));
			});
			return songList;
		},
		_checkMore(data) {
			const song = data.song
	        if (!song.list.length || (song.curnum + (song.curpage - 1) * this.perpage) >= song.totalnum) {
	          this.hasMore = false
	        }
		},
		...mapMutations({
			setSinger: 'SET_SINGERS'
		}),
		...mapActions({
			insertSong: 'insertSong'
		})
	},
	components: {
		Scroll,
		Loading
	},
	watch: {
		query(newVal) {
			console.log('newVal',!newVal === true)
			if (!newVal) {
				this.hasMore = false;
				this.resQueryArr = [];

				return;
			}else {
				this.search(newVal);
			}
			
		},
		resQueryArr() {
			this.$nextTick(() => {
				this.$refs.suggest.refresh();
			})
		}
	}
}


</script>



<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.suggest
	height: 100%
	overflow: hidden
	ul
		padding: 0 30px
		li
			display: flex
			align-items: center
			padding-bottom: 20px
			overflow: hidden
			.icon
				width: 30px
				i 
					font-size: 14px
					color: $color-text-d
			.name
				flex: 1
				font-size: 14px
				color: $color-text-d
				overflow: hidden
				white-space: nowrap
				text-overflow: ellipsis
</style>