<script setup lang="ts">
import Header from "./components/Header.vue"
import Sidebar from "./components/Sidebar.vue"

import TaskListView from "./components/views/TaskList.vue"
import PlannerView from "./components/views/Planner.vue"
import FocusSessionView from "./components/views/FocusSession.vue"
import SchedulesView from "./components/views/SchedulesView.vue"

import Popups from "./components/Popups.vue"

import {Router, Views} from "./router"
import { CalendarDate_fromDate } from "bolta-tasks-core"
import { computed, ref } from "vue"
import { isMobile } from "./persist"

Router.switch_to_date(CalendarDate_fromDate(new Date()))

const elem = ref()

// const zoom = computed(() => {
//   let isMobile = (elem.value.getAttribute("mobile") == "true")
//   return (isMobile ? 0.4 : 1.0) // please?
// })
</script>

<template>
  <div id="inner-app" ref="ref" :mobile="isMobile">
    <Popups></Popups>
    <Sidebar id="sidebar" :mobile="isMobile"></Sidebar>

    <div id="right" :mobile="isMobile">
      <Header></Header>

      <div id="main">
        <!-- Views -->
        <TaskListView v-show="Router.current.value == Views.TASKS"></TaskListView>
        <PlannerView v-show="Router.current.value == Views.PLANNER"></PlannerView>
        <FocusSessionView v-show="Router.current.value == Views.FOCUS"></FocusSessionView>
        <SchedulesView v-show="Router.current.value == Views.SCHEDULES"></SchedulesView>
      </div>
    </div>
  </div>
</template>

<style scoped>
#inner-app {
  width: calc(100% - (var(--gap) * 2));
  height: calc(100% - (var(--gap) * 2));
  display: flex;
  flex-direction: row;
  gap: var(--gap);
  padding: var(--gap);
}

#inner-app[mobile=true] {
  width: 100%;
  height: 100%;
  zoom: 0.4;
  padding: 0px;
}

#right {
  width: calc(100% - ((var(--sidebar-width) * var(--sidebar-opened)) + var(--gap)));
  /* width: 100%; */
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

#right[mobile=true] { --sidebar-opened: 0 }
#right[mobile=false] { --sidebar-opened: 1 }

#main {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>