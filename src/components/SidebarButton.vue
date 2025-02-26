<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem';
import { inject, ref, Ref } from 'vue';
import { openProjectPopup } from '../popups/new_project';
import { Project } from 'bolta-tasks-core';
import { Projects } from '../api';
import { ContextMenu } from 'primevue';
import { openContextMenu } from '../contextmenu';

const props = defineProps<{
    label: String,
    func: Function,
    children?: any[],
    items?: MenuItem[]
}>()
</script>

<template>
<div class="sidebar-button" @click="props.func()">
<p class="sidebar-header">{{ props.label }}</p>
</div>
<div class="sidebar-sub-button" v-for="(child) in children" @click="console.log(child)" @contextmenu="event => openContextMenu(event, items, child[1], child[0])">
    <p class="sidebar-sub-header">{{ child[0] }}</p>
</div>
</template>

<style scoped>
.sidebar-button {
    width: calc(100% - 40px);
    height: calc(80px - 40px);
    background-color: var(--theme-back-2);
    border-radius: 20px;
    padding: 20px;
    vertical-align: middle;
    display: flex;
    align-items: center;
}

.sidebar-header {
    font-family: "MontserratBold";
    font-size: 30px;
    margin: 0px;
}

.sidebar-sub-button {
    width: calc(100% - 80px);
    height: calc(40px - 40px);
    background-color: var(--theme-back-2);
    opacity: 0.5;
    border-radius: 20px;
    padding: 20px;
    vertical-align: middle;
    display: flex;
    align-items: center;
}


.sidebar-sub-header {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap-mode: nowrap;
    text-wrap: none;
    font-family: "MontserratBold";
    font-size: 20px;
    margin: 0px;
}
</style>
