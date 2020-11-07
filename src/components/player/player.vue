<!-- 播放器页面 -->
<template>
	<div class="player" v-show='playlist.length'>
		<!-- 全屏播放器 -->
		<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img :src="currentSong.albumImg" alt="">
				</div>
				<!-- 顶部 -->
				<div class="top" ref="top">
					<div class="back" @click="goToMiniPlayer">
						<i class="icon-back"></i>
					</div>
					<h1 class="song-name">{{ currentSong.name }}</h1>
					<h2 class="singer-name">{{ currentSong.singer }}</h2>
				</div>
				<!-- 中部 -->
				<div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" ref="imageWrapper">
								<img :class="rotatePlay" class="image" :src="currentSong.albumImg" ref="image">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{ currentPlayingLyric }}</div>
						</div>
					</div>
					<scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref='scrollLyric'>
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p ref="lyricItem" class="text" :class="{current: index === currentLineNum}" v-for="(item, index) in currentLyric.lines" :key="item.time">{{ item.txt }}</p>
							</div>
						</div>
					</scroll>
				</div>
				<!-- 底部 -->
				<div class="bottom">
					<div class="dot-wrapper">
						<span :class="{active: currentDotShow === 'cd'}"></span>
						<span :class="{active: currentDotShow === 'lyric'}"></span>
					</div>
					<!-- 歌曲播放进度条 -->
					<div class="progress-wrapper">
						<span class="time time-l">{{ currentTime }}</span>
						<div class='progress-bar-wrapper'>
							<progress-bar :percent="percent" ref="progressBar" @changeSongProgress="changeSongProgress" @changingSongProgress="changingSongProgress"></progress-bar>
						</div>
						<span class="time time-r">{{ totalTime }}</span>
					</div>
					<!-- 底部按钮 -->
					<div class="operators">
						<div class="icon">
							<i :class="currentPlayMode" @click="changePlayMode"></i>
						</div>
						<div class="icon">
							<i class="icon-prev" @click="prevSong"></i>
						</div>
						<div class="icon icon-c" @click="playOrPause">
							<i :class="{'icon-play': !playingState,'icon-pause': playingState}"></i>
						</div>
						<div class="icon">
							<i class="icon-next" @click="nextSong"></i>
						</div>
						<div class="icon">
							<i class="icon-not-favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		
		<!-- mini播放器 -->
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="goToNormalPlayer">
				<div class="mini-cd">
					<div class="img-wrapper" ref="miniImgWrapper">
						<img :src="currentSong.albumImg" alt="" :class="rotatePlay" ref='miniImg'>
					</div>
				</div>
				<div class="text">
					<h2>{{ currentSong.name }}</h2>
					<p>{{ currentSong.singer }}</p>
				</div>
				<div class="play-control" >
					<progress-circle :size="32" :percent="percent">
						<i @click.stop="playOrPause" :class="{'icon-mini':true, 'icon-play-mini':!playingState, 'icon-pause-mini':playingState}"></i>
					</progress-circle>
				</div>
				<div class="play-list" @click.stop="showPlaylist">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		
		<!-- 播放器标签 -->
		<audio :src="currentSong.url" ref='audio' @canplay="canplay" @timeupdate="timeUpDate" @ended="musicPlayEnded"></audio>

		<!-- 播放列表 -->
		<playlist ref="playlist" :sequenceList="sequenceList"></playlist>
	</div>

</template>



<script> 
import {mapGetters, mapMutations, mapActions} from 'vuex';
import animations from 'create-keyframe-animation';
import {profixStyle} from 'common/js/dom.js';
import ProgressBar from 'base/progress-bar/progress-bar.vue';
import ProgressCircle from 'base/progress-circle/progress-circle.vue';
import {playMode} from 'common/js/config.js';
//import {getRandomArr} from 'common/js/util.js';
import Lyric from 'lyric-parser';
import Scroll from 'base/scroll/scroll.vue';
import Playlist from 'components/playlist/playlist.vue';


