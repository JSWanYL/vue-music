<!-- 滚动条组件 -->
<template>
	<div class="progress-bar" ref="proBar">
		<div class="progress-inner" ref="proInner" @click="skipTo">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn" ref="proBtn" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend="touchEnd"></div>
		</div>
	</div>

</template>





<script>
import {profixStyle} from 'common/js/dom.js';
import {mapGetters, mapMutations} from 'vuex';
const transform = profixStyle('transform');
const btnWidth = 16

export default {
	data() {
		return {
			changValue: null,
			innerWidth: 0
		}
	},
	props: {
		percent: {
			type: Number,
			default: 0
		},
		progressLeft: {
			type: Number,
			default: 0
		}
	},
	methods: {
		skipTo(e) {
			let clickPageX = e.pageX;
			let proBarLeft = this._getElementLeft(this.$refs.progress);
	
			let innerWidth = this.$refs.proInner.clientWidth - btnWidth;
			let progressWidth = clickPageX - proBarLeft;
			this._offset(progressWidth);
			let innerPercent = progressWidth / innerWidth;
			this.$emit('changeSongProgress', innerPercent);
			console.log(111)
		},
		touchStart(e) {
			this.pos.isStart = true;
			this.pos.x = e.touches[0].pageX;
			this.pos.progressWidth = this.$refs.progress.clientWidth;
			this.pos.barWidth = this.$refs.proInner.clientWidth;
			this.pos.btnWidth = 16;
		},
		touchMove(e) {
			if (!this.pos.isStart) {
				return;
			}

			let moveX = e.touches[0].pageX;
		
			this.pos.distance = moveX - this.pos.x; //distance为正数---右滑，为负数----左滑
			//控制滚动条滚动边界
			if (this.pos.distance < 0) {
				if (this.pos.progressWidth + this.pos.distance <= 0) {
					this.pos.distance = -(this.pos.progressWidth);
				}
			}else {
				if (this.pos.progressWidth + this.pos.distance >= (this.pos.barWidth - btnWidth)) {
					this.pos.distance = this.pos.barWidth - btnWidth - this.pos.progressWidth;
				}
			}
			let offsetWidth = this.pos.progressWidth + this.pos.distance;
			this._offset(offsetWidth);
			//拖拽过程中，向组件外传递拖拽距离百分比，实时获取时间进度
			let innerPercent = this.$refs.progress.clientWidth / (this.pos.barWidth - btnWidth);
			this.$emit('changingSongProgress', innerPercent);
			console.log(222)
		},
		touchEnd() {
			this.pos.isStart = false;
			let innerPercent = this.$refs.progress.clientWidth / (this.pos.barWidth - btnWidth);
			//拖拽结束后，向组件外传递拖拽距离的百分比
			this.$emit('changeSongProgress', innerPercent);
		},
		_offset(offsetWidth) {
			this.$refs.progress.style.width = `${offsetWidth}px`;
			this.$refs.proBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
		},
		_getElementLeft(element) {
	      var actualLeft = element.offsetLeft;    //这是获取元素距父元素顶部的距离
	      var current = element.offsetParent;   //这是获取父元素
	      while (current !== null) {      //当它上面有元素时就继续执行
	        actualLeft += current.offsetLeft;   //这是获取父元素距它的父元素顶部的距离累加起来
	        current = current.offsetParent;　　//继续找父元素
	      }
	      return actualLeft;   
	    },
	    _setInnerWidthOnlyOnce() {   //利用函数的重写封装只执行一次的函数，否则，当缩小的时候this.$refs.proInner.clientWidth值会变
	    	//console.log('执行了')
	    	this.innerWidth = this.$refs.proInner.clientWidth - btnWidth;
	    	this._setInnerWidthOnlyOnce = function(){}
	    }
	  //   _setProgressOffset(percent) {
	  //   	if (this.pos.isStart) {
			// 	return;
			// }
			// this.innerWidth = this.$refs.proBar.clientWidth - btnWidth;
			// const progressWidth = this.innerWidth * percent;
			// this._offset(progressWidth);
	  //   }
	},
	created() {
		
		this.pos = {};
		
	},
	mounted() {

	},
	watch: {
		percent(newVal) {
			if (this.pos.isStart) {
				return;
			}
			this._setInnerWidthOnlyOnce();

			let progressWidth = this.innerWidth * newVal;
			this._offset(progressWidth)
			
		}
	}
}



</script>





<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.progress-bar
	width: 100%
	.progress-inner
		position: relative
		width: 100%
		height: 4px
		background-color: $color-background-d
		.progress
			position: absolute
			left: 0
			top: 0
			height: 4px
			background-color: $color-theme
		.progress-btn
			position: absolute
			left: 0
			top: -6px
			height: 16px
			width: 16px
			border-radius: 50%
			background-color: $color-theme
			border: 3px solid $color-text
			box-sizing: border-box

</style>