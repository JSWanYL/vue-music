<template>
	<div class="rank" ref="rank">
		<scroll class="toplist-cntainer" :data="topList" ref="topListWrapper">
			<ul class="toplist">
				<li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
					<div class="img-wrapper">
						<img :src="item.picUrl" alt="">
					</div>
					<ul class="song-wrapper">
						<li class="songs" v-for="(song,index) in item.songList" :key="song.songname">{{ `${index+1} ${song.songname}-${song.singername}` }}</li>
					</ul>
				</li>
			</ul>
			<loading v-show="!topList.length"></loading>
		</scroll>
		<router-view></router-view>
	</div>

</template>



<script>
import {getTopList} from 'api/rank.js';
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import {playListMixin} from 'common/js/mixin.js';
import {mapMutations} from 'vuex';

export default {
	mixins: [playListMixin],
	data() {
		return {
			topList: []
		}
	},
	created() {
		this._getTopList();
	},
	methods: {
		_getTopList() {
			getTopList().then(res => {
				this.topList = res.data.topList;
				console.log(this.topList);
			})
		},
		handlePlaylist(playlist) {
			let bottom = playlist.length > 0? '60px':'';
			this.$refs.rank.style.bottom = bottom;
			this.$refs.topListWrapper.refresh();
		},
		selectItem(item) {
			this.$router.push(`/rank/${item.id}`);
			this.setTopList(item);
		},
		...mapMutations({
			setTopList: 'SET_TOPLIST'
		})
	},
	components: {
		Scroll,
		Loading
	}
}

</script>




<style scoped lang="stylus">
@import '~common/stylus/variable.styl'

.rank
	position: fixed
	top: 88px
	bottom: 0
	left: 0
	right: 0
	background-color: $color-background
	overflow: hidden
	.toplist-cntainer
		width: 100%
		height: 100%
		.toplist
			width: 100%
			.item
				display: flex
				height: 100px
				margin: 0 20px
				padding-top: 20px
				.img-wrapper
					img
						display: inline-block
						height: 100px
						width: 100px
				.song-wrapper
					flex: 1
					background-color: $color-highlight-background
					padding: 0 20px
					display: flex
					flex-direction: column
					justify-content: space-evenly
					overflow: hidden
					.songs
						color: $color-text-d
						font-size: $font-size-small
						overflow: hidden
						text-overflow: ellipsis
						white-space: nowrap
						
</style>