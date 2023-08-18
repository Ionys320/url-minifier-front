<script setup lang="ts">
import { ofetch } from 'ofetch';

const runtimeConfig = useRuntimeConfig();

//Setup ofetch
globalThis.$fetch = ofetch.create({
  baseURL: runtimeConfig.public.apiPath as string,
  onRequest({ options, request }) {
    const cookie = useCookie<string>('token');
    if (!cookie.value) return;

    // Set the request headers
    options.headers = options.headers || {}
    options.headers = { ...options.headers, 'Authorization': `Bearer ${cookie.value}` };
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
#__nuxt {
  @apply p-8 h-full;
}

body {
  @apply h-screen bg-gray-800 text-white;
}

input {
  @apply rounded-lg px-2 border border-white focus:outline-none focus:border-blue-400 transition-colors bg-transparent;
}

h2 {
  @apply text-2xl font-semibold;
}

button {
  @apply rounded-lg transition-colors py-1;
}
</style>