<!-- music-list业务组件 -->
<template>
	<div class="music-list">
		<div class="header">
				<div class="back">
					<span @click="_goBackPage" class="icon-back"></span>
				</div>
				<h1 class="title">{{ title }}</h1>
		</div>
		<div class="bg-img" :style="bgStyle" ref='bgImage'>
			<div class="mask" ref="mask"></div>
			<div class="play-wrap" v-if="isPlayButtonShow">
				<div class="play" @click="randomPlayAll">
					<span class="icon-play"></span>
					<span class="con">随机播放全部</span>
				</div>
			</div>
		</div>
		<div class="bg-layer" ref="bgLayer"></div>
		<!-- 添加loading组件 -->
		<div class="loading-wrap" v-if="!songs.length">
			<loading></loading>
		</div>
		<scroll :probeType="this.probeType" :isScroll="this.isScroll" :click="this.click" :data="songs" class="list" @scroll="scroll" ref="scrollList">
			<div class="songlist-wrap">
				<song-list :songs="songs" @select='selectItem' :isRank="isRank"></song-list>
			</div>
		</scroll>
	</div>

</template>





<script>
import SongList from 'base/song-list/song-list.vue';
import Scroll from 'base/scroll/scroll.vue';
import { profixStyle } from 'common/js/dom.js';
import Loading from 'base/loading/loading.vue';
import {mapActions, mapGetters} from 'vuex';
import {playListMixin} from 'common/js/mixin.js';

const TOPHEIGHT = 40;
const transform = profixStyle('transform');
const backdrop = profixStyle('backdrop-filter');

export default {
	mixins: [playListMixin],
	data() {
		return {
			scrollY: -1,
			isPlayButtonShow: true
		}
	},
	created() {
		this.probeType = 3;
		this.isScroll = true;
		this.click = true;
		
	},
	mounted() {
		this.bgImageHeight = this.$refs.bgImage.clientWidth * 0.7;
		this.bglayerScrollY = this.bgImageHeight - TOPHEIGHT;
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		bgImage: {
			type: String,
			default: ''
		},
		songs: {
			type: Array,
			default: []
		},
		isRank: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		bgStyle() {
			return `background-image:url(${this.bgImage})`
		},
		...mapGetters([
			'playMode',
			'currentSong'
		])
	},
	methods: {
		handlePlaylist(playlist) {
			let bottom = playlist.length ? '60px' : '';
			this.$refs.scrollList.$el.style.bottom = bottom;
			this.$refs.scrollList.refresh();
		},
		scroll(pos) {   //监听scroll组件派发的scroll事件
			this.scrollY = -pos.y
			// console.log(scrollY);
		},
		_goBackPage() {
			this.$router.go(-1);
		},
		selectItem(item, index) { //song-list组件派发的点击事件，进入播放器
			//通过actions改变state中多个状态
			this.initPlayer({
				list: this.songs,
				index: index,
				mode: this.playMode
			})
		},
		randomPlayAll() {  //点击随机播放全部按钮
			this.initRandomPlay({
				list: this.songs,
				index: 0
			})
		},
		...mapActions([
			'initPlayer',
			'initRandomPlay'
		])
	},
	watch: {
		scrollY(newY) {
			console.log(newY)
			if (newY > 0) {
				let translateY = Math.min(this.bglayerScrollY, newY);
				let blur = 0;
				blur = Math.min(20, 20 * (newY / this.bgImageHeight));

				if (newY > this.bglayerScrollY) {  //滚动到最大距离之后，让图片压住文字
					this.$refs.bgImage.style.height = 40 + 'px';
					this.$refs.bgImage.style.paddingTop = 0;
					this.$refs.bgImage.style.zIndex = 10;
					this.isPlayButtonShow = false;
				}else {
					this.$refs.bgImage.style.height = 0 + 'px';
					this.$refs.bgImage.style.paddingTop = '70%';
					this.$refs.bgImage.style.zIndex = 0;
					this.isPlayButtonShow = true;
				}
				this.$refs.bgLayer.style[transform] = `translate3d(0,${-translateY}px,0)`;
				this.$refs.mask.style[backdrop] = `blur(${blur}px)`;
			}

			if (newY < 0) {   //向下拉动时，背景图放大
				let scaleTimes = 1;
				let distance = -newY;
				scaleTimes = (distance + this.bgImageHeight) / this.bgImageHeight;
				this.$refs.bgImage.style.transform = `scale(${scaleTimes})`
				this.$refs.bgLayer.style.transform = `translate3d(0,${distance}px,0)`;
			}
		}
	},
	components: {
		SongList,
		Scroll,
		Loading
	}
}


</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.music-list
	position: fixed
	top: 0
	bottom: 0
	left: 0
	right: 0
	.header
		position: absolute
		top: 0
		left: 0
		height: 40px
		width: 100%
		z-index: 40
		
		.back
			width: 10%
			padding: 10px 0px
			color: $color-theme
			text-align: center
			span
				font-size: 20px
		.title
			position: absolute
			top: 0
			left: 15%
			width: 75%
			font-size: 18px
			color: $color-text
			text-align: center
			line-height: 40px
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
	.bg-img
		position: relative
		width: 100%
		height: 0
		padding-top: 70%
		transform-origin: top
		background-size: cover
		.mask
			position: absolute
			top: 0
			bottom: 0
			left: 0
			right: 0
			background-color: rgba(7, 17, 27, .4)
		.play-wrap
			position: absolute
			bottom: 20px
			right: 0
			left: 0
			.play
				height: 32px
				width: 135px
				margin: 0 auto
				border: 1px solid $color-theme
				border-radius: 100px
				text-align: center
				line-height: 32px
				color: $color-theme
				.icon-play
					font-size: 16px
					vertical-align: middle
					margin-right: 5px
				.con
					font-size: 12px
					vertical-align: middle
	.list
		position: absolute
		top: 70vw
		bottom: 0
		width: 100%
	.bg-layer
		position: absolute
		top: 70vw
		bottom: 0
		width: 100%
		background-color: $color-background
	.loading-wrap
		position: absolute
		top: calc(70vw + 40px)
		left: 0
		right: 0
</style>