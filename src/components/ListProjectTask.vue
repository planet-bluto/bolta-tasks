<script setup lang="ts">
import { CleanTaskStatuses, ProjectTask, TaskStatus, TaskStatuses } from 'bolta-tasks-core';
import moment from 'moment';
import { openContextMenu } from '../contextmenu';
import { computed, ComputedRef } from 'vue';
import { MenuItem } from 'primevue/menuitem';
import { SubAPI } from '../sub_api';

const props = defineProps<{
    task: ProjectTask;
}>()

const beanTexts = () => {
  let texts = []
  let {task} = props
  // print(schedule.rules)
  texts.push(String(moment(task.due).format("MMM Do YYYY H:mm A")))

  return texts
}

const getStatus = computed(() => {
  let {task} = props
  return TaskStatuses[task.status]
})

const getState = computed(() => {
  let {task} = props
  return task.state()
})

async function toggleCompleted(e: MouseEvent) {
  await new SubAPI("projects", props.task.project_id, "tasks").edit(props.task._index, {status: (props.task.status != TaskStatus.COMPLETED ? TaskStatus.COMPLETED : TaskStatus.NOT_STARTED)})
}


const items_base: ComputedRef<MenuItem[]> = computed(() => {
  return Object.keys(CleanTaskStatuses).map((status_key: string) => {
    return { label: status_key, command: async () => {
      let status: TaskStatus = (CleanTaskStatuses[status_key] as TaskStatus)
      
      print("SETTING TASK TO => ", status)
      await new SubAPI("projects", props.task.project_id, "tasks").edit(props.task._index, {status})
    }}
  })
})
</script>

<template>
<div class="list-project-task">
  <div class="list-project-task-state-indicator-container">
    <div class="list-project-task-state-indicator" :state="getState"></div>
  </div>
  <div class="list-project-task-left">
    <div class="list-project-task-status" @click="toggleCompleted" @contextmenu="event => {openContextMenu(event, items_base, null, `Update '${props.task.title}'`)}" :status="getStatus"></div>
  </div>
  <div class="list-project-task-right">
    <div class="list-project-task-right-top">
    <p class="list-project-task-title">{{ task.title }}</p>
  </div>
  <div class="list-project-task-right-bottom">
    <p class="list-project-task-time-label">{{ String(moment(task.due).format("MMM Do YYYY h:mm A")) }}</p>
    <!-- <ListTaskBean v-for="beanText in beanTexts()" :text="beanText"></ListTaskBean> -->
  </div>
  </div>
</div>
</template>

<style scoped>
.list-project-task {
  display: flex;
  background: var(--theme-back-2);
  border-radius: 15px;
  width: calc(100% - 30px);
  min-height: 100px;
  max-height: 100px;
  padding: 15px;
  gap: 15px;
  opacity: 0.8;
  transition-property: opacity;
  transition-duration: 100ms;
}

.list-project-task:hover {
  opacity: 1;
}

.list-project-task-right {
  width: calc(100% - 100px - 15px);
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-project-task-right-bottom {
  display: flex;
  gap: 8px;
  flex-direction: column;
  place-content: center;
  height: 100%;
}

.list-project-task-time-label {
  font-family: 'MontserratBold';
  font-size: 26px;
  color: var(--theme-text-2);
  opacity: 0.25;
}

.list-project-task-left {
  min-width: 100px;
  width: 100px;
  min-height: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-project-task-status {
  width: calc(80% - 30px);
  height: calc(80% - 30px);
  min-height: calc(80% - 30px);
  background: var(--theme-back-3);
  border-radius: 50%;
  border: 15px var(--theme-back-1) solid;
}

.list-project-task-status[status="COMPLETED"] { background: var(--theme-positive) }
.list-project-task-status[status="IN_PROGRESS"] { background: var(--theme-waiting) }
.list-project-task-status[status="SKIPPED"] { background: var(--theme-skipped) }
.list-project-task-status[status="FAILED"] { background: var(--theme-danger) }

.list-project-task-state-indicator-container {
  width: 0px;
  height: 0px;
}

.list-project-task-state-indicator {
  position: relative;
  display: none;
  width: 24px;
  height: 24px;
  top: -24px;
  left: -24px;
  border-radius: 50%;
  background: var(--theme-back-3);
  border: 12px var(--theme-back-1) solid;
}

.list-project-task-state-indicator[state="TODO"] {
  display: flex;
  background: var(--theme-accent-1);
  animation-name: pinging;
  animation-duration: 750ms;
  animation-iteration-count: infinite;
  /* animation-timing-function: linear; */
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-direction: alternate;
}
.list-project-task-state-indicator[state="OVERDUE"] {
  display: flex;
  background: var(--theme-danger);
  animation-name: pinging;
  animation-duration: 250ms;
  animation-iteration-count: infinite;
  /* animation-timing-function: linear; */
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-direction: alternate;
}

.list-project-task-title {
  font-size: 35px;
  font-weight: bold;
  color: var(--theme-text-1);
}

.list-project-task-status-context {
  z-index: 100;
  position: relative;
  left: calc(100% + 15px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 180px;
  height: 240px;
  border-radius: 15px;
  background: var(--theme-back-3);
}

/* .list-project-task[context=true] > .list-project-task-left > .list-project-task-status > .list-project-task-status-context {
  display: flex;
} */

.list-project-task-status-context-fade {
  position: fixed;
  z-index: 99;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  /* opacity: 1.0; */
  /* transition: opacity 100ms; */
}

/* .list-project-task[context=true] > .list-project-task-left > .list-project-task-status > .list-project-task-status-context-fade {
  display: block;
  opacity: 1.0; 
} */
</style>
