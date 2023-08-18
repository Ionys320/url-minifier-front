<script lang="ts" setup>
import { UserInterface } from 'interfaces/user.interface';

const { data: users } = useFetch<UserInterface[]>(`/user`);

const selectedUser = ref<UserInterface | null>(null);

const saveUser = async () => {
    if (!selectedUser.value) return;

    if (selectedUser.value.id < 0) {
        // Add
        const { error, data } = await useFetch<UserInterface>(`/user`, {
            method: 'POST',
            body: selectedUser.value
        });

        if (error.value || !data.value) return alert('An error occured.');
        alert(`User added. Password: ${data.value.password}`);

        users.value?.push(data.value!);
    } else {
        // Edit
        const { error } = await useFetch(`/user/${selectedUser.value.id}`, {
            method: 'PUT',
            body: selectedUser.value
        });

        if (error.value) return alert('An error occured.');
        alert(`User updated.`);
    }

    selectedUser.value = null;
}
</script>

<template>
    <div>
        <div class="flex justify-between">
            <h2>Users</h2>

            <button class="bg-gray-700 rounded-lg px-2 hover:bg-gray-900"
                @click="selectedUser = { email: '', id: -1, isAdmin: false }">
                <font-awesome-icon :icon="['fas', 'add']" />
                <span class="ml-1">Add a new user</span>
            </button>
        </div>

        <div class="h-full overflow-auto bg-gray-700 rounded-lg mt-6 divide-y-2 divide-gray-800">
            <div v-for="user in users"
                class="p-4 flex items-center justify-between gap-2 hover:bg-opacity-20 hover:bg-black cursor-pointer"
                @click="selectedUser = user">
                <div>
                    <p class="font-bold">
                        {{ user.email }}
                    </p>
                    <p v-if="user.isAdmin" class="text-gray-200">Admin</p>
                </div>

                <div class="hover:text-red-500">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                </div>
            </div>
        </div>
    </div>

    <div v-if="selectedUser"
        class="absolute h-screen w-screen bg-black bg-opacity-60 top-0 left-0 flex items-center justify-center"
        @click.self="selectedUser = null">
        <form class="flex flex-col gap-4 py-4 justify-evenly bg-gray-800 rounded-xl p-8 lg:w-1/3" @submit.prevent="saveUser()">
            <h1 class="text-4xl font-semibold text-center" v-text="selectedUser.id < 0 ? `Add a user` : `Edit a user`"></h1>

            <div>
                <label for="email">Email</label>
                <input id="email" type="email" v-model="selectedUser.email" class="w-full" />
            </div>

            <div>
                <input id="isAdmin" type="checkbox" v-model="selectedUser.isAdmin" />
                <label for="isAdmin" class="ml-1">Mark as admin</label>
            </div>

            <button class="bg-blue-600 hover:bg-blue-500 w-full" type="submit">Save and close</button>
        </form>
    </div>
</template>