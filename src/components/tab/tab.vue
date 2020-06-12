<!-- 顶部导航tab组件 -->
<template>
	<div class="tab">
		<router-link to="/recommend" tag="div">
			<span>推荐</span>
		</router-link>
		<router-link to="/singer" tag="div">
			<span>歌手</span>
		</router-link>
		<router-link to="/rank" tag="div">
			<span>排行</span>
		</router-link>
		<router-link to="/search" tag="div">
			<span>搜索</span>
		</router-link>
	</div>

</template>



<script>



</script>


<style scoped lang="stylus">
@import '~common/stylus/variable.styl'

.tab
	height: 44px
	width: 100%
	display: flex
	div
		&.router-link-active span
				padding-bottom: 4px
				border-bottom: 2px solid $color-theme
				color: $color-theme
		flex: 1
		text-align: center
		line-height: 44px
		span
			font-size: $font-size-medium
			color: $color-text-l

	
			

</style>