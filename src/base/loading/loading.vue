<!-- 封装loading组件 -->
<template>
	<div>
		<div class="loading-container">
			<img src="~common/image/loading.gif">
			<p class="text">{{ text }}</p>
		</div>
	</div>


</template>


<script>
export default {
	props: {
		text: {
			type: String,
			default: 'loading.....'
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.loading-container
	text-align: center
	img
		display: inline-block
		height: 30px
		width: 30px
		padding: 20px 0 10px 0
	.text
		font-size: $font-size-medium
		color: $color-text

</style>