const transform = profixStyle('transform');
const transitionDuration = profixStyle('transitionDuration');
export default {
	data() {
		return {
			canPlayFlag: false,
			totalTime: 0,
			currentTime: 0,
			percent: 0,
			progressLeft: null,
			flag: false,
			currentLyric: null,
			currentLineNum: 0,
			currentDotShow: 'cd',
			currentPlayingLyric: ''
		}
	},
	created() {
		this.touch = {};
	},
	computed: {
		...mapGetters([
			'playlist',
			'fullScreen',
			'currentSong',
			'playingState',
			'currentIndex',
			'playMode',
			'sequenceList'
		]),
		rotatePlay() {  //控制中间cd是否转动的计算属性---根据播放状态playingState
			return this.playingState? 'play': '';
		},
		currentPlayMode() {  //根据当前播放模式，显示不同类名
			return this.playMode === 0?'icon-sequence':this.playMode === 1?'icon-loop':'icon-random';
		}
	},
	methods: {
		goToMiniPlayer() {
			this.setFullScreen(false);
		},
		goToNormalPlayer() {
			this.setFullScreen(true);
		},
		timeUpDate(e) {  //当前播放时间改变时，计算当前播放位置（时间）
			if (this.flag) {
				return;
			}
			//console.log(222)
			this.originalCurrentTime = e.target.currentTime;
			this.currentTime = this._changeTimeFormat(this.originalCurrentTime);
			// if (!this.playingState) {
			// 	this.setPlayingState(true);
			// }
			this.percent = e.target.currentTime / this.$refs.audio.duration;
		},
		changingSongProgress(innerPercent) {
			this.flag = true;
			this.currentTime = this._changeTimeFormat(this.originalTotalTime * innerPercent);
			//this.$refs.audio.currentTime = this.originalTotalTime * innerPercent;

		},
		changeSongProgress(innerPercent) {
			this.$refs.audio.currentTime = this.originalTotalTime * innerPercent;
			this.flag = false;
			this.setPlayingState(true);   //在暂停的过程中拖动滚动条，歌曲自动播放
			this.$refs.audio.play();
			if (this.currentLyric) {   //改变歌曲进度时，同步歌词进度
				this.currentLyric.seek(this.$refs.audio.currentTime * 1000);
			}
		},
		playOrPause() {  //点击播放按钮键，控制歌曲的播放和暂停
			
			if (this.playingState) {
				this.$refs.audio.pause();
				this.setPlayingState(false);
			}else {
				this.$refs.audio.play();
				this.setPlayingState(true);
			}
			this.currentLyric.togglePlay();
		},
		changePlayMode() {   //改变歌曲播放模式
			let playMode = this.playMode + 1;
			if (playMode > 2) {
				playMode = 0;
			}
			//console.log(playMode)
			// this.setPlayMode(playMode);
			// let list = null;
			// if (playMode === 2) {
			// 	//console.log('随机播放')
			// 	list = getRandomArr(this.sequenceList);
			// }else {
			// 	//console.log('顺序播放')
			// 	list = this.sequenceList;
			// }
			// this.resetCurrentIndex(list)
			// this.setPlayingList(list);
			this.changeMode(playMode);

		},
		// resetCurrentIndex(list) {  //当切换播放模式时，重置当前播放歌曲index
		// 	let index = list.findIndex((item) => {
		// 		return item.id === this.currentSong.id;
		// 	})
		// 	this.setCurrentIndex(index);
		// },
		nextSong() {   //下一首歌曲
			if (!this.canPlayFlag) {
				return;
			}
			let index = this.currentIndex + 1;
			if (index === this.playlist.length) {
				index = 0;
			}
			this.setCurrentIndex(index);
			this.canPlayFlag = false;
		},
		prevSong() {  //上一首歌曲
			if (!this.canPlayFlag) {
				return;
			}
			let index = this.currentIndex - 1;
			if (index < 0) {
				index = this.playlist.length - 1;
			}
			this.setCurrentIndex(index);
			this.canPlayFlag = false;
		},
		canplay() {   //audio标签，当歌曲加载完成能播放时，触发的事件
			this.canPlayFlag = true;
			this.originalTotalTime = this.$refs.audio.duration;
			this.totalTime = this._changeTimeFormat(this.originalTotalTime); //计算歌曲总时长
		},
		getLyric() {   //获取当前播放歌曲歌词
			this.currentSong.getLyric().then((lyric) => {
				this.currentLyric = new Lyric(lyric, this.handler);
				if (this.playingState) {
					this.currentLyric.play();
				}
			})
		},
		handler({lineNum, txt}) {
			this.currentLineNum = lineNum;
			if (lineNum > 5) {   //当歌词大于第五行时，让scroll组件开始自动滚动，使歌词始终保持在中间位置
				this.$refs.scrollLyric.scrollToElement(this.$refs.lyricItem[lineNum - 5], 1000);
			}else {
				this.$refs.scrollLyric.scrollToElement(this.$refs.lyricItem[0], 1000);
			}
			this.currentPlayingLyric = txt;
		},
		middleTouchStart(e) {  //滑动切换CD和歌词
			let touches = e.touches[0];
			this.touch.isInit = true;
			this.touch.isSlide = false;
			this.touch.directionLocked = '';
			this.touch.startX = touches.pageX;
			this.touch.startY = touches.pageY;
		},
		middleTouchMove(e) {
			if (!this.touch.isInit) {
				return;
			}
			if (!this.touch.isSlide) {
				this.touch.isSlide = true;
			}
			let touches = e.touches[0];
			let deltaX = touches.pageX - this.touch.startX;
			let deltaY = touches.pageY - this.touch.startY;

			let absDeltaX = Math.abs(deltaX);
			let absDeltaY = Math.abs(deltaY);

            if (absDeltaX > absDeltaY) {      //解决竖向滑动大于横向滑动时，touchend松手时，歌词仍然滑动的bug
              this.touch.directionLocked = 'clear' 
            }else if (absDeltaY >= absDeltaX) {
            this.touch.directionLocked = 'lock' 
            }
        
	        if (this.touch.directionLocked === 'lock') {
	          return
	        }	
			let startWidth = this.currentDotShow === 'cd'? 0 : -window.innerWidth;
			
			let offsetWidth = Math.min(0, Math.max(-window.innerWidth, startWidth + deltaX));
			this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
			let opacity = 1 - this.touch.percent;
			this.$refs.middleL.style.opacity = opacity;
			this.$refs.middleL.style[transitionDuration] = `0ms`

			this.$refs.scrollLyric.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
			this.$refs.scrollLyric.$el.style[transitionDuration] = `0ms`
		},
		middleTouchEnd() {
			if (this.touch.directionLocked === 'lock') {
	          return
	        }
	        if (!this.touch.isSlide) {
	        	return;
	        }
			let offsetWidth;
			let opacity;
			if (this.currentDotShow === 'cd') {
				if (this.touch.percent > 0.1) {
					offsetWidth = -window.innerWidth;
					opacity = 0;
					this.currentDotShow = 'lyric'
				}else {
					offsetWidth = 0;
					opacity = 1;
				}
			}else {
				if (this.touch.percent < 0.9) {
					offsetWidth = 0;
					opacity = 1;
					this.currentDotShow = 'cd'
				}else {
					offsetWidth = -window.innerWidth;
					opacity = 0;
				}
			}
			this.$refs.scrollLyric.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
			this.$refs.scrollLyric.$el.style[transitionDuration] = `500ms`

			this.$refs.middleL.style.opacity = opacity;
			this.$refs.middleL.style[transitionDuration] = `500ms`

			this.touch.isInit = false;
		},
		musicPlayEnded() {   //歌曲播放结束时触发

			//播放模式-----顺序播放/随机播放
			if (this.playMode === 0 || this.playMode === 2) {
				console.log('顺序播放了/随机播放了')
				let currentIndex = this.currentIndex + 1;
				this.setCurrentIndex(currentIndex);
			}
			//播放模式----单曲循环
			if (this.playMode === 1) {
				console.log('单曲循环了')
				this.$refs.audio.currentTime = 0; 
				this.$refs.audio.play();

				if (this.currentLyric) {   //当前为单曲循环播放模式时，播放结束将歌词置于开始处
					this.currentLyric.seek(0);
				}
			}

		},
		enter(el, done) {   //钩子函数动画----进入时
			const {x,y,scale} = this._getPosAndScale();

			let animation = {
				0: {
					transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
				},
				60: {
					transform: `translate3d(0,0,0) scale(1.2)`
				},
				100: {
					transform: `translate3d(0,0,0) scale(1)`
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation,
				presets: {
					duration: 400,
					easing: 'linear'
				}
			});
			animations.runAnimation(this.$refs.cdWrapper, 'move', done);
			
		},
		afterEnter() {
			animations.unregisterAnimation('move')
  			this.$refs.cdWrapper.style.animation = ''
		},
		leave(el,done) {
			const {x,y,scale} = this._getPosAndScale();
			this.$refs.cdWrapper.style.transition = 'all 0.4s'
			this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
			this.$refs.cdWrapper.addEventListener('transitionend', () => {
			  done()
			})
		},
		afterLeave() {
			this.$refs.cdWrapper.style.transition = ''
  			this.$refs.cdWrapper.style['transform'] = ''
		},
		showPlaylist() {  //展示播放列表
			this.$refs.playlist.show();
		},
		_getPosAndScale() {  //计算出动画需要的位移和缩小倍数
			const miniWidth = 40;
			const miniPaddingLeft = 20;
			const cdWidth = window.innerWidth * 0.8;
			const miniPaddingbottom = 30;
			const cdTop = this.$refs.top.style.height + 20;
			let x = -(window.innerWidth/2 - miniPaddingLeft);
			let y = window.innerHeight - cdTop - cdWidth/2 - miniPaddingbottom;
			let scale = miniWidth / cdWidth;
			return {x, y, scale};
		},
		_changeTimeFormat(time) {   //将秒数的时间转换为0:00的格式
			let m = Math.floor(time / 60);
			let s = Math.floor(time % 60);
			if (s.toString().length === 1) {
				s = `0${s}`
			}
			return `${m}:${s}`;
		},
		copyChildTransformStyle(outerEl, innerEl) {    //将子元素的transform属性复制给父元素
			let outer = this.$refs[outerEl];
			let inner = this.$refs[innerEl];
			let oTransform = getComputedStyle(outer, null)[transform];
			let iTransform = getComputedStyle(inner, null)[transform];
			outer.style[transform] = oTransform === 'none'? iTransform : iTransform.concat(' ', oTransform);
		},
		...mapMutations({
			setFullScreen: 'SET_FULLSCREEN',
			setPlayingState: 'SET_PLAYINGSTATE',
			setCurrentIndex: 'SET_CURRENTINDEX',
			setPlayMode: 'SET_PLAYMODE',
			setPlayingList: 'SET_PLAYINGLIST'
		}),
		...mapActions({
			changeMode: 'changePlayMode',
			savePlayed: 'savePlayed'
		})
		
	},
	watch: {
		playingState(newState) {  
			this.$nextTick(() => {
				newState? this.$refs.audio.play():this.$refs.audio.pause();
			})
			if (!newState) {
				if (this.fullScreen) {
					this.copyChildTransformStyle('imageWrapper', 'image');
				}else {
					this.copyChildTransformStyle('miniImgWrapper', 'miniImg');
				}
			}
		},
		currentSong(newSong, oldSong) {   //监控当前播放歌曲
			if (!newSong.id || newSong.id === oldSong.id) {
				return;
			}
			if (this.currentLyric) {   //当前播放歌曲变化时，清空lyric-parser对象
				this.currentLyric.stop();
			}
			this.$nextTick(() => {
				console.log('currentSong变了')
				this.setPlayingState(true);  //当前歌曲改变时，使其处于播放状态
				this.$refs.audio.play();
				this.getLyric();
				this.savePlayed(newSong); //将当前播放歌曲存储至 播放历史列表中
			})	
		}
	},
	components: {
		ProgressBar,
		ProgressCircle,
		Scroll,
		Playlist
	}
}


