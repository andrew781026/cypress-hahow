import Vue from 'vue'
import VueRouter from 'vue-router'

// 版权声明：本文为CSDN博主「酷酷的橙007」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/xiecheng1995/java/article/details/106497172
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

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
        path: '/course',
        name: 'Course',
        component: () => import('../views/Courses.vue')
    },
    {
        path: '/download',
        name: 'Download',
        component: () => import('../views/Download.vue'),
        props: (route) => ({...route.params})
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
