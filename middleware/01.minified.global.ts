/**
 * This middleware is responsible for redirecting the user to the original URL when they visit a minified URL.
 */
export default defineNuxtRouteMiddleware(async to => {
    const onError = () => abortNavigation("This URL was not found.");

    const config = useRuntimeConfig();
    const router = useRouter();

    //If the route exists, we don't need to do anything, continue.
    if (router.hasRoute(to.path)) return;

    const minified = to.path.split('/').at(-1);

    const { error, data } = await useFetch<string>(`${config.public.apiPath}/url/${minified}/visit`);

    if (error.value || !data.value)
        return onError();

    return navigateTo(data.value, { replace: true, external: true });
})