import { isAxiosError } from "axios";
import { useAuthenticationStore } from "@/stores/authentication";
import router from "@/router";

const handleRequestError = async (e: unknown) => {
  const authStore = useAuthenticationStore();

  if (isAxiosError(e) && e.response?.status === 401) {
    authStore.logout();
    await router.push({ name: "login" });
  }

  if (isAxiosError(e) && e.response?.status === 500) {
    await router.push({ name: "login" });
  }
};

export default handleRequestError;
