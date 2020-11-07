
const getters = {
	getSingers(state) {
		return state.singer;
	},
	playingState(state) {
		return state.playing;
	},
	fullScreen(state) {
		return state.fullScreen;
	},
	playlist(state) {
		return state.playlist;
	},
	sequenceList(state) {
		return state.sequenceList;
	},
	currentIndex(state) {
		return state.currentIndex;
	},
	playMode(state) {
		return state.mode;
	},
	currentSong(state) {
		return state.playlist[state.currentIndex] || {};
	},
	disc(state) {
		return state.disc;
	},
	toplist(state) {
		return state.toplist;
	},
	searchHistory(state) {
		return state.searchHistory;
	},
	playhistory(state) {
		return state.playhistory;
	}
}


export default getters;