<!-- 基础组件----switch开关组件 -->
<template>
	<div class="switches">
		<ul class="wrapper">
			<li class="item" v-for="(item,index) in switchData" :key="item.name" @click="selectItem(index)" :class="{'active':currentIndex === index}">
				<span>{{ item.name }}</span>
			</li>
		</ul>
	</div>
</template>




<script>
export default {
	props: {
		switchData: {
			types: Array,
			default: () => []
		},
		currentIndex: {
			types: Number,
			default: 0
		}
	},
	methods: {
		selectItem(index) {
			this.$emit('selectedItem', index);
		}
	}
}

</script>





<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.switches
	.wrapper
		width: 240px
		margin: 0 auto
		display: flex
		border-radius: 5px
		border: 1px solid #333	
		.item
			flex: 1
			text-align: center
			padding: 8px
			background-color: $color-background
			color: $color-text-d
			font-size: 14px
			&.active
				background-color: $color-highlight-background
				color: $color-text
</style>