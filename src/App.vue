<template>
  <div id="app">
  	<m-header></m-header>
  	<tab></tab>
   	<!-- 首页路由挂载位置 -->
    <keep-alive>
   	  <router-view></router-view>
    </keep-alive>
    <!-- 播放器页面 -->
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header.vue';
import Tab from 'components/tab/tab.vue';
import Player from 'components/player/player.vue';

export default {
	components: {
		MHeader,
		Tab,
    Player
	}
}

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>


</style>
