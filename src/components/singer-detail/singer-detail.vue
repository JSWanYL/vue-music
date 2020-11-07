<!-- 歌手详情页 -->
<template>
	<div class="singer-detail">
		<music-list :title="getStateSingers.name" :bg-image="bgImage" :songs="songs"></music-list>
	</div>

</template>



<script>
import { mapGetters } from 'vuex';
import { getSongList } from 'api/singer.js';
import { Song } from 'common/js/song.js';
import { processSongUrl } from 'common/js/song.js';
//导入music-list组件
import MusicList from 'components/music-list/music-list.vue';

export default {
	data() {
		return {
			songs: []
		}
	},
	computed: {
		...mapGetters({
			getStateSingers: 'getSingers'
		}),
		bgImage() {
			if (!this.getStateSingers.id) {
					return;
			}
			return `//y.gtimg.cn/music/photo_new/T001R300x300M000${this.getStateSingers.id}.jpg?max_age=2592000`;
		}
	},
	created() {
		this._getSongList();
		console.log(this.getStateSingers)
	},
	methods: {
		_getSongList() {
			if (!this.getStateSingers.id) {
					this.$router.go(-1)
					return;
			}
			getSongList(this.getStateSingers.id).then(res => {    //获取歌手的歌曲列表数据
				console.log(res);
				let filterSongs = this._filterVipSong(res);   //将歌曲列表中vip歌曲过滤掉
				var that = this;
				processSongUrl(filterSongs).then(addUrlSongs => {  //将歌曲列表添加url属性
					
					let lastSongsList = that._normalizeOriginSongList(addUrlSongs);  //将歌曲列表属性过滤成需要的属性
					this.songs = lastSongsList;
					console.log(this.songs);
				})
			
			}).catch(err => {
				console.log(err);
			})
		},
		_filterVipSong(list) {     //过滤掉歌曲列表中的VIP歌曲
			let filterSongs = [];
			list.forEach(item => {
				if (item.songInfo.pay.pay_play !== 1) {
					filterSongs.push(item);
				}
			});
			return filterSongs;
		},
		_normalizeOriginSongList(list) {     //格式化处理歌曲列表数据
			let songList = []; 
			let singerImgUrl = `//y.gtimg.cn/music/photo_new/T001R300x300M000${this.getStateSingers.id}.jpg?max_age=2592000`;

			list.forEach(item => {
				item = item.songInfo;
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




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.singer-detail
	position: fixed
	top: 0
	bottom: 0
	left: 0
	right: 0
	z-index: 50
	background-color: $color-background

</style>