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
    child_func?: Function,
    childStateFunc?: Function,
    children?: any[],
    items?: MenuItem[]
}>()
</script>

<template>
<div class="sidebar-button" @click="props.func()">
<p class="sidebar-header">{{ props.label }}</p>
</div>
<div class="sidebar-sub-button" v-for="(child) in children" @click="console.log(child); child_func(child[1])" @contextmenu="event => openContextMenu(event, items, child[1], child[0])">
    <div class="state-indicator-container">
        <div class="state-indicator" :state="(childStateFunc ? childStateFunc(child[1]) : 'NONE')"></div>
    </div>
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

.state-indicator-container {
  width: 0px;
  height: 0px;
}

.state-indicator {
  position: relative;
  display: none;
  width: 24px;
  height: 24px;
  top: -36px;
  left: -36px;
  border-radius: 50%;
  background: var(--theme-back-3);
  border: 12px var(--theme-back-1) solid;
  scale: 0.5;
}

.state-indicator[state="TODO"] {
  display: flex;
  background: var(--theme-accent-1);
  animation-name: pinging;
  animation-duration: 750ms;
  animation-iteration-count: infinite;
  /* animation-timing-function: linear; */
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-direction: alternate;
}
.state-indicator[state="OVERDUE"] {
  display: flex;
  background: var(--theme-danger);
  animation-name: pinging;
  animation-duration: 250ms;
  animation-iteration-count: infinite;
  /* animation-timing-function: linear; */
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-direction: alternate;
}
</style>
