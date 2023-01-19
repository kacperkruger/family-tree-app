import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import {useAuthenticationStore} from "@/stores/authentication";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/public-chat',
            name: 'public-chat',
            component: () => import('../views/PublicChatView.vue')
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthenticationStore()
    if ((to.name !== 'login' && to.name !== 'home') && !authStore.isAuthenticated) {
        try {
            authStore.getLoggedUser();
            next()
        } catch (e) {
            next({ name: 'login' })
        }
    }
    else next()
})

export default router
