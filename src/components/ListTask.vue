<script setup lang="ts">
import { PlannerTask, PlannerTaskDated, Task } from 'bolta-tasks-core';
import { FocusedDate } from '../persist';
import { PlannerTasks } from "../api";
// import { PopupDriver } from '../popups';
// import { PlannerTaskContextPopup } from '../popups/task_context';

import moment from 'moment';

import ListTaskBean from './ListTaskBean.vue';
// import ReminderBean from './ReminderBean.vue';
import { parseDurationString } from '../time';
import { computed, ComputedRef } from 'vue';
import { CalendarDate_toString, CleanTaskStatuses, TaskStatus, TaskStatuses } from 'bolta-tasks-core';
import { MenuItem } from 'primevue/menuitem';
// import { computed } from 'vue';
import { openContextMenu } from '../contextmenu';

const props = defineProps<{
    task: PlannerTask;
}>()


let datedTaskMoment = ((key: "time_start" | "time_due") => {
  let cloned_date = JSON.parse(JSON.stringify(FocusedDate.value))
  let taskOnDate = (props.task.onDate(cloned_date) as PlannerTaskDated)
  // print("DATE: ", "\n\ncloned_date: ", cloned_date, "\n\nprops.task: ", props.task, "\n\ntaskOnDate: ", taskOnDate)
  if (taskOnDate) {
    let obj = Object.assign(cloned_date, taskOnDate[key])
    return moment(obj)
  } else {
    return moment()
  }
})

const getStatus = computed(() => {
  let {task} = props
  return TaskStatuses[(task as PlannerTask).statusOnDate(FocusedDate.value)]
})

const getState = computed(() => {
  let {task} = props
  return (task as PlannerTask).stateOnDate(FocusedDate.value)
})

// function openTaskContextMenu(event: MouseEvent) {
//   event.preventDefault();
//   console.log('Task context menu opened');
//   let {task} = props
//   if (task.type == 'planner') {
//     PopupDriver.open(PlannerTaskContextPopup(task as PlannerTask))
//   }
// }

async function toggleCompleted(e: MouseEvent) {
  e.preventDefault()
  let {task} = props
  print(task.status)
  let cloned_status = JSON.parse(JSON.stringify(task.status || {}))
  if (cloned_status[CalendarDate_toString(FocusedDate.value)] == TaskStatus.COMPLETED) {
    cloned_status[CalendarDate_toString(FocusedDate.value)] = TaskStatus.NOT_STARTED
  } else {
    cloned_status[CalendarDate_toString(FocusedDate.value)] = TaskStatus.COMPLETED
  }

  await PlannerTasks.edit(task._id, {status: cloned_status})

  print("Task status updated...")
}

const items_base: ComputedRef<MenuItem[]> = computed(() => {
  return Object.keys(CleanTaskStatuses).map((status_key: string) => {
    return { label: status_key, command: async () => {
      let status: TaskStatus = (CleanTaskStatuses[status_key] as TaskStatus)

      let cloned_status = JSON.parse(JSON.stringify(props.task.status || {}))
      cloned_status[CalendarDate_toString(FocusedDate.value)] = status
      
      await PlannerTasks.edit(props.task._id, {status: cloned_status})
    }}
  })
})
</script>

<template>
<div class="list-task">
  <div class="list-task-state-indicator-container">
    <div class="list-task-state-indicator" :state="getState"></div>
  </div>
  <div class="list-task-left">
    <div @click="toggleCompleted" @contextmenu="event => {openContextMenu(event, items_base, null, `Update '${props.task.title}'`)}" class="list-task-status" :status="getStatus"></div>
  </div>
  <div class="list-task-right">
    <div class="list-task-right-top">
      <p class="list-task-title">{{ task.title }}</p>
    </div>
    <div class="list-task-right-bottom">
      <ListTaskBean :text="`At: ${datedTaskMoment('time_start').format('h:mm A')}`"></ListTaskBean>
      <ListTaskBean :text="`Due: ${datedTaskMoment('time_due').format('h:mm A')}`"></ListTaskBean>
      <ListTaskBean :text="`About: ${parseDurationString((task.onDate(FocusedDate) as PlannerTaskDated).duration)}`"></ListTaskBean>
    </div>
  </div>
</div>
</template>

<style scoped>

.list-task {
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

.list-task:hover {
  opacity: 1;
}

.list-task-right {
  width: calc(100% - 100px - 15px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-task-right-bottom {
  display: flex;
  gap: 8px;
}

.list-task-left {
  min-width: 100px;
  width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-task-status {
  width: calc(80% - 30px);
  height: calc(80% - 30px);
  background: var(--theme-back-3);
  border-radius: 15px;
  border: 15px var(--theme-back-1) solid;
}

.list-task-status[status="COMPLETED"] { background: var(--theme-positive) }
.list-task-status[status="IN_PROGRESS"] { background: var(--theme-waiting) }
.list-task-status[status="SKIPPED"] { background: var(--theme-skipped) }
.list-task-status[status="FAILED"] { background: var(--theme-danger) }

.list-task-state-indicator-container {
  width: 0px;
  height: 0px;
}

.list-task-state-indicator {
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

.list-task-state-indicator[state="TODO"] {
  display: flex;
  background: var(--theme-accent-1);
  animation-name: pinging;
  animation-duration: 750ms;
  animation-iteration-count: infinite;
  /* animation-timing-function: linear; */
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-direction: alternate;
}
.list-task-state-indicator[state="OVERDUE"] {
  display: flex;
  background: var(--theme-danger);
  animation-name: pinging;
  animation-duration: 250ms;
  animation-iteration-count: infinite;
  /* animation-timing-function: linear; */
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation-direction: alternate;
}

.list-task-title {
  font-size: 35px;
  font-weight: bold;
  color: var(--theme-text-1);
}

.list-task-status-context {
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

/* .list-task[context=true] > .list-task-left > .list-task-status > .list-task-status-context {
  display: flex;
} */

.list-task-status-context-fade {
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

/* .list-task[context=true] > .list-task-left > .list-task-status > .list-task-status-context-fade {
  display: block;
  opacity: 1.0; 
} */
</style>