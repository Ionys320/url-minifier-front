<script setup lang="ts">
import type { UserInterface } from '~/interfaces/user.interface';
import type { AuthResponse } from '~/interfaces/api_responses/auth.response';

definePageMeta({
    layout: false
});

const router = useRouter();

const email = ref('');
const password = ref('');

const authenticate = async () => {
    const { error, data } = await useFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            username: email.value, password: password.value
        })
    });

    if (error.value || !data.value) {
        alert('Email or password is incorrect');
        return;
    }

    const user = useState<UserInterface>('user');
    user.value = data.value.user;

    const cookie = useCookie<string>('token', {
        secure: true,
        path: '/',
    });
    cookie.value = data.value.token;

    router.push({ path: '/', replace: true });
}
</script>

<template>
    <main class="h-full flex items-center justify-center" @submit.prevent="authenticate">
        <div class="flex flex-col items-center gap-5 w-full">
            <h1 class="text-4xl font-semibold text-center">URL minifier</h1>
            
            <form class="my-auto flex flex-col gap-3 justify-evenly bg-gray-700 rounded-xl px-8 py-6">
                <div class="relative flex items-center">
                    <input id="email" type="email" v-model="email" aria-label="Email address" placeholder="Email address" class="w-full pl-8" />
                    <font-awesome-icon class="absolute left-2" :icon="['fas', 'envelope']" />
                </div>

                <div class="relative flex items-center">
                    <input id="password" type="password" autocomplete="current-password" v-model="password" aria-label="Password" placeholder="Password" class="w-full pl-8" />
                    <font-awesome-icon class="absolute left-2" :icon="['fas', 'key']" />
                </div>

                <button class="bg-blue-400 hover:bg-blue-500 w-full mt-2" type="submit">Login</button>
            </form>
        </div>
    </main>
</template>