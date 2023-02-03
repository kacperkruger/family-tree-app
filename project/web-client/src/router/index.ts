import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuthenticationStore } from "@/stores/authentication";
import { useFamilyTreeStore } from "@/stores/familyTree";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/chat/public",
      name: "public-chat",
      component: () => import("../views/PublicChatView.vue"),
    },
    {
      path: "/chat/private",
      name: "private-chat",
      component: () => import("../views/PrivateChatView.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/UserListView.vue"),
    },
    {
      path: "/users/:username",
      name: "user",
      component: () => import("../views/UserView.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthenticationStore();
  const treeStore = useFamilyTreeStore();

  if (to.name === "home") {
    await authStore.getLoggedUser(
      () => next(),
      () => next()
    );
  } else if (
    to.name !== "login" &&
    to.name !== "register" &&
    !authStore.isAuthenticated
  ) {
    await authStore.getLoggedUser(
      () => {
        next();
        treeStore.getFamilyTree();
      },
      () => next({ name: "login" })
    );
  } else next();
});

export default router;
