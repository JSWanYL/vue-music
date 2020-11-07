<!-- 业务组件---播放歌曲列表组件 -->
<template>
	<transition name="playlist">
		<div class="playlist" v-show='isShow' @click="hide">
			<div class="list-wrapper" @click.stop>
				<div class="list-header">
					<i class="icon" :class="playModeIcon" @click="changePlayMode"></i>
					<span class="text">{{ playModeText }}</span>
					<span class="clear" @click="showConfirm">
						<i class="icon-clear"></i>
					</span>
				</div>
				<scroll class="list-content" ref="listContent">
					<transition-group tag="ul" name="listContent" class="content-wrapper" ref="list">
						<li class="list-item" v-for="(item,index) in sequenceList" :key="item.id" @click="selectItem(index)" ref="listItem">
							<i class="current" :class="{'icon-play': currentSong.id === item.id}"></i>
							<span class="text">{{ item.name }}</span>
							<span class="like">
								<i class="icon icon-not-favorite"></i>
							</span>
							<span class="delete" @click.stop="deleteListItem(item)">
								<i class="icon icon-delete"></i>
							</span>
						</li>
					</transition-group>
				</scroll>
				<div class="list-operate">
					<div class="add-wrapper" @click="showAddSong">
						<i class="icon icon-add"></i>
						<span class="text">添加歌曲到队列</span>
					</div>
				</div>
				<div class="list-close" @click="hide">
					<span class="close-text">关闭</span>
				</div>
			</div>
			<confirm :title="'是否清空播放列表'" :defineText="'清空'" ref="confirm" @defineSelect="clearList"></confirm>
			<add-song ref="addSong"></add-song>
		</div>
	</transition>
</template>



<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import Scroll from 'base/scroll/scroll.vue';
import Confirm from 'base/confirm/confirm.vue';
import addSong from 'components/add-song/add-song.vue';

export default {
	data() {
		return {
			isShow: false
		}
	},
	computed: {
		...mapGetters([
			'playlist',
			'sequenceList',
			'currentIndex',
			'currentSong',
			'playMode'
		]),
		playModeIcon() {
			if (this.playMode === 0) {
				return 'icon-sequence';
			}else if (this.playMode === 1) {
				return 'icon-loop';
			}else {
				return 'icon-random';
			}
		},
		playModeText() {
			if (this.playMode === 0) {
				return '顺序播放';
			}else if (this.playMode === 1) {
				return '循环播放';
			}else {
				return '随机播放';
			}
		}
	},
	updated() {   //dom渲染完毕后会触发刷新scroll

      this.$refs.listContent.refresh();
    },
	methods: {
		show() {
			this.isShow = true;	
			setTimeout(() => {
				this.$refs.listContent.refresh();
				this.scrollToCurrent(this.currentSong);
			}, 20);
		},
		hide() {
			this.isShow = false;
		},
		selectItem(index) {  //当前播放列表中的歌曲被点击
			this.setCurrentIndex(index);
		},
		changePlayMode() {
			let playMode = this.playMode + 1;
			if (playMode > 2) {
				playMode = 0;
			}
			this.changeMode(playMode);
		},
		scrollToCurrent(newSong) {  //基于scroll组件的scrollToElement方法
			let index = this.sequenceList.findIndex((item) => {
				return item.id === newSong.id;
			});
			console.log('第几个',index)
			console.log(this.$refs.listItem)
			console.log(this.sequenceList)
			console.log(this.$refs.listItem[index])
			setTimeout(() => {
				this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 200);
			}, 200)
				
		},
		deleteListItem(song) {  //删除播放列表的单个歌曲
			this.deleteItem(song);
			if (!this.playlist.length) {   //如果全删没了，将列表隐藏
				this.hide();
			}
		},
		showConfirm() {  //点击清空按钮，弹出确认框
			this.$refs.confirm.show();
		},
		clearList() { //清空播放列表
			this.clearPlayList();
			this.hide();
		},
		showAddSong() {	//显示添加歌曲组件
			this.$refs.addSong.show();
		},
		...mapActions({
			setCurrentIndex: 'changeCurrentIndex',
			changeMode: 'changePlayMode',
			deleteItem: 'deleteOne',
			clearPlayList: 'clearPlayList'
		})
	},
	components: {
		Scroll,
		Confirm,
		addSong
	},
	watch: {
		isShow(newVal) {
			if (newVal) {
				setTimeout(() => {
					console.log('需要刷新scroll组件');
					this.$refs.listContent.refresh();
				}, 200);
				
			}
		},
		currentSong(newVal, oldVal) {
			if (!this.isShow || newVal.id === oldVal.id) {
				return;	
			}
			console.log('currentSong change')
			console.log(newVal);
			setTimeout(() => {
				this.scrollToCurrent(newVal);
			}, 20);
		}
	}
}

</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.playlist
	position: fixed
	top: 0
	bottom: 0
	right: 0
	left: 0
	z-index: 1000
	background-color: $color-background-d
	.list-wrapper
		position: absolute
		left: 0
		bottom: 0
		width: 100%
		background-color: $color-highlight-background
		.list-header
			box-sizing: border-box
			display: flex
			align-items: center
			width: 100%
			padding: 20px 30px 10px 20px
			.icon
				font-size: 30px
				color: $color-theme
				margin-right: 10px
			.text
				flex: 1
				font-size: 14px
				color: $color-text-ll
			.clear
				position: relative
				i
					font-size: 14px
					color: $color-text-d
		.list-content
			width: 100%
			max-height: 240px
			overflow: hidden
			.content-wrapper
				width: 100%
				.list-item
					box-sizing: border-box
					width: 100%
					height: 40px
					padding: 0 30px 0 20px
					display: flex
					align-items: center
					&.listContent-enter-active,&.listContent-leave-active
						transition: all 0.3s
					&.listContent-enter,&.listContent-leave-to
						height: 0
						opacity: 0
					.current
						width: 20px
						font-size: 12px
					.icon-play
						color: $color-theme
					.text
						flex: 1
						font-size: 14px
						color: $color-text-d
					.like
						width: 32px
						text-align: right
						.icon
							font-size: 12px
							text-align: center
							line-height: 1
							color: $color-theme
							font-weight: 400
					.delete
						width: 32px
						text-align: right
						.icon
							font-size: 12px
							text-align: center
							line-height: 1
							color: $color-theme
							font-weight: 400
		.list-operate
			width: 140px
			margin: 20px auto 30px auto
			border-radius: 100px
			border: 1px solid $color-text-l
			.add-wrapper
				padding: 8px 16px
				display: flex
				justify-content: center
			.icon
				font-size: 12px
				margin-right: 5px
				color: $color-text-l
			.text
				font-size: 12px
				color: $color-text-l
		.list-close
			width: 100%
			height: 50px
			background-color: $color-background
			line-height: 50px
			text-align: center
			.close-text
				font-size: 16px
				color: $color-text-ll
.playlist-enter-active,.playlist-leave-active
	transition: opacity 0.3s
	.list-wrapper
		transition: all 0.3s
.playlist-enter,.playlist-leave-to
	opacity: 0
	.list-wrapper
		transform: translateY(100%)
		
// .listContent-enter-active,.listContent-leave-active
// 	transition: all 0.3s
// 	.list-item
// 		transition: height 0.3s
// .listContent-enter,.listContent-leave-to
// 	opacity: 0
// 	.list-item
// 		height: 0
</style>