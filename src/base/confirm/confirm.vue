<!-- 基础组件--确认弹窗组件 -->
<template>
	<transition name="confirm">
		<div class="confirm" v-show="iShow" @click.stop>
			<div class="confirm-wrapper">
				<div class="btn-content"> 
					<p class="title">{{ title }}</p>
					<div class="btn-wrapper">
						<div class="cancel" @click="cancelSelect">{{ cancelText }}</div>
						<div class="define" @click="defineSelect">{{ defineText }}</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>



<script>
export default {
	data() {
		return {
			iShow: false
		}
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		defineText: {
			type: String,
			default: '确定'
		}
	},
	methods: {
		show() {
			this.iShow = true;
		},
		hide() {
			this.iShow = false;
		},
		cancelSelect() {
			this.$emit('cancelSelect');
			this.hide();
		},
		defineSelect() {
			this.$emit('defineSelect');
			this.hide();
		}
	}
}

</script>



<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.confirm
	position: fixed
	top: 0
	left: 0
	bottom: 0
	right: 0
	z-index: 998
	background-color: $color-background-d
	.confirm-wrapper	
		position: absolute
		top: 50%
		left: 50%
		transform: translate(-50%,-50%)
		.btn-content
			width: 270px
			border-radius: 10px
			background-color: $color-highlight-background
			.title
				font-size: 18px
				color: $color-text-l
				padding: 19px 15px
				text-align: center
				border-bottom: 1px solid $color-background-d
			.btn-wrapper
				display: flex
				font-size: 18px
				color: $color-text-d
				div
					flex: 1
					text-align: center
					padding: 10px 0
				.cancel
					border-right: 1px solid $color-background-d
	// &.confirm-leave-active
	// 	transition: opacity 0.5s
	// &.confirm-enter,.confirm-leave-to
	// 	opacity: 0
	&.confirm-enter-active
		animation: fadein 0.5s
		.btn-content
			animation: confirmin 0.5s
	&.confirm-leave-active
		transition: opacity 0.5s
	&.confirm-leave-to
		opacity: 0
@keyframes fadein {
	0% {
		opacity: 0
	}
	100% {
		opacity: 1
	}
}
@keyframes confirmin {
	0% {
		transform: scale(0)
	}
	50% {
		transform: scale(1.2)
	}
	100% {
		transform: scale(1)
	}
}


</style>