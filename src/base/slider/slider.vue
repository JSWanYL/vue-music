<!-- 封装基础组件----轮播图组件 -->
<template>
<div class="slider" ref="slider">
	<div class="slider-group" ref='sliderGroup'>
		<slot></slot>
	</div>
	<div class="dots">
		<span v-for="(item,index) in dotsArr" :class="{dot:true,active:currentPage === index}"></span>
	</div>
</div>

</template>



<script>
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom.js';

export default {
	data() {
		return {
			dotsArr: [],
			currentPage: 0
		}
	},
	props: {
		loop: {      //是否无缝轮播
			type: Boolean,
			default: true
		},
		autoPlay: {   //是否自动轮播
			type: Boolean,
			default: true
		},
		interval: {    //自动轮播间隔
			type: Number,
			default: 4000
		}
	},
	mounted() {
		setTimeout(() => {
			this._setSliderGroupWidth(true);
			this._setSliderHeight();
			this._initSlider();
			this._initDots();
			if (this.autoPlay) {
				this._play();
			}
			window.onresize = () => {  //监听屏幕大小改变事件
				this._setSliderGroupWidth(false);
				this.slider.refresh();
			}
		},20)
	},
	methods: {
		_setSliderGroupWidth(isResize) {     //设置slider-group宽度
			this.children = this.$refs.sliderGroup.children;
			let boxWidth = 0;
			let singleWidth = this.$refs.slider.clientWidth;
			
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				addClass(child,'slider-item');
				child.style.width = singleWidth + 'px';
				boxWidth += singleWidth;
			}
			if (this.loop && isResize) {
				boxWidth += 2*singleWidth;
			}
			this.$refs.sliderGroup.style.width = boxWidth + 'px';	
		},
		_setSliderHeight() {     //根据屏幕大小，设置slider高度
			this.$refs.sliderGroup.style.height = window.screen.width/2.5
		},
		_initSlider() {      //初始化better-scroll
			this.slider = new BScroll(this.$refs.slider,{
				scrollX: true,
				scrollY: false,
				click: true,
				snap: {
					loop: this.loop,
					threshold: 0.3,
					speed: 400
				},
				momentum: false
			})
			this.slider.on('scrollEnd',() => {      //底部小圆点添加active类
				this.currentPage = this.slider.getCurrentPage().pageX;
				//每次滚动结束先清除一次定时器，而后调用_play()方法
				clearInterval(this.timeId);
				this._play();
			})
		},
		_initDots() {    //初始化底部小圆点
			let num = this.children.length - 2;
			this.dotsArr = new Array(num);

		},
		_play() {        //自动轮播函数
			this.timeId = setTimeout(() => {
				let nextPage = this.currentPage + 1;
				let count = this.children.length;
				if (this.loop) {
					count -= 2; 
				}
				if (nextPage >= count) {
					nextPage = 0;
				}
				this.slider.goToPage(nextPage, 0, 200);
			},this.interval)
		}
	}
}

</script>




<style scoped lang="stylus">
@import '~common/stylus/variable.styl';

.slider
	position: relative
	overflow: hidden
	.slider-group
		overflow: hidden
		.slider-item
			float: left
			height: 100%
			a
				width: 100%
				img
					width: 100%
					height: 100%
					display: block
	.dots
		position: absolute
		left: 0
		bottom: 12px
		width: 100%
		text-align: center
		.dot
			display: inline-block
			height: 8px
			width: 8px
			border-radius: 5px
			background-color: $color-text-l
			margin: 0 4px
			&.active
				width: 20px
				background-color: $color-text-ll


</style>