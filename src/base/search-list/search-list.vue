<!-- 基础组件--搜索历史列表 -->
<template>
	<div class="search-list">
		<ul class="list-wrapper">
			<li class="item" v-for="item in searchArr" @click="selectItem(item)">
				<p class="text">{{ item }}</p>
				<span class="delete" @click.stop="selectIcon(item)">
					<i class="icon-delete"></i>
				</span>
			</li>
		</ul>
	</div>	
</template>



<script>
export default {
	props: {
		searchArr: {
			type: Array,
			default: []
		}
	},
	methods: {
		selectItem(item) {
			this.$emit('select', item);
		},
		selectIcon(item) {
			this.$emit('selectDelete', item);
		}
	}
}


</script>



<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.search-list
	.list-wrapper
		width: 100%
		.item
			display: flex
			justify-content: space-between
			font-size: 16px
			padding-top: 25px
			.text
				color: $color-text-l
			.delete
				color: $color-text-d
				font-size: 12px
</style>