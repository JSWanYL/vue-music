<!-- 基础组件---圆形滚动条 -->
<template>
	<div class="progress-circle">
		<svg :height="size" :width="size" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<circle class="progress-background" r="50" cx="50" cy="50" fill="none"></circle>
			<circle class="progress-bar" r="50" cx="50" cy="50" fill="none" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"></circle>
		</svg>
		<slot></slot>
	</div>


</template>




<script>
export default {
	data() {
		return {
			dasharray: 100 * Math.PI
		}
	},
	props: {
		size: {
			type: Number,
			default: 32
		},
		percent: {
			type: Number,
			default: 0
		}
	},
	computed: {
		dashoffset() {
			return this.dasharray * (1 - this.percent)
		}
	}
}

</script>





<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.progress-circle
	position: relative
	svg
		circle
			stroke-width: 8px
			transform-origin: center
			&.progress-background
				stroke: #333
				transform: scale(0.9)
			&.progress-bar
				stroke: $color-theme
				transform: scale(0.9) rotate(-90deg)


</style>