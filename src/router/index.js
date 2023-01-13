import { createRouter, createWebHistory } from 'vue-router'

import HomeView        from '../views/Home.vue';
import MapColoringView from '../views/MapColoring/Index.vue';
import BridgesView     from '../views/Bridges/Index.vue';
import PlanarView      from '../views/Planar/Index.vue';
import EscapeView      from '../views/Escape/Index.vue';

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
    {
        path: '/Bridges',
        name: 'Bridges',
        component: BridgesView,
        meta: { 
            title: "پل‌های کونیگسبرگ",
        },
    },
    {
        path: '/Planar',
        name: 'Planar',
        component: PlanarView,
        meta: { 
            title: "لوله‌کشی خانه‌ها",
        },
    },
    {
        path: '/Escape',
        name: 'Escape',
        component: EscapeView,
        meta: { 
            title: "مسیر آزادی",
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
    history: createWebHistory(process.env.BASE_URL),
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