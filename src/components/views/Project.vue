<script setup lang="ts">
import { ProjectTask } from 'bolta-tasks-core';
import ListProjectTask from '../ListProjectTask.vue';

import { openContextMenu, project_task_items } from '../../contextmenu';
import { FocusedProject } from '../../persist';

</script>

<template>
<div>
  <div class="project-view">
    <ListProjectTask v-for="task in (FocusedProject?.tasks || [])" :task="(task as ProjectTask)" @contextmenu="event => openContextMenu(event, project_task_items, task, task.title)"></ListProjectTask>
  </div>
</div>
</template>

<style scoped>
.project-view {
  display: flex;
  flex-direction: column; 
  gap: 15px;
}
</style>
