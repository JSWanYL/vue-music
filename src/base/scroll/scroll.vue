<!-- 封装scroll滚动组件 -->
<template>
	<div ref="scrollWrap">
		<slot></slot>
	</div>
</template>



<script>
import BScroll from 'better-scroll';

export default {
	props: {
		click: {
			type: Boolean,
			default: true
		},
		data: {   //当加载data数据之后，scroll组件会重新刷新
			type: Array,
			default: null
		},
		probeType: {
			type: Number,
			default: 1
		},
		isScroll: {  //决定是否派发滚动事件（传递滚动位置参数）
			type: Boolean,
			default: false
		},
		pullUpdate: {   //是否开启上拉下载功能
			type: Boolean,
			default: false
		}
	},
	mounted() {
		setTimeout(() => {
			this._initScroll();	
		},20)
		
	},
	methods: {
		_initScroll() {
			this.scroll = new BScroll(this.$refs.scrollWrap,{
				// scrollY: true,
				probeType: this.probeType,
				click: this.click
			});
			if (this.isScroll) {     //isScroll为true，派发滚动事件
				this.scroll.on('scroll', (pos) => {
					this.$emit('scroll',pos);

				})
			}
			if (this.pullUpdate) {  //开启上拉加载
				this.scroll.on('scrollEnd', () => {
					if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
						this.$emit('scrollToEnd');
					}
				})
			}
		},
		refresh() {
			this.scroll && this.scroll.refresh();
		},
		scrollToElement() {    //给scroll组件添加better-scroll的滚动到指定元素的方法
			this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
		},
		scrollTo () {
	        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
	    },
	},
	watch: {
		data() {
			this.refresh();
		}
	}
}



</script>




<style lang="stylus" scoped>



</style>