<script setup lang="ts">
import { Project } from 'bolta-tasks-core';
import { openContextMenu, project_items } from '../contextmenu';

const props = defineProps<{
    project: Project
}>()
</script>

<template>
<div class="project-button" @contextmenu="event => {openContextMenu(event, project_items, project, project.title)}" @click="console.log(`wow!`)">
  <p class="project-header">{{ props.project.title }}</p>
</div>
</template>

<style scoped>
.project-button {
    width: calc(100% - 40px);
    height: calc(80px - 40px);
    background-color: var(--theme-back-2);
    border-radius: 20px;
    padding: 20px;
    vertical-align: middle;
    display: flex;
    align-items: center;
}

.project-header {
    font-family: "MontserratBold";
    font-size: 30px;
    margin: 0px;
}
</style>
