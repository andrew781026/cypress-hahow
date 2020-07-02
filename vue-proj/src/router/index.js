import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/First.vue')
    },
    {
        path: '/second',
        name: 'Second',
        component: () => import('../views/Second.vue')
    },
    {
        path: '/getSystemInfo',
        name: 'GetSystemInfo',
        component: () => import('../views/GetSystemInfo.vue')
    },
    {
        path: '/exit',
        name: 'Exit',
        component: () => import('../views/Exit.vue')
    },
    {
        path: '/download',
        name: 'Download',
        component: () => import('../views/Download.vue')
    },
    {
        path: '/youtubeSetting',
        name: 'YoutubeSetting',
        component: () => import('../views/YoutubeSetting.vue')
    },
    {
        path: '/hahowSetting',
        name: 'HahowSetting',
        component: () => import('../views/HahowSetting.vue')
    },
    {
        path: '*',
        redirect: {name: 'GetSystemInfo'}
    },
];

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes,
});

export default router
