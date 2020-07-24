import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import './css/tailwind.css';
import './css/main.css';

Vue.config.productionTip = false;

import VuePageTransition from 'vue-page-transition';

Vue.use(VuePageTransition);

// 範例為頁面 load 入後自動 focus 自己
Vue.directive('focus', {
    inserted: function (el) {
        el.focus();
    }
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
