<!-- 顶部header组件 -->
<template>
	<div class="m-header">
		<div class="center">
			<img src="~common/image/default.png" alt="">
			<h1>Chicken Music</h1>
		</div>
	</div>
</template>



<script>


</script>




<style scoped lang="stylus">
@import '~common/stylus/variable.styl'

.m-header
	position: relative
	height: 44px
	width: 100%
	.center
		display: flex
		justify-content: space-between
		width: 45%
		position: absolute
		left: 50%
		margin-left: -22.5%
		background-color #fff
		background-color: $color-background
		img
			height: 33px
			width: 33px
			margin-top: 3px
		h1
			font-size: $font-size-large
			text-align: center
			line-height: 44px
			color: $color-theme
		
		

</style>