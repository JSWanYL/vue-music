//封装和本地存储相关的逻辑

import storage from 'good-storage';

//本地搜索历史
const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 15;

function insertArray(arr, val, compare, maxlen) {
	let index = arr.findIndex(compare);
	if (index === 0) {
		return;
	}
	if (index > -1) {
		arr.splice(index, 1);
	}
	arr.unshift(val);
	if (arr.length > maxlen) {
		arr.pop();
	}
}

function deleteOne(arr, val, compare) {
	let index = arr.findIndex(compare);
	if (index > -1) {
		arr.splice(index, 1);
	}
}


export function saveSearch(query) {   //将历史搜索数据存至 本地存储localStorage
	let searchHistory = storage.get(SEARCH_KEY, []);
	insertArray(searchHistory, query, (item) => {
		return item === query
	}, SEARCH_MAX_LEN);
	storage.set(SEARCH_KEY, searchHistory);
	return searchHistory;
}

export function loadSearchHistory() {
	return storage.get(SEARCH_KEY, []);
}


export function deleteSearch(query) {  //在localStorage中删除单个搜索历史数据
	let searchHistory = storage.get(SEARCH_KEY, []);
	deleteOne(searchHistory, query, (item) => {
		return item === query
	});
	storage.set(SEARCH_KEY, searchHistory);
	return searchHistory;
}


export function clearAll() {
	storage.clear();
	return [];
}



//本地播放历史
const PLAY_KEY = '__play__';
const PLAY_MAX_LEN = 15;


export function savePlayHistory(song) {  //将播放历史存至本地存储
	let playHistory = storage.get(PLAY_KEY, []);
	insertArray(playHistory, song, (item) => {
		return item === song
	}, PLAY_MAX_LEN);
	storage.set(PLAY_KEY, playHistory);
	return playHistory;
}

export function loadPlayHistory() {
	return storage.get(PLAY_KEY, []);
}