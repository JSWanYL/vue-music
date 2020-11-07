<!-- 搜索页面---搜索框组件 -->
<template>
	<div class="search-box">
		<i class="icon-search"></i>
		<input type="text" :placeholder="placeholder" v-model="query" ref="input">
		<i class="icon-dismiss" @click="clearInput" v-show="query.length"></i>
	</div>
</template>



<script>
import {debounce} from 'common/js/util.js';

export default {
	data() {
		return {
			query: ''
		}
	},
	props: {
		placeholder: {
			type: String,
			default: '搜索歌曲'
		}
	},
	created() {
		this.$watch('query', debounce(function(newVal){
			this.$emit('updateQuery', newVal);
		}, 500));
	},
	methods: {
		addHotKeyToQuery(hotkey) {
			this.query = hotkey
		},
		clearInput() {
			this.query = ''
		}
	}
}

</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.search-box
	height: 40px
	border-radius: 6px
	padding: 0 6px
	margin: 0 20px
	background-color: $color-highlight-background
	display: flex
	align-items: center
	.icon-search
		height: 24px
		width: 24px
		font-size: 24px
		color: $color-background
	.icon-dismiss
		font-size: 16px
		color: $color-background
		margin-left: 5px
	input
		flex: 1
		font-size: 14px
		line-height: 18px
		margin-left: 5px
		background-color: $color-highlight-background
		color: $color-text
		outline: 0
</style>