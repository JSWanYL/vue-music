import * as types from './mutation-types.js';
import {getRandomArr} from 'common/js/util.js';
import {playMode} from 'common/js/config.js';
import {saveSearch, deleteSearch, clearAll, savePlayHistory} from 'common/js/cache.js';

function findIndex(list, targetSong) {
	let index = list.findIndex((item) => {
		return item.id === targetSong.id;
	})
	return index;
}

export const initPlayer = function({commit, state}, {list, index, mode}) {
		if (mode === playMode.random) {
			let randomList = getRandomArr(list);
			index = findIndex(randomList, list[index]);
			commit(types.SET_PLAYINGLIST, randomList);
			commit(types.SET_SEQUENCELIST, list);
			commit(types.SET_CURRENTINDEX, index);
		}else {
			commit(types.SET_PLAYINGLIST, list);
			//console.log(list)
			commit(types.SET_SEQUENCELIST, list);
			commit(types.SET_CURRENTINDEX, index);
		}
		commit(types.SET_PLAYINGSTATE, true);
		commit(types.SET_FULLSCREEN, true);		
		commit(types.SET_PLAYMODE, mode);

	}

export const initRandomPlay = function({commit, state}, {list, index}) {
		commit(types.SET_PLAYINGSTATE, true);
		commit(types.SET_FULLSCREEN, true);
		commit(types.SET_PLAYINGLIST, getRandomArr(list));
		commit(types.SET_SEQUENCELIST, list);
		commit(types.SET_CURRENTINDEX, index);
		commit(types.SET_PLAYMODE, playMode.random);
}


export const changePlayMode = function({commit, state}, mode) {   //改变播放模式

	let sequenceList = state.sequenceList.slice();
	let playlist = state.playlist.slice();
	let currentIndex = state.currentIndex;
	let currentSong = playlist[currentIndex];
	let list = null;
	if (mode === 2) {
		list = getRandomArr(sequenceList);
	}else {
		list = sequenceList;
	}
	commit(types.SET_PLAYMODE, mode);
	commit(types.SET_CURRENTINDEX, resetCurrentIndex(list, currentSong));
	commit(types.SET_PLAYINGLIST, list);
}

function resetCurrentIndex(list, currentSong) {  //当切换播放模式时，重置当前播放歌曲index
	let index = list.findIndex((item) => {
		console.log('item',item)
		console.log('currentsong',currentSong)
		return item.id === currentSong.id;
	})
	return index;
}


export const insertSong = function({commit, state}, song) {  //点击搜索到的歌曲时，添加到当前播放列表中
	let playlist = state.playlist.slice(); //[]
	let sequenceList = state.sequenceList.slice(); //[]
	let currentIndex = state.currentIndex; //0
	let currentSong = playlist[currentIndex]; //如果没有当前播放列表则为undefined
	let playMode = state.mode;

	//处理播放列表playlist新增歌曲需求
	let fpIndex = findIndex(playlist, song); //计算要播放歌曲在playlist中的位置,如果当前playlist为空,则返回的是-1
	currentIndex ++;
	if (!playlist.length) {
		currentIndex = 0;
	}
	playlist.splice(currentIndex, 0, song);  //在增加后的currentIndex位置增加一首歌曲 ※※如果当前playlist为空，也可以正确添加歌曲
	//判断playlist中原先是否有对应添加的歌曲
	if (fpIndex !== -1) {  //有
		if (fpIndex <= currentIndex) {  //原歌曲在添加的歌曲前面,直接删除原歌曲
			playlist.splice(fpIndex, 1);
			currentIndex --;
		}else {   //原歌曲在添加歌曲后面
			playlist.splice(fpIndex, 1);
		}
	}

	//处理顺序列表sequenceList新增歌曲需求
	let sequenceIndex = findIndex(sequenceList, currentSong) + 1;
	let fsIndex = findIndex(sequenceList, song);
	sequenceList.splice(sequenceIndex, 0, song);
	//判断顺序列表sequenceIndex中原先是否有对应添加的歌曲
	if (fsIndex > -1) {  //有
		sequenceList.splice(fsIndex, 1); //无论在前还是后，直接删除即可
	}

	//commit提交，更改mutations
	commit(types.SET_PLAYINGSTATE, true);
	commit(types.SET_FULLSCREEN, true);
	commit(types.SET_PLAYINGLIST, playlist);
	commit(types.SET_SEQUENCELIST, sequenceList);
	commit(types.SET_CURRENTINDEX, currentIndex);
	commit(types.SET_PLAYMODE, playMode);
	console.log(playlist[currentIndex])
}


export const saveHistory = function({commit}, query) {    //将搜索历史保存到state.searchHistory中，并储存至localStorage
	commit(types.SET_SEARCH_HISTORY, saveSearch(query));
} 


export const deleteHistory = function({commit}, query) {  //删除单个搜索历史数据，同时删除localStorage中的
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}


export const clearHistory = function({commit}) {  //清空所有搜索历史
	commit(types.SET_SEARCH_HISTORY, clearAll());
}

export const changeCurrentIndex = function({commit,state}, index) {  //点击播放列表歌曲时，改变当前播放歌曲

	let sequenceList = state.sequenceList.slice();
	let playlist = state.playlist.slice();
	let currentIndex = findIndex(playlist, sequenceList[index]);
	commit(types.SET_CURRENTINDEX, currentIndex);
}


export const deleteOne = function({commit, state}, song) {   //删除播放列表中的单首歌曲
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	let currentSong = playlist[currentIndex];

	//处理播放列表
	let fpIndex = findIndex(playlist, song);
	playlist.splice(fpIndex, 1);
	if (fpIndex < currentIndex) { //删除歌曲 在 当前播放歌曲 前
		currentIndex--
	}

	//处理顺序列表
	let fsIndex = findIndex(sequenceList, song);
	sequenceList.splice(fsIndex, 1);

	//处理已经全部删除完的情况
	if (!playlist.length) {
		commit(types.SET_PLAYINGSTATE, false);
	}else {
		commit(types.SET_PLAYINGSTATE, true);
	}

	commit(types.SET_PLAYINGLIST, playlist);
	commit(types.SET_SEQUENCELIST, sequenceList);
	commit(types.SET_CURRENTINDEX, currentIndex);
	console.log(currentIndex)
}



export const clearPlayList = function({commit, state}) {
	commit(types.SET_PLAYINGLIST, []);
	commit(types.SET_SEQUENCELIST, []);
	commit(types.SET_CURRENTINDEX, 0);
	commit(types.SET_PLAYMODE, playMode.sequence);
}


export const savePlayed = function({commit}, song) {  //将历史播放列表保存至state.playhistory,同时存到localStorage中
	commit(types.SET_PLAY_HISTORY, savePlayHistory(song));
}