<script setup lang="ts">
import {Router} from "../router"
// import {openPlannerTaskPopup} from "../popups/new_task"

import HeaderButton from "./HeaderButton.vue"
import { isMobile, sidebarOpened } from "../persist";
</script>

<template>
<div id="header">
    <button id="sidebar-button" v-if="isMobile" @click="sidebarOpened = true">></button>
    <p id="header-text">{{ Router.header }}</p>
    <div id="header-buttons">
        <HeaderButton id="add" icon="add" :func="Router.addButtonFunc.value"/>
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
