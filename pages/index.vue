<script lang="ts" setup>
import { Url } from '~/classes/url.class';
import type { UrlInterface } from '~/interfaces/url.interface';

const { data: fetchedUrls } = useFetch<Url[]>(`/url`, {
    server: false,
    transform: (data: UrlInterface[]) => {
        return Url.fromJSONs(data);
    }
});

const selectedUrl = ref<Url | null>(null);

const initNewUrl = () => {
    selectedUrl.value = new Url();
}

const saveUrl = async () => {
    if (!selectedUrl.value) return;

    if (selectedUrl.value.id < 0) {
        // Add
        const { error, data } = await useFetch<Url>(`/url`, {
            method: 'POST',
            body: selectedUrl.value.toJSON(),
            transform: (data: UrlInterface) => {
                return Url.fromJSON(data);
            }
        });

        if (error.value || !data.value) return alert('An error occured.');

        await copy(data.value.fullMinified)
        alert(`Url minified. The URL is ${data.value.fullMinified} and has been copy to your clipboard.`);

        urls.value?.push(data.value!);
    } else {
        // Edit
        const { error } = await useFetch(`/url/${selectedUrl.value.id}`, {
            method: 'PUT',
            body: selectedUrl.value.toJSON(),
        });

        if (error.value) return alert('An error occured.');
        alert(`URL updated.`);
    }

    selectedUrl.value = null;
}

const deleteUrl = async () => {
    if (!selectedUrl.value) return;


    const result = prompt('Are you sure you want to delete this URL?\nTo confirm, please type DELETE.');
    if (!result || result !== 'DELETE') return alert('Deletion cancelled.');

    const { error } = await useFetch(`/url/${selectedUrl.value.id}`, {
        method: 'DELETE',
    });

    if (error.value) return alert('An error occured.');
    alert(`URL deleted.`);

    fetchedUrls.value = fetchedUrls.value!.filter(url => url.id !== selectedUrl.value!.id);
    selectedUrl.value = null;
}

const search = ref('');
const urls = computed(() => {
    if (!search.value) return fetchedUrls.value?.sort((a, b) => b.id - a.id);

    const lowerCasedSearch = search.value.toLowerCase();

    return fetchedUrls.value?.filter(url => {
        return url.title?.toLowerCase().includes(lowerCasedSearch)
            || url.base.toLowerCase().includes(lowerCasedSearch)
            || url.tags?.split('|').find(tag => tag.toLowerCase().includes(lowerCasedSearch));
    })
        .sort((a, b) => b.id - a.id);
});
</script>

<template>
    <div class="flex flex-col gap-6 h-full">
        <!-- Action bar -->
        <div class="flex gap-4">
            <h2>URLs</h2>

            <!-- Search bar -->
            <input v-model="search" placeholder="Search" class="rounded-lg mr-auto" />

            <!-- New minification button -->
            <button class="bg-gray-700 rounded-lg px-2 hover:bg-gray-900" @click="initNewUrl()">
                <font-awesome-icon :icon="['fas', 'add']" />
                <span class="ml-1 hidden lg:inline">Minify a new URL</span>
            </button>
        </div>

        <!-- List -->
        <div class="overflow-auto bg-gray-700 rounded-lg divide-y-2 divide-gray-800 h-full">
            <div v-for="url in urls"
                class="w-full p-4 flex items-center justify-between gap-3 hover:bg-opacity-20 hover:bg-black cursor-pointer"
                @click="selectedUrl = url">
                <!-- Link data -->
                <div>
                    <p>
                        <span class="font-bold">{{ url.title }}</span> -

                        <!-- Original URL/Open icon -->
                        <a target="_blank" :href="url.base" class="hover:text-gray-300" @click.stop>
                            {{ url.base }}

                            <font-awesome-icon :icon="['fas', 'up-right-from-square']" />
                        </a>
                    </p>

                    <!-- More infos -->
                    <p class="text-gray-200">
                       Code: {{ url.minified }} - {{ url.visits }} visits - Tags: {{ url.tags }}
                    </p>
                </div>

                <!-- Copy button -->
                <button class="bg-gray-800 rounded-lg px-2 py-1 hover:bg-gray-900 shrink-0"
                    @click.stop="copy(url.fullMinified, true)">
                    <font-awesome-icon :icon="['fas', 'copy']" />
                    <span class="ml-2 hidden lg:inline">Copy the minified URL</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Minify/edit a url modal -->
    <div v-if="selectedUrl"
        class="fixed h-screen w-screen bg-black bg-opacity-60 top-0 left-0 flex items-center justify-center"
        @click.self="selectedUrl = null">
        <form class="flex flex-col gap-4 py-4 justify-evenly bg-gray-800 rounded-xl p-8 lg:w-1/3"
            @submit.prevent="saveUrl()">
            <h1 class="text-4xl font-semibold text-center truncate">{{ selectedUrl.title }}</h1>

            <div>
                <label for="title">Internal title</label>
                <input id="title" placeholder="New minified URL" v-model="selectedUrl.title" required class="w-full" />
            </div>

            <div>
                <label for="base">URL to minify</label>
                <input id="base" type="url" v-model="selectedUrl.base" required class="w-full" />
            </div>

            <div>
                <label for="minified">Minified code (optionnal)</label>
                <input id="minified" v-model="selectedUrl.minified" class="w-full" />
            </div>

            <div>
                <label for="tags">Tags (optionnal)</label>
                <input id="tags" v-model="selectedUrl.tags" placeholder="Separated with a comma (,)" class="w-full" />
            </div>

            <div class="grid lg:grid-cols-3 gap-4">
                <button :disabled="selectedUrl.id < 0" class="bg-red-900 hover:bg-red-800 disabled:bg-opacity-60"
                    @click="deleteUrl()" type="button">
                    Delete
                </button>

                <button class="bg-blue-600 hover:bg-blue-500 lg:col-span-2" type="submit">
                    Save and close
                </button>
            </div>
        </form>
    </div>
</template>