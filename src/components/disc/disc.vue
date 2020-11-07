<!-- 歌单详情页面 -->
<template>
	<div class="disc">
		<music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</div>

</template>



<script>
import MusicList from 'components/music-list/music-list.vue';
import {mapGetters} from 'vuex';
import {getSongList} from 'api/recommend.js';
import {processSongUrl} from 'common/js/song.js';
import {Song} from 'common/js/song.js';
 
export default {
	data() {
		return {
			songs: []
		}
	},
	computed: {
		...mapGetters([
			'disc'
		]),
		title() {
			return this.disc.title;
		},
		bgImage() {
			return this.disc.cover;
		}
	},
	created() {
		this._getSongList();
	},
	methods: {
		_getSongList() {
			if (!this.disc.content_id) {
				this.$router.go(-1)
			}
			getSongList(this.disc.content_id).then(res => {
				if (res.code === 0) {

					let filterSongs = this._filterVipSong(res.dataList);

					let that = this;
					processSongUrl(filterSongs).then(addedUrlSongs => {
						let finalSongs = that._normalizeOriginSongList(addedUrlSongs);
						this.songs = finalSongs;
						console.log(this.songs)
					})
				}
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
			//let singerImgUrl = `//y.gtimg.cn/music/photo_new/T001R300x300M000${this.getStateSingers.id}.jpg?max_age=2592000`;

			list.forEach(item => {
				//item = item.songInfo;
				let singerImgUrl = `//y.gtimg.cn/music/photo_new/T001R300x300M000${item.singer[0].mid}.jpg?max_age=2592000`;
				songList.push(new Song(item.id, item.mid, item.singer, item.name, item.album.name, item.interval, singerImgUrl, item.url, item.album.mid));
			});
			return songList;
		}
	},
	components: {
		MusicList
	}
}


</script>



<style scoped lang="stylus">
@import '~common/stylus/variable.styl'

.disc
	position: fixed
	top: 0
	bottom: 0
	left: 0
	right: 0
	background-color: $color-background
	z-index: 9999
</style>