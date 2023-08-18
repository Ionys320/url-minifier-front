<script lang="ts" setup>
defineProps<{
    url: string;
    title: string;
    icon: string;
}>();
</script>

<template>
    <NuxtLink :to="url" class="px-4 py-2 rounded-lg hover:bg-opacity-20 hover:bg-black"
        active-class="bg-black bg-opacity-20">
        <font-awesome-icon :icon="['fas', icon]" class="mr-2" />
        {{ title }}
    </NuxtLink>
</template>