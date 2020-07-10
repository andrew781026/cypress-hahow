import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        youtubeToken: '',
        hahowToken: '',
        showMask: false,
    },
    getters: {
        '[GLOBAL] getLoadingBlockOpen':(state) => state.showMask,
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
    },
    actions: {
        '[MAIN] SET_HAHOW_TOKEN': ({commit}, token) => commit('[MAIN] SET_HAHOW_TOKEN', token),
        '[MAIN] SET_YOUTUBE_TOKEN': ({commit}, token) => commit('[MAIN] SET_YOUTUBE_TOKEN', token),
        '[MAIN] SET_INIT_DATA': ({commit}, initData) => commit('[MAIN] SET_INIT_DATA', initData),
        '[MAIN] OPEN_LOADING_MASK': ({commit}) => commit('[MAIN] OPEN_LOADING_MASK'),
        '[MAIN] CLOSE_LOADING_MASK': ({commit}) => commit('[MAIN] CLOSE_LOADING_MASK'),
    },
    modules: {}
})
