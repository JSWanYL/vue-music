<!-- 封装滚动列表组件 -->
<template>
	<scroll :data="dataArr" class="listview" ref='listview' :probeType="probeType" :isScroll="isScroll" @scroll="scroll">
		<ul>
			<li class="group" v-for="(group, groupIndex) in dataArr" :key="group.title" ref="listGroup">
				<h1 :class="{'group-title':true,'fix-title':currentIndex === groupIndex}">{{ group.title }}</h1>
				<ul>
					<li class="item" v-for="item in group.content" :key="item.id" @click="selectItem(item)">
						<img :src="item.picSrc" alt="singer_picture">
						<span>{{ item.name }}</span>
					</li>
				</ul>
			</li>
		</ul>
		<!-- 右侧快速查找列表 -->
		<div class="list-shortcut" @touchstart.stop.prevent="shortListTouchStart" @touchmove.stop.prevent="shortListTouchMove" @touchend.stop>
			<ul>
				<li v-for="(item, index) in shortCutArr" :key="item" ref="shortCutList" :class="{active: index === currentIndex}">{{ item }}</li>
			</ul>
		</div>
		<!-- 吸顶固定的title -->
		<div class="list-fixed" v-show="isShow" ref="listFixed">
			<div class="title-fixed" v-if="dataArr[this.currentIndex]">{{ fixedTitle }}</div>
		</div>
	</scroll>

</template>




<script>
import Scroll from 'base/scroll/scroll.vue';

const EVERYLIST_HEIGHT = 18;

export default {
	data() {
		return {
			scrollY: -1,
			currentIndex: 0,   //监听左侧列表滚动时，滚动到第几个group 
			isShow: true
		};
	},
	created() {
		this.position = {};
		this.index = 0;
		this.probeType = 3;
		this.isScroll = true;
	},
	computed: {
		fixedTitle() {
			return this.dataArr[this.currentIndex].title;
		}
	},
	props: {
		dataArr: {
			type: Array,
			default: () => []
		},
		shortCutArr: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		shortListTouchStart(e) {    //快速查找列表点击开始事件(点击快速列表，左侧歌手列表滚动到指定位置)
			let shortCutList = this.$refs.shortCutList;
			let index = shortCutList.indexOf(e.target);
			this.index = index;
			//滚动到指定位置
			this._scrollTo(index);
			//记录此时点击位置
			this.position.y1 = e.touches[0].pageY;
		},
		shortListTouchMove(e) {     //滑动快速列表时，左侧歌手列表跟随滚动
			this.position.y2 = e.touches[0].pageY;
			let moveDistance = this.position.y2 - this.position.y1;   //向下移动为正，向上移动为负
			let moveNumber = moveDistance / EVERYLIST_HEIGHT | 0;
			let index = this.index + moveNumber;
			//滚动到指定位置
			this._scrollTo(index);
		},
		_scrollTo(index) {       //将 点击跳转 和 点击滑动 两个方法中重复代码封装
			let listGroup = this.$refs.listGroup;
			this.$refs.listview.scrollToElement(listGroup[index], 0);
		},
		scroll(pos) {         //监听列表滚动的事件，在better-scroll的滚动事件（scroll）触发时触发
			this.scrollY = -pos.y;  //向下滚动为负值
			console.log(this.scrollY)
		},
		_getGroupHeight() {   //得到每个group的高度的数组
			let listGroup = this.$refs.listGroup;
			let countHeight = 0;
			let groupHeightArr = [];
			groupHeightArr.push(0);
			listGroup.forEach(item => {
				countHeight += item.clientHeight;
				groupHeightArr.push(countHeight);
			});
			return groupHeightArr;
		},
		selectItem(item) {
			this.$emit('select', item);
		},
		refresh() {
			this.$refs.listview.refresh();
		}
	},
	components: {
		Scroll
	},
	watch: {
		dataArr() {      //监听数据变化，计算每个group元素的高度
			setTimeout(() => {
				this._getGroupHeight();
			}, 20)
		},
		scrollY(newY) {     //监听scrollY的变化，实时监听滚动位置
			let groupHeightArr = this._getGroupHeight();
			for(let i = 0; i < groupHeightArr.length - 1; i++) {
				let topLine = groupHeightArr[i];  //上限
				let bottomLine = groupHeightArr[i + 1]; //下限
				if (newY >= topLine && newY < bottomLine) {
					this.currentIndex = i;
				}
				//吸顶title向上被顶出的效果
				if (newY > (bottomLine - 30) && newY < bottomLine) {
					this.$refs.listFixed.style.transform = `translate3d(0,${bottomLine - 30 - newY}px,0)`
				}
				if (newY >= topLine && newY < (bottomLine - 30)) {
					this.$refs.listFixed.style.transform = 'translate3d(0,0,0)'
				}
			}
			if (newY < 0) {    //监听scrollY的正负，决定是否隐藏吸顶title
				this.isShow = false;
			}else {
				this.isShow = true;
			}
		}
	}
}


</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.listview
	height: 100%
	background-color: $color-background
	.group
		width: 100%
		padding-bottom: 30px
		.group-title
			width: 100%
			height: 30px
			font-size: $font-size-small
			background-color: $color-highlight-background
			padding-left: 20px
			line-height: 30px
			color: $color-text-l
		ul
			width: 100%
			.item
				padding: 20px 0 0 30px
				img
					vertical-align: middle
					height: 50px
					width: 50px
					border-radius: 50%
				span
					font-size: $font-size-medium
					color: $color-text-l
					vertical-align: middle
					padding-left: 20px
	.list-shortcut
		position: absolute
		right: 0
		top: 50%
		transform: translateY(-50%)
		width: 20px
		background-color: $color-background-d
		padding: 20px 0
		border-radius: 10px
		ul
			li
				font-size: 12px
				color: $color-text-l
				padding: 3px
				text-align: center
				&.active
					color: $color-theme
	.list-fixed
		position: absolute
		top: 0
		left: 0
		width: 100%
		.title-fixed
			width: 100%
			height: 30px
			font-size: $font-size-small
			background-color: $color-highlight-background
			padding-left: 20px
			line-height: 30px
			color: $color-text-l

		


</style>