import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        youtubeToken: '',
        hahowToken: '',
        showMask: false,
        lightBox: {}
    },
    getters: {
        '[GLOBAL] getLoadingBlockOpen': (state) => state.showMask,
        '[GLOBAL] getLightBoxInfo': (state) => state.lightBox,
    },
    mutations: {
        '[MAIN] SET_HAHOW_TOKEN': (state, token) => state.hahowToken = token,
        '[MAIN] SET_YOUTUBE_TOKEN': (state, token) => state.youtubeToken = token,
        '[MAIN] SET_INIT_DATA': (state, initData) => {
            state.youtubeToken = initData.youtubeToken;
            state.hahowToken = initData.hahowToken;
        },
        '[MAIN] OPEN_LOADING_MASK': (state) => state.showMask = true,
        '[MAIN] CLOSE_LOADING_MASK': (state) => state.showMask = false,
        '[MAIN] SHOW_LIGHT_BOX': (state, imageUrl) => state.lightBox = {imageUrl, show: true},
        '[MAIN] HIDE_LIGHT_BOX': (state) => state.lightBox = {show: false},
    },
    actions: {
        '[MAIN] SET_HAHOW_TOKEN': ({commit}, token) => commit('[MAIN] SET_HAHOW_TOKEN', token),
        '[MAIN] SET_YOUTUBE_TOKEN': ({commit}, token) => commit('[MAIN] SET_YOUTUBE_TOKEN', token),
        '[MAIN] SET_INIT_DATA': ({commit}, initData) => commit('[MAIN] SET_INIT_DATA', initData),
        '[MAIN] OPEN_LOADING_MASK': ({commit}) => commit('[MAIN] OPEN_LOADING_MASK'),
        '[MAIN] CLOSE_LOADING_MASK': ({commit}) => commit('[MAIN] CLOSE_LOADING_MASK'),
        '[MAIN] SHOW_LIGHT_BOX': ({commit}, imageUrl) => commit('[MAIN] SHOW_LIGHT_BOX', imageUrl),
        '[MAIN] HIDE_LIGHT_BOX': ({commit}) => commit('[MAIN] HIDE_LIGHT_BOX'),
    },
    modules: {}
})
