import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import {useAuthenticationStore} from "@/stores/authentication";
import axios from "axios";

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
            path: '/users',
            name: 'users',
            component: () => import('../views/UsersView.vue')
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthenticationStore()
    if ((to.name !== 'login' && to.name !== 'home') && !authStore.isAuthenticated) {
        try {
            await axios.get(`${import.meta.env.VITE_API_HOST_URL}/api/v1/authentication/me`, {withCredentials: true})
        } catch (e) {
            next({ name: 'login' })
        }
    }
    else next()
})

export default router
