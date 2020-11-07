//多个组件运用到共同的逻辑，使播放器最小化时，各组件自适应重新计算高度（推荐列表组件、歌手列表组件、歌曲列表组件）
import {mapGetters,mapActions} from 'vuex';


export const playListMixin = {
	computed: {
		...mapGetters([
			'playlist'
		])
	},
	mounted() {
		this.handlePlaylist(this.playlist);
	},
	activated() {
		this.handlePlaylist(this.playlist);
	},
	watch: {
		playlist(newVal) {
			this.handlePlaylist(newVal);
		}
	},
	methods: {
		handlePlaylist() {
			throw new Error('component must defined handlePlaylist method');
		}
	}
}

export const searchMixin = {
	data() {
		return {
			query: ''
		}
	},
	methods: {
		getQuery(query) {   //获取搜索结果数据
			this.query = query;
			this.$refs.suggest.showQueryArr(query);
		},
		saveSearchHistory() {  //接收到select派发事件时，保存到搜索历史
			this.saveHistory(this.query);
		},
		...mapActions([
			'saveHistory',
			'deleteHistory',
			'clearHistory'
		])
	}
}