<script setup lang="ts">
import Header from "./components/Header.vue"
import Sidebar from "./components/Sidebar.vue"

import TaskListView from "./components/views/TaskList.vue"
import PlannerView from "./components/views/Planner.vue"
import FocusTimerView from "./components/views/FocusTimer.vue"
import FocusSessionsView from "./components/views/FocusSessions.vue"
import SchedulesView from "./components/views/Schedules.vue"

import Popups from "./components/Popups.vue"

import {Router, Views} from "./router"
import { CalendarDate_fromDate } from "bolta-tasks-core"
import { computed, onMounted, Ref, ref, useTemplateRef } from "vue"
import { isMobile } from "./persist"
import { MenuItem } from "primevue/menuitem"
import { ContextMenu } from "primevue"
import { openContextMenu, menu, current_items, items_base } from "./contextmenu"

Router.switch_to_date(CalendarDate_fromDate(new Date()))

const this_menu = useTemplateRef("menu")

onMounted(() => {
  let res = this_menu.value
  print("This Menu: ", res)
  menu.value = res
})
</script>

<template>
  <ContextMenu ref="menu" :model="current_items" />
  <div id="inner-app" :mobile="isMobile">
    <Popups></Popups>
    <Sidebar id="sidebar" :mobile="isMobile"></Sidebar>

    <div @contextmenu="event => {openContextMenu(event, items_base, {pingle: 'so true'}, 'Mao!')}" id="right" :mobile="isMobile">
      <Header></Header>

      <div id="main">
        <!-- Views -->
        <TaskListView v-show="Router.current.value == Views.TASKS"></TaskListView>
        <PlannerView v-show="Router.current.value == Views.PLANNER"></PlannerView>
        <FocusTimerView v-show="Router.current.value == Views.TIMER"></FocusTimerView>
        <FocusSessionsView v-show="Router.current.value == Views.SESSIONS"></FocusSessionsView>
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