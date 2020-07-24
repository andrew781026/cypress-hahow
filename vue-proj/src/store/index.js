import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        google: {
            tokens: null,
            clientId: '',
            clientSecret: ''
        },
        hahowToken: '',
        showMask: false,
        lightBox: {}
    },
    getters: {
        '[GLOBAL] getLoadingBlockOpen': (state) => state.showMask,
        '[GLOBAL] getLightBoxInfo': (state) => state.lightBox,
        '[GLOBAL] getHahowToken': (state) => state.hahowToken,
        '[GLOBAL] getGoogleAuthInfo': (state) => state.google,
        '[GLOBAL] getAccessToken': (state) => state.google.tokens && state.google.tokens.access_token,
    },
    mutations: {
        '[MAIN] SET_HAHOW_TOKEN': (state, token) => state.hahowToken = token,
        '[MAIN] SET_GOOGLE_TOKENS': (state, tokens) => state.google.tokens = tokens,
        '[MAIN] SET_INIT_DATA': (state, initData) => {
            state.hahowToken = initData.hahowToken;
            state.google = {
                clientId: initData.google.clientId || state.google.clientId,
                clientSecret: initData.google.clientSecret || state.google.clientSecret,
                tokens: initData.google.tokens || state.google.tokens,
            };
        },
        '[MAIN] OPEN_LOADING_MASK': (state) => state.showMask = true,
        '[MAIN] CLOSE_LOADING_MASK': (state) => state.showMask = false,
        '[MAIN] SHOW_LIGHT_BOX': (state, imageUrl) => state.lightBox = {imageUrl, show: true},
        '[MAIN] HIDE_LIGHT_BOX': (state) => state.lightBox = {show: false, imageUrl: state.lightBox.imageUrl},
    },
    actions: {
        '[MAIN] SET_HAHOW_TOKEN': ({commit}, token) => commit('[MAIN] SET_HAHOW_TOKEN', token),
        '[MAIN] SET_GOOGLE_TOKENS': ({commit}, tokens) => commit('[MAIN] SET_GOOGLE_TOKENS', tokens),
        '[MAIN] SET_INIT_DATA': ({commit}, initData) => commit('[MAIN] SET_INIT_DATA', initData),
        '[MAIN] OPEN_LOADING_MASK': ({commit}) => commit('[MAIN] OPEN_LOADING_MASK'),
        '[MAIN] CLOSE_LOADING_MASK': ({commit}) => commit('[MAIN] CLOSE_LOADING_MASK'),
        '[MAIN] SHOW_LIGHT_BOX': ({commit}, imageUrl) => commit('[MAIN] SHOW_LIGHT_BOX', imageUrl),
        '[MAIN] HIDE_LIGHT_BOX': ({commit}) => commit('[MAIN] HIDE_LIGHT_BOX'),
    },
    modules: {}
})
