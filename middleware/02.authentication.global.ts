import { useCookie } from "nuxt/app";

/**
 * This middleware is responsible for redirecting the user to the login page if they are not authenticated.
 */
export default defineNuxtRouteMiddleware(async to => {
    const goToLogin = () => navigateTo("/login", { replace: true });

    if (to.path.startsWith("/login")) return;

    const nuxtApp = useNuxtApp();
    const cookie = useCookie<string>('token');

    if (!cookie.value)
        return goToLogin();

    try {
        const { error } = await useFetch(`${nuxtApp.$config.public.apiPath}/auth`, {
            headers: {
                Authorization: `Bearer ${cookie.value}`
            }
        });

        if (error.value)
            return goToLogin();

        return;
    } catch (e) {
        return goToLogin();
    }
})