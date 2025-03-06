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
import { Project } from 'bolta-tasks-core';

import draggable from 'vuedraggable'

const CurrentTimer = computed(() => {
  return Timers.value[FocusedSession.value?._id]
})

const CurrentProject: ComputedRef<Project | null> = computed(() => {
  let res = null
  if (FocusedSession.value?.project != null && FocusedSession.value?.project != "null") {
    res = Projects.findEntry(FocusedSession.value?.project)
    print("TRIGGERED: ", res)
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

const taskList = ref([])

import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { SubAPI } from '../../sub_api';
const taskQueueEl = useTemplateRef("sortable")
useSortable(taskQueueEl, CurrentProject.value?.tasks, {onUpdate: async (e) => {
  print("erm. ", e.oldIndex, e.newIndex)
  await new SubAPI("projects", CurrentProject.value._id, "tasks").move(e.oldIndex, e.newIndex)
  moveArrayElement(CurrentProject.value?.tasks, e.oldIndex, e.newIndex, e)
}})
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
      <div v-for="(interval, index) in (FocusedSession?.interval || [])" class="interval-dot" :is_current="Timers[FocusedSession?._id]?.current_interval_index == index">
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
    <div id="current-task"></div>
  </div>
  <div id="task-queue-panel" :opened="taskQueueOpened">
    <p id="task-queue-header">Session Tasks</p>
    <div id="task-queue" ref="sortable">
      <div class="task-queue-item" v-for="task in CurrentProject?.tasks">
          <p>{{task.title}}</p>
      </div>
    </div>
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
}

#task-queue-header {
  font-family: 'MontserratBold';
  font-size: 42px;
  color: var(--theme-text-1);
  opacity: 0.5;
}

.task-queue-item {
  width: calc(100% - 30px);
  height: calc(64px - 30px);
  padding: 15px;
  font-family: 'MontserratBold';
  background: var(--theme-back-2);
  border-radius: 15px;
}
</style>
