
import * as types from './mutation-types.js';

const mutations = {
	[types.SET_SINGERS](state, singer) {
		state.singer = singer;
	},
	[types.SET_PLAYINGSTATE](state, flag) {
		state.playing = flag;
	},
	[types.SET_FULLSCREEN](state, flag) {
		state.fullScreen = flag;
	},
	[types.SET_PLAYINGLIST](state, list) {
		state.playlist = list;
	},
	[types.SET_SEQUENCELIST](state, list) {
		state.sequenceList = list;
	},
	[types.SET_CURRENTINDEX](state, index) {
		state.currentIndex = index;
	},
	[types.SET_PLAYMODE](state, mode) {
		state.mode = mode;
	},
	[types.SET_DISC](state, disc) {
		state.disc = disc;
	},
	[types.SET_TOPLIST](state, toplist) {
		state.toplist = toplist;
	},
	[types.SET_SEARCH_HISTORY](state, searchHistory) {
		state.searchHistory = searchHistory;
	},
	[types.SET_PLAY_HISTORY](state, playhistory) {
		state.playhistory = playhistory;
	}
}


export default mutations;