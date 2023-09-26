<template>
    <div class="flex flex-col lg:flex-row gap-8 h-full">
        <!-- Left/top navigation bar -->
        <nav class="flex gap-2 lg:flex-col lg:basis-60 shrink-0 bg-gray-700 rounded-lg lg:h-full p-4">
            <NavItem :title="'URLs'" :url="'/'" :icon="'link'" />
            <NavItem :title="'Users'" :url="'/users'" :icon="'users'" />
        </nav>

        <!-- Page content -->
        <main class="grow">
            <slot></slot>
        </main>
    </div>
</template>