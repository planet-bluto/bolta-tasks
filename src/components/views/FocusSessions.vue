<script setup lang="ts">
import { computed } from 'vue';
import FocusProject from '../FocusProject.vue';
import { FocusSessions, Projects } from '../../api';
import { CalendarDate_fromDate, Project } from 'bolta-tasks-core';
import { openFocusSessionPopup } from '../../popups/new_focus_session';
import FocusFocusSession from '../FocusFocusSession.vue';

const assignedProjects = computed(() => {
  return Projects.value.filter((project: Project) => project.isOnDate(CalendarDate_fromDate(new Date())))
})
const unassignedProjects = computed(() => {
  return Projects.value.filter((project: Project) => !project.isOnDate(CalendarDate_fromDate(new Date())))
})
</script>

<template>
<div id="focus-sessions-view">
  <div id="header-area">
    <div id="header-left-area">
      <button id="new-taskless-button" @click="event => {openFocusSessionPopup()}">+ Taskless Focus Session</button>
    </div>
    <div id="header-right-area">
      <p id="header-right-text">🕗 Previous Sessions</p>
    </div>
  </div>
  <div id="main-area">
    <div id="main-left-area">
      <div class="flexer" v-show="assignedProjects.length > 0">
        <FocusProject v-for="project in assignedProjects" :project="project" />
        <div id="main-left-area-div"></div>
      </div>
      <div class="flexer">
        <FocusProject v-for="project in unassignedProjects" :project="project" />
      </div>
    </div>
    <div class="flexer" id="main-right-area">
      <FocusFocusSession v-for="focus_session in FocusSessions.value" :focus_session="focus_session" />
    </div>
  </div>
</div>
</template>

<style scoped>
#focus-sessions-view {
  display: flex;
  gap: 45px;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#header-area {
  display: flex;
  gap: 100px;
  width: 100%;
  height: 100px;
}

#header-left-area {
  /* background-color: green; */

  width: 100%;
  height: 100%;
}

#new-taskless-button {
  width: 100%;
  height: 100%;
  border-radius: 30px;
  background: var(--theme-back-4);
  border: var(--theme-back-3) 15px solid;
  font-size: 35px;
  font-family: "MontserratExtraBold";
  text-align: left;
  color: var(--theme-back-1);
}

#header-right-area {
  /* background-color: cyan; */

  width: 100%;
  height: 100%;

  text-align: left;
  align-content: center;
}

#header-right-text {
  font-family: "MontserratExtraBold";
  font-size: 35px;
  margin: 0px;
  font-style: italic;
  opacity: 0.5;
}

.flexer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

#main-area {
  display: flex;
  flex-direction: row;
  gap: 100px;
  width: 100%;
  height: calc(100% - 100px - 45px);
}

#main-left-area {
  /* background-color: green; */

  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;

  overflow-y: scroll;

  padding-right: 20px;
}

#main-left-area-div {
  width: calc(100% - (20px * 2));
  height: 15px;
  background-color: white;
  opacity: 0.05;
  border-radius: 15px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 30px;
  margin-bottom: 45px;
}

#main-right-area {
  /* background-color: cyan; */

  width: 100%;
  height: 100%;

  overflow-y: scroll;

  padding-right: 20px;
}
</style>
