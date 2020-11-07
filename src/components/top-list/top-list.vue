<!-- 榜单详情页面 -->
<template>
	<div class="toplist">
		<music-list :title="title" :bgImage="bgImage" :songs="songs" :isRank="isRank"></music-list>
	</div>
</template>



<script>
import MusicList from 'components/music-list/music-list.vue';
import {mapGetters} from 'vuex';
import {getMusicList} from 'api/rank.js';
import { Song } from 'common/js/song.js';
import { addSongUrl } from 'common/js/song.js';

export default {
	data() {
		return {
			songs: [],
			isRank: true
		}
	},
	computed: {
		...mapGetters([
			'toplist'
		]),
		title() {
			return this.toplist.topTitle;
		},
		bgImage() {
			return this.toplist.picUrl;
		}
	},
	created() {
		if (!this.toplist.id) {
			this.$router.go(-1)
		}
		this._getMusicList();
	},
	methods: {
		_getMusicList() {
			getMusicList(this.toplist.id).then(res => {
				let orignalArr = res.songlist;
				console.log(orignalArr)
				let filterArr = this._filterVipSong(orignalArr);
				console.log(filterArr)
				var that = this;
				addSongUrl(filterArr).then(addUrlSongs => {
					let lastSongsList = that._normalizeOriginSongList(addUrlSongs);
					this.songs = lastSongsList;
					console.log(this.songs)
				})
			})
		},
		_filterVipSong(list) {     //过滤掉歌曲列表中的VIP歌曲
			let filterSongs = [];
			list.forEach(item => {
				if (item.data.pay.pay_play !== 1) {
					filterSongs.push(item);
				}
			});
			return filterSongs;
		},
		_normalizeOriginSongList(list) {     //格式化处理歌曲列表数据
			let songList = []; 

			list.forEach(item => {

				let singerImgUrl = `//y.gtimg.cn/music/photo_new/T001R300x300M000${item.data.singer[0].mid}.jpg?max_age=2592000`;
				songList.push(new Song(item.data.songid, item.data.songmid, item.data.singer, item.data.songname, item.data.albumname, item.data.interval, singerImgUrl, item.url, item.data.albummid));
			});
			return songList;
		}
	},
	components: {
		MusicList
	}
}

</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.toplist
	position: fixed
	top: 0
	bottom: 0
	left: 0
	right: 0
	background-color: $color-background

</style>