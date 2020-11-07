<template>
	<transition name="fade">
		<div class="add-song" v-show="isShow" @click.stop>
			<!-- 头部 -->
			<div class="header">
				<h1 class="title">添加歌曲到列表</h1>
				<div class="close" @click="hide">
					<i class="icon-close"></i>
				</div>
			</div>
			<!-- 搜索框 -->
			<div class="searchBox-wrapper">
				<search-box ref="searchBox" :placeholder="'搜索歌曲'" @updateQuery="getQuery"></search-box>
			</div>
			<!-- switch选项卡开关 -->
			<div class="switch-wrapper">
				<switches :currentIndex="currentIndex" :switchData="switchData" @selectedItem="selectedItem"></switches>
			</div>
			<div class="search-result" v-show="query.length">
				<suggest ref="suggest" @select="saveSearchHistory"></suggest>
			</div>
		</div>
	</transition>
</template>




<script>
import SearchBox from 'base/search-box/search-box.vue';
import Suggest from 'components/suggest/suggest.vue';
import {searchMixin} from 'common/js/mixin.js';
import Switches from 'base/switches/switches.vue';

export default {
	mixins: [searchMixin],
	data() {
		return {
			isShow: false,
			currentIndex: 0,
			switchData: [
				{
					name: '最近播放'
				},
				{
					name: '搜索历史'
				}
			]
		}
	},
	methods: {
		show() {
			this.isShow = true;
		},
		hide() {
			this.isShow = false;
		},
		selectedItem(index) {  //switch开关被点击的选项
			this.currentIndex = index;
		}
	},
	components: {
		SearchBox,
		Suggest,
		Switches
	}
}

</script>



<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.add-song
	position: fixed
	top: 0
	bottom: 0
	right: 0
	left: 0
	background-color: $color-background
	z-index: 1399
	&.fade-enter-active,&.fade-leave-active
		transition: all .5s
	&.fade-enter,&.fade-leave-to
		opacity: 0
		transform: translate3d(100%,0,0)
	.header
		position: relative
		height: 44px
		text-align: center
		.title
			font-size: 18px
			line-height: 44px
			color: $color-text
		.close
			position: absolute
			top: 50%
			right: 20px
			margin-top: -10px
			font-size: 20px
			color: $color-theme
	.searchBox-wrapper
		margin: 20px 0
	.test
		width: 100px
		height: 30px
		background-color: #333
	.search-result
		position: fixed
		top: 124px
		bottom: 0
		right: 0
		left: 0
</style>