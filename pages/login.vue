<script setup lang="ts">
import { UserInterface } from 'interfaces/user.interface';
import { AuthResponse } from 'interfaces/api_responses/auth.response';

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
    <main class="h-full flex items-center justify-center" @submit="authenticate()">
        <form class="my-auto flex flex-col gap-6 justify-evenly bg-gray-700 rounded-xl px-8 py-6 lg:px-32 lg:w-1/3">
            <h1 class="text-4xl font-semibold text-center">URL minifier</h1>

            <div>
                <label for="email">Email address</label>
                <input id="email" type="email" v-model="email" placeholder="benoit@streamrunners.fr" class="w-full" />
            </div>

            <div>
                <label for="password">Password</label>
                <input id="password" type="password" v-model="password" placeholder="Bipbop123!" class="w-full" />
            </div>

            <button class="bg-blue-700 hover:bg-blue-600 w-full" type="submit">Login</button>
        </form>
    </main>
</template>