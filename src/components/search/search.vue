<!-- 搜索页面组件 -->
<template>
	<div class="search">
		<div class="searchBox-wrapper">
			<search-box ref="searchBox" :placeholder="'搜索歌曲、歌手'" @updateQuery="getQuery"></search-box>
		</div>
		<scroll class="shortcut-wrapper" v-show="!query.length" :data="readyToScroll" ref="scrollWrapper">
			<div>
				<div class="hot-key">
					<h1>热门搜索</h1>
					<ul>
						<li v-for="item in hotkey" @click="addQuery(item.k)">{{ item.k }}</li>
					</ul>
				</div>
				<div class="history" v-show="searchHistory.length">
					<div class="title">
						<p class="title-text">搜索历史</p>
						<span class="clear" @click="selectConfirm">
							<i class="icon-clear"></i>
						</span>
					</div>
					<search-list :searchArr="searchHistory" @select="addQuery" @selectDelete="deleteOne"></search-list>
				</div>
			</div>
		</scroll>
		<div class="search-result" v-show="query.length">
			<suggest ref="suggest" @select="saveSearchHistory"></suggest>
		</div>
		<confirm :title="'是否清空所有搜索历史'" ref="confirm" @defineSelect="clearAll"></confirm>
		<router-view></router-view>
	</div>

</template>



<script>
import SearchBox from 'base/search-box/search-box.vue';
import {getHotKey} from 'api/search.js';
import Suggest from 'components/suggest/suggest.vue';
import {mapGetters} from 'vuex';
import SearchList from 'base/search-list/search-list.vue';
import Confirm from 'base/confirm/confirm.vue';
import Scroll from 'base/scroll/scroll.vue';
import {playListMixin,searchMixin} from 'common/js/mixin.js';

export default {
	mixins: [playListMixin,searchMixin],
	data() {
		return {
			hotkey: []
		}
	},
	created() {
		this._getHotKey();
	},
	computed: {
		...mapGetters([
			'searchHistory'
		]),
		readyToScroll() {
			return this.searchHistory.concat(this.hotkey);
		}
	},
	methods: {
		handlePlaylist(playlist) {
			let bottom = playlist.length? '60px':'';
			this.$refs.scrollWrapper.$el.style.bottom = bottom;
			this.$refs.scrollWrapper.refresh();
		},
		addQuery(query) {  //将搜索结果添加到input中
			console.log(query)
			this.$refs.searchBox.addHotKeyToQuery(query)
		},
		deleteOne(item) {  //点击×，删除单个数据
			this.deleteHistory(item);
		},
		selectConfirm() {  //点击垃圾桶，弹出确认对话框
			this.$refs.confirm.show();
		},
		clearAll() {
			this.clearHistory();
		},
		_getHotKey() {   //获取热门搜索次
			getHotKey().then(res => {
				this.hotkey = res.data.hotkey.slice(0,10)
				console.log(this.hotkey)
			})
		}
	},
	components: {
		SearchBox,
		Suggest,
		SearchList,
		Confirm,
		Scroll
	},
	watch: {
		query() {
			setTimeout(() => {
				this.$refs.scrollWrapper.refresh()
			}, 200);
		}
	}
}


</script>




<style scoped lang="stylus">
@import '~common/stylus/variable.styl'

.search
	position: fixed
	top: 88px
	bottom: 0
	left: 0
	right: 0
	.searchBox-wrapper
		width: 100%
		margin: 20px 0
	.shortcut-wrapper
		position: fixed
		top: 178px
		bottom: 0
		left: 0
		right: 0
		overflow: hidden
		.hot-key
			margin: 0 20px
			h1
				color: $color-text-l
				font-size: 14px
				margin-bottom: 20px
			ul
				li
					display: inline-block
					border-radius: 6px
					background-color: $color-highlight-background
					font-size: 14px
					color: $color-text-d
					margin: 0 20px 10px 0
					padding: 5px 10px
		.history
			margin: 30px 20px 10px 20px
			.title
				display: flex
				justify-content: space-between
				font-size: 14px
				.title-text
					color: $color-text-l
				.clear
					color: $color-text-d
	.search-result
		position: fixed
		top: 178px
		bottom: 0
		right: 0
		left: 0
</style>