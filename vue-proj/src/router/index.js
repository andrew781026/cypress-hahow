import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/First.vue')
    },
    {
        path: '/second',
        name: 'Second',
        component: () => import('../views/Second.vue')
    },
    {
        path: '*',
        redirect: {name: 'Home'}
    },
];

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes,
});

export default router
