import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        youtubeToken: '',
        hahowToken: '',
    },
    getters: {},
    mutations: {
        '[MAIN] SET_HAHOW_TOKEN': (state, token) => state.hahowToken = token,
        '[MAIN] SET_YOUTUBE_TOKEN': (state, token) => state.youtubeToken = token,
        '[MAIN] SET_INIT_DATA': (state, initData) => {
            state.youtubeToken = initData.youtubeToken;
            state.hahowToken = initData.hahowToken;
        },
    },
    actions: {
        '[MAIN] SET_HAHOW_TOKEN': ({commit}, token) => commit('[MAIN] SET_HAHOW_TOKEN', token),
        '[MAIN] SET_YOUTUBE_TOKEN': ({commit}, token) => commit('[MAIN] SET_YOUTUBE_TOKEN', token),
        '[MAIN] SET_INIT_DATA': ({commit}, initData) => commit('[MAIN] SET_INIT_DATA', initData),
    },
    modules: {}
})
