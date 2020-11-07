import {playMode} from 'common/js/config.js';
import {loadSearchHistory, loadPlayHistory} from 'common/js/cache.js';

const state = {
	singer: {},
	playing: false,
	fullScreen: false,
	playlist: [],
	sequenceList: [],
	currentIndex: 0,
	mode: playMode.sequence,
	disc: {},
	toplist: {},
	searchHistory: loadSearchHistory(),
	playhistory: loadPlayHistory()
}





export default state