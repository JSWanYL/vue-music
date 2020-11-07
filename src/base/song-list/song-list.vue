<!-- 歌曲列表组件 -->
<template>
	<div class="song-list">
		<ul>
			<li class="song-item" v-for="(item,index) in songs" :key="item.id" @click='selectItem(item,index)'>
				<div class="icon" v-show="isRank" :class="rankClass(index)">{{ rankText(index) }}</div>
				<div class="content">
					<h2 class="name">{{ item.name }}</h2>
					<div class="desc">{{ `${item.singer}·${item.album}` }}</div>
				</div>
			</li>
		</ul>
	</div>

</template>



<script>
export default {
	props: {
		songs: {
			type: Array,
			default: []
		},
		isRank: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		selectItem(item,index) {  //向外派发点击事件，点击进入播放器
			this.$emit('select', item, index);
		},
		rankClass(index) {
			if (index <= 2) {
				return `icon${index}`
			}else {
				return ''
			}
		},
		rankText(index) {
			if (index > 2) {
				return index;
			}else {
				return ''
			}
		}
	}
}


</script>




<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.song-list
	width: 100%
	.song-item
		padding: 40px 40px 0px 30px
		font-size: 14px
		display: flex
		align-items: center
		.content
			flex: 1
			overflow: hidden
			.name
				color: $color-text
				margin-bottom: 10px
				text-overflow:ellipsis
				white-space: nowrap
				overflow: hidden
			.desc
				color: $color-text-d
				line-height: 15px
				text-overflow:ellipsis
				white-space: nowrap
				overflow: hidden
		.icon
			height: 25px
			width: 25px
			margin-right: 20px
			vertical-align: center
			font-size: 18px
			color: $color-theme
			text-align: center
			line-height: 25px
			&.icon0
				background: url('~common/image/first@3x.png') center center/100% 100% no-repeat
			&.icon1
				background: url('~common/image/second@3x.png') center center/100% 100% no-repeat
			&.icon2
				background: url('~common/image/third@3x.png') center center/100% 100% no-repeat
</style>