<script setup lang="ts">
import {Router} from "../router"
// import {openPlannerTaskPopup} from "../popups/new_task"

import HeaderButton from "./HeaderButton.vue"
import { isMobile, sidebarOpened } from "../persist";
import { MenuItem } from "primevue/menuitem";
import { Ref, ref } from "vue";
import { openPlannerTaskPopup } from "../popups/new_task";
import { openSchedulePopup } from "../popups/new_schedule";
import { ContextMenu } from "primevue";
import { openProjectPopup } from "../popups/new_project";

const menu = ref();

const items_base: MenuItem[] = [
    { label: 'New PlannerTask', command: () => {
        openPlannerTaskPopup()
    }},
    { label: 'New Project', command: () => {
        openProjectPopup()
    }},
    { label: 'New Schedule', command: () => {
        openSchedulePopup()
    }},
]
const items: Ref<MenuItem[]> = ref(items_base);

function openContextMenu(event: MouseEvent) {
    // print("FUCK YOU", menu.value)
    menu.value.show(event)
}
</script>

<template>
<ContextMenu ref="menu" :model="items" />
<div id="header">
    <button id="sidebar-button" v-if="isMobile" @click="sidebarOpened = true">></button>
    <p id="header-text">{{ Router.header }}</p>
    <div id="header-buttons">
        <HeaderButton id="add" icon="add" :func="Router.addButtonFunc.value" @contextmenu="event => openContextMenu(event)"/>
        <HeaderButton id="notification" icon="notification" :func="() => {console.log(`Opening Notifications!`)}"/>
        <HeaderButton id="settings" icon="settings" :func="() => {console.log(`Opening Settings!`)}"/>
    </div>
</div>
</template>


<style scoped>
#header {
    font-size: 54px;
    width: calc((100% - 30px) + var(--gap));
    height: 100px;
    background: var(--theme-back-2);
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    padding-left: 30px;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

#header-text {
    font-family: "MontserratExtraBold";
}

#header-buttons {
    display: flex;
}

#sidebar-button {
    background-color: var(--theme-back-3);
    font-family: "MontserratExtraBold";
    font-size: 64px;
    width: 64px;
    height: 64px;
}
</style>
