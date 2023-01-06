import { createRouter, createWebHistory } from 'vue-router'

import HomeView     from '../views/Home.vue';
import MapColoringView from '../views/MapColoring/Index.vue';

let routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { 
            title: "پروژه دانشگاهی من",
        },
    },
    {
        path: '/MapColoring',
        name: 'MapColoring',
        component: MapColoringView,
        meta: { 
            title: "رنگ‌آمیزی نقشه",
        },
    },
];

let redirects = [
    {
        path: '/:any(.*)',
        redirect: '/',
    }
];

routes = routes.concat(redirects);

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to) => {

    document.title = to.meta.title || '';

});

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

export default router