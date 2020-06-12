<template>
	<div>
		<h1>推荐页面</h1>
	</div>

</template>



<script>
import {getRecommend} from 'api/recommend.js';

export default {
	created() {
		this.getBannerData();
	},
	methods: {
		getBannerData() {    //获取轮播图数据
			console.log(getRecommend());
		}
	}
}

</script>




<style scoped lang="stylus">


</style>