</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.player
	.normal-player
		position: fixed
		top: 0
		bottom: 0
		left: 0
		right: 0
		z-index: 150
		background-color: $color-background
		.background
			position: absolute
			left: 0
			top: 0
			width: 100%
			height: 100%
			opacity: .6
			filter: blur(20px)
			z-index: -1
			img
				width: 100%
				height: 100%
		.top
			position: relative
			color: $color-text
			text-align: center
			.back
				position: absolute
				top: 10px
				left: 10px
				font-size: 22px
				color: $color-theme
				transform: rotate(-90deg)
			.song-name
				width: 100%
				height: 40px
				font-size: 18px
				line-height: 40px
			.singer-name
				width: 100%
				height: 20px
				font-size: 14px
				line-height: 20px
		.middle
			position: fixed
			white-space: nowrap
			width: 100%
			top: 80px
			bottom: 170px
			.middle-l
				position: relative
				vertical-align: top
				display: inline-block
				width: 100%
				height: 0
				padding-top: 80%
				.cd-wrapper
					position: absolute
					top: 0
					left: 10%
					width: 80%
					height: 100%
					.cd
						width: 100%
						height: 100%
						border-radius: 50%
						.image
							position: absolute
							top: 0
							left: 0
							height: 100%
							width: 100%
							box-sizing: border-box
							border-radius: 50%
							border: 10px solid hsla(0,0%,100%,.1)
						.play
							animation: rotate 20s linear infinite
				.playing-lyric-wrapper
					margin-top: 40px
					.playing-lyric
						text-align: center
						font-size: 14px
						color: $color-text-l
			.middle-r
				display: inline-block
				vertical-align: top
				overflow: hidden
				width: 100%
				height: 100%
				.lyric-wrapper
					width: 100%
					div
						width: 100%
						.text
							font-size: 14px
							line-height: 32px
							color: $color-text-l
							text-align: center
							&.current
								color: $color-text
		.bottom
			position: absolute
			bottom: 50px
			width: 100%
			.dot-wrapper
				width: 100%
				text-align: center
				span
					display: inline-block
					width: 8px
					height: 8px
					border-radius: 50%
					background-color: hsla(0,0%,100%,.5)
					margin: 0 4px
					&.active
						width: 20px
						background-color hsla(0,0%,100%,.8)
						border-radius: 5px
			.progress-wrapper
				width: 80%
				margin: 0 auto
				display: flex
				align-items: center
				padding: 20px 0
				.time
					color: $color-text
					font-size: 12px
				.time-l
					flex: 1
					text-align: left	
				.time-r
					flex: 1
					text-align: right
				.progress-bar-wrapper
					width: 100%
					padding: 0 5px
				// .progress-bar
				// 	height: 4px
				// 	width: 80%
				// 	background-color: $color-background-d 
			.operators
				display: flex
				align-items: center
				justify-content: space-between
				width: 80%
				margin: 0 auto
				.icon
					font-size: 30px
					color: $color-theme
				.icon-c
					font-size: 40px
		&.normal-enter-active,&.normal-leave-active
			transition: all 0.5s
			.top,.bottom
				transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32)
		&.normal-enter,&.normal-leave-to
			opacity: 0
			.top
				transform: translate3d(0,-100px,0)
			.bottom
				transform: translate3d(0,100px,0)
	.mini-player
		position: fixed
		left: 0
		bottom: 0
		width: 100%
		height: 60px
		background-color: $color-highlight-background
		z-index: 180
		display: flex
		align-items: center
		.mini-cd
			flex: 0 0 40px
			padding: 0 10px 0 20px
			.img-wrapper
				height: 40px
				width: 40px
				img
					display: block
					width: 100%
					border-radius: 50%
				.play
					animation: rotate 20s linear infinite 
		.text
			flex: 1
			display: flex
			flex-direction: column
			justify-content: space-around
			height: 42px
			h2
				font-size: 14px
				color: $color-text
			p
				font-size: 12px
				color: $color-text-d
		.play-control
			flex: 0 0 30px
			padding: 0 10px
			.progress-circle
				.icon-play-mini,.icon-pause-mini
					font-size: 32px
					color: $color-theme-d
				.icon-mini
					position: absolute
					left: 0
					top: 0
		.play-list
			flex: 0 0 30px
			padding: 0 10px
			.icon-playlist
				font-size: 30px
				color: $color-theme-d
		&.mini-enter-active,&.mini-leave-active
			transition: all 0.5s
		&.mini-enter,&.mini-leave-to
			opacity: 0
			
@keyframes rotate
	0%
		transform: rotate(0deg)
	100%
		transform: rotate(360deg)
</style>