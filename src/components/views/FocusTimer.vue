<script setup lang="ts">
import { computed, ComputedRef, ref, triggerRef, useTemplateRef } from 'vue';
import { FocusedSession, MouseMover } from '../../persist';
import { parseDurationString } from '../../time';
import { Timers } from '../../timer_manager';

import PlayIcon from "../../assets/icons/play.vue"
import PauseIcon from "../../assets/icons/pause.vue"
import ResetIcon from "../../assets/icons/reset.vue"
import NextIcon from "../../assets/icons/next.vue"
import BackIcon from "../../assets/icons/back.vue"
import { APIWatcher, Projects } from '../../api';
import { CleanTaskStatuses, Project, ProjectTask, ProjectTaskStatic, TaskStatus, TaskStatuses } from 'bolta-tasks-core';

const CurrentTimer = computed(() => {
  return Timers.value[FocusedSession.value?._id]
})

const taskList = ref([])

const CurrentProject: ComputedRef<Project | null> = computed(() => {
  let res = null
  if (FocusedSession.value?.project != null && FocusedSession.value?.project != "null") {
    res = Projects.findEntry(FocusedSession.value?.project)
    print("TRIGGERED: ", res)
  }

  if (res) { print(res.tasks); taskList.value = res.tasks }

  return res
})

const CurrentTask: ComputedRef<ProjectTask | null> = computed(() => {
  let res = null
  if (CurrentProject.value != null && CurrentProject.value.current_tasks.length > 0) {
    res = CurrentProject.value.current_tasks[0]
  }

  return res
})

// APIWatcher.on("refresh", () => {
//   triggerRef(CurrentProject)
//   // taskList.value = CurrentProject.value?.tasks
//   // triggerRef(taskList)
// })

const time_remaining = ref("0:00")
const time_perc = ref(1.0)

function lerp( a: number, b: number, alpha: number ) {
 return a + alpha * ( b - a )
}

function updateTimestamp() {
  time_remaining.value = parseDurationString(Timers.value[FocusedSession.value?._id]?.time_remaining || 0, true)
  time_perc.value = (lerp(time_perc.value, CurrentTimer.value?.perc, 0.25) || 0.0)
  requestAnimationFrame(updateTimestamp)
}

updateTimestamp()

function startButton() {
  print(parseDurationString(Timers.value[FocusedSession.value?._id]?.time_remaining || 0, true))
}

const timeline = useTemplateRef("timeline")
const wasPlaying = ref(false)
const dragging = ref(false)

function seekTimeline(e: PointerEvent) {
  if (dragging.value) {
    let timelineElem = timeline.value
    let timelineRect = timelineElem.getBoundingClientRect()
    let perc = ((e.clientX - (timelineRect.x + 12)) / (timelineRect.width - 24))
    let clamped = Math.max(Math.min(perc, 1), 0)
    // print(clamped)
    CurrentTimer.value?.seek(CurrentTimer.value?.current_interval.duration * clamped)
    return clamped
  }
}

MouseMover.on("mousemove", seekTimeline)

document.addEventListener("pointerup", e => {
  if (dragging.value) {
    dragging.value = false
    if (wasPlaying.value) {CurrentTimer.value?.start()}
  }
})

const taskQueueOpened = ref(true)

import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { SubAPI } from '../../sub_api';
const taskQueueEl = useTemplateRef("sortable")
useSortable(taskQueueEl, taskList.value, {onUpdate: async (e) => {
  print("erm. ", e.oldIndex, e.newIndex)
  moveArrayElement(taskList.value, e.oldIndex, e.newIndex, e)
  await new SubAPI("projects", CurrentProject.value._id, "tasks").move(e.oldIndex, e.newIndex)
  // moveArrayElement(CurrentProject.value?.tasks, e.oldIndex, e.newIndex, e)
}})

import { openProjectTaskPopup } from '../../popups/new_project_task';
import { openContextMenu, project_task_items } from '../../contextmenu';
import { MenuItem } from 'primevue/menuitem';

async function toggleCompleted(task: ProjectTaskStatic) {
  await new SubAPI("projects", task.project_id, "tasks").edit(task._index, {status: (task.status != TaskStatus.COMPLETED ? TaskStatus.COMPLETED : TaskStatus.NOT_STARTED)})
}

const items_base: ComputedRef<MenuItem[]> = computed(() => {
  return Object.keys(CleanTaskStatuses).map((status_key: string) => {
    return { label: status_key, command: async (event) => {
      let task = event.item.data
      let status: TaskStatus = (CleanTaskStatuses[status_key] as TaskStatus)
      
      print("SETTING TASK TO => ", status)
      await new SubAPI("projects", task.project_id, "tasks").edit(task._index, {status})
    }}
  })
})

</script>

<template>
<div id="focus-timer">
<div id="focus-timer-header">
  <button id="toggle-queue-button" @click="taskQueueOpened = (!taskQueueOpened)">TOGGLE QUEUE!!</button>
</div>
<div id="whole">
  <div id="center">
    <p ref="timestamp" id="timer-stamp">{{ time_remaining }}</p>
    <div id="interval-dots">
      <div v-for="(interval, index) in (FocusedSession?.interval || [])" @click="CurrentTimer.jump(index)" class="interval-dot" :is_current="Timers[FocusedSession?._id]?.current_interval_index == index">
        <p class="interval-dot-header">{{ interval.label }}</p>
        <p class="interval-dot-duration">{{ parseDurationString(interval.duration, true) }}</p>
      </div>
    </div>
    <div ref="timeline" id="timeline" :style="{ '--progress': time_perc * 100 + '%' }"  @pointerdown="e => {dragging = true; wasPlaying = CurrentTimer.running; seekTimeline(e)}"></div>
    <div id="timer-buttons">
      <button class="timer-button" @click="Timers[FocusedSession?._id]?.back()"><BackIcon/></button>
      <button class="timer-button" @click="Timers[FocusedSession?._id]?.reset()"><ResetIcon/></button>
      <button v-if="!Timers[FocusedSession?._id]?.running" class="timer-button" @click="Timers[FocusedSession?._id]?.start(); startButton()"><PlayIcon/></button>
      <button v-if="Timers[FocusedSession?._id]?.running" class="timer-button" @click="Timers[FocusedSession?._id]?.pause()"><PauseIcon/></button>
      <button class="timer-button" @click="Timers[FocusedSession?._id]?.next()"><NextIcon/></button>
    </div>
    <div v-if="CurrentProject != null && CurrentProject.current_tasks.length > 0" id="current-task-container">
      <p id="current-task-header">Current Task:</p>
      <div id="current-task" @contextmenu="event => {openContextMenu(event, items_base, CurrentTask, `Update '${CurrentTask.title}'`)}">
        <p>{{ CurrentTask?.title }}</p>
      </div>
    </div>
  </div>
  <div id="task-queue-panel" :opened="taskQueueOpened && CurrentProject != null">
    <p id="task-queue-header">Session Tasks</p>
    <div id="task-queue" ref="sortable">
      <div class="task-queue-item" v-for="task in taskList" @contextmenu="event => openContextMenu(event, project_task_items, task, task.title)" :status="(() => TaskStatuses[task.status])()">
        <div class="task-queue-item-left">
          <div class="task-queue-item-status" @click="toggleCompleted(task)" @contextmenu="event => {openContextMenu(event, items_base, task, `Update '${task.title}'`)}" :status="(() => TaskStatuses[task.status])()"></div>
        </div>
        <div class="task-queue-item-right">
          <p>{{task.title}}</p>
        </div>
      </div>
    </div>
    <button @click="openProjectTaskPopup({project_id: CurrentProject._id} as any)">ADD TASK :)</button>
  </div>
</div>
</div>
</template>

<style scoped>
#focus-timer{
  height: 100%;
}

#focus-timer-header {
  height: 32px; 
}

#whole {
  width: 100%;
  height: calc(100% - 32px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

#center {
  width: -webkit-fill-available;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
  overflow-x: visible;
}

#toggle-queue-button {
  position: relative;
  top: 0px;
  right: 0px;
}

#timer-stamp {
  font-family: 'MartianMono', monospace;
  font-size: 164px;
  /* width: 1500px; */
  text-align: center;
}

#interval-dots {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.interval-dot {
  font-family: 'MontserratBold';
  display: flex;
  flex-direction: column;
  gap: 0px;
  align-items: center;
  opacity: 0.3;
  transition: 100ms;
}

.interval-dot[is_current="true"] {
  opacity: 1;
}

.interval-dot-duration {
  font-family: 'Montserrat';
  opacity: 0.75;
}

#timeline {
  width: 60%;
  height: 25px;
  border-radius: 30px;
  border: solid var(--theme-back-2) 12px;
  /* background: var(--theme-back-neg); */
  --progress: 25%;
  background: linear-gradient(
    to right,
    var(--theme-accent-1) 0%,
    color-mix(in oklab, var(--theme-accent-2) var(--progress), var(--theme-accent-1)) var(--progress),
    var(--theme-back-1) var(--progress)
  );
  /* margin-top: 24px; */
  /* margin-bottom: 15px; */
}

.timer-button {
  background: none;
  border: none;
}

#current-task-container {
  width: 100%;
}

#current-task-header {
  font-family: 'MontserratBold';
  opacity: 0.5;
  font-size: 48px;
}

#current-task {
  width: calc(100% - 30px);
  height: calc(64px - 30px);
  font-family: 'MontserratBold';
  font-size: 24px;
  background: var(--theme-back-2);
  border-radius: 15px;
  padding: 15px;
}

#task-queue-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 0px;
  height: 100%;
  overflow: hidden;
  transition: 500ms;
  transition-property: width;
}

#task-queue-panel[opened="true"] { width: 500px }

#task-queue {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: scroll;
}

#task-queue-header {
  font-family: 'MontserratBold';
  font-size: 42px;
  color: var(--theme-text-1);
  opacity: 0.5;
}

.task-queue-item {
  display: flex;
  width: calc(100% - 30px);
  height: calc(80px - 30px);
  min-height: calc(80px - 30px);
  padding: 15px;
  font-family: 'MontserratBold';
  font-size: 24px;
  background: var(--theme-back-2);
  border-radius: 15px;
  align-items: center;
}

.task-queue-item[status="COMPLETED"] { opacity: 0.1 }
.task-queue-item[status="SKIPPED"] { opacity: 0.1 }
.task-queue-item[status="FAILED"] { opacity: 0.1 }

.task-queue-item-left {
  min-width: 80px;
  width: 80px;
  min-height: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-queue-item-status {
  width: calc(80% - 30px);
  height: calc(80% - 30px);
  min-height: calc(80% - 30px);
  margin-left: -30px;
  /* margin-top: -30px; */
  background: var(--theme-back-3);
  border-radius: 50%;
  border: 15px var(--theme-back-1) solid;
}

.task-queue-item-status[status="COMPLETED"] { background: var(--theme-positive) }
.task-queue-item-status[status="IN_PROGRESS"] { background: var(--theme-waiting) }
.task-queue-item-status[status="SKIPPED"] { background: var(--theme-skipped) }
.task-queue-item-status[status="FAILED"] { background: var(--theme-danger) }
</style>
