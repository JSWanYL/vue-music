<template>
<div class="recomend" ref='recomend'>
	<scroll class="recomend-container" :data="decListData" ref="scrollWrap">
		<div>
			<slider v-if='sliderData.length'>
				<div v-for="item in sliderData" :key="item.imgUrl">
					<a :href="item.imgLink">
						<img :src="item.imgUrl" @load="imgLoad">
					</a>
				</div>
			</slider>
			<h1 class="rec-title">热门歌单推荐</h1>
			<loading v-show="!decListData.length"></loading>
			<ul class="list-container">
				<li class="list-item" v-for="item in decListData" :key="item.cover" @click="selectItem(item)">
					<div class="icon">
						<img v-lazy="item.cover">
					</div>
					<div class="des-text">
						<div class="name">{{ item.title }}</div>
						<div class="desc">{{ item.username }}</div>
					</div>
				</li>
			</ul>
		</div>
	</scroll>
	<router-view></router-view>
</div>

</template>



<script>
import {getRecommend,getDecList} from 'api/recommend.js';
import Slider from 'base/slider/slider.vue';
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import {ERR_OK} from 'api/config.js';
import {playListMixin} from 'common/js/mixin.js';
import {mapMutations} from 'vuex';

export default {
	mixins: [playListMixin],
	data() {
		return {
			sliderData: [],
			decListData: []
		}
	},
	created() {

		
		this._getBannerData();
		this._getDecList();
		
	},
	methods: {
		handlePlaylist(playlist) {
			let bottom = playlist.length > 0 ? '60px' : '';
			this.$refs.recomend.style.bottom = bottom;
			this.$refs.scrollWrap.refresh();
		},
		_getBannerData() {    //获取轮播图数据
			getRecommend().then(res => {
				if (res.code === ERR_OK) {
					this.sliderData = res.data.slider;
				}
			})
		},
		_getDecList() {     //获取推荐歌单数据
			getDecList().then(res => {
				if (res.code !== ERR_OK) {
					console.log('歌单数据获取失败');
					return;
				}
				this.decListData = res.data;
				console.log(this.decListData);
			})
		},
		imgLoad() {     //轮播图图片加载完毕事件，刷新sroll组件
			if (!this.isload) {}
			this.$refs.scrollWrap.refresh();
			this.isload = true;
		},
		selectItem(item) {   //点击之后，跳转路由
			this.$router.push({path: `/recommend/${item.content_id}`});
			this.setDisc(item);
		},
		...mapMutations({
			setDisc: 'SET_DISC'
		})
	},
	components: {
		Slider,
		Scroll,
		Loading
	}
}

</script>




<style scoped lang="stylus">
@import '~common/stylus/variable.styl';

.recomend
	position: fixed
	top: 88px
	left: 0
	right: 0
	bottom: 0px
	overflow: hidden
	.recomend-container
		height: 100%
		.rec-title
			width: 100%
			height: 60px
			text-align: center
			font-size: $font-size-medium
			color: $color-theme
			line-height: 60px
		.list-container
			width: 100%
			.list-item
				box-sizing:border-box
				width: 100%
				display: flex
				padding: 0 20px 20px 20px
				.icon
					padding-right: 20px
					img
						display: block
						height: 60px
						width: 60px
				.des-text
					flex: 1
					display: flex
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap
					flex-direction: column
					justify-content: space-around
					.name
						color: $color-text
						font-size: $font-size-medium
						
					.desc
						color: $color-text-d
						font-size: $font-size-medium

</style>