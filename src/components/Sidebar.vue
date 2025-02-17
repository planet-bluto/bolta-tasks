<script setup lang="ts">
import moment from 'moment';

import SidebarButton from "./SidebarButton.vue"
import Calendar from "./Calendar.vue"
import { currMonth, currYear, sidebarOpened, isMobile } from '../persist';

import {Router, Views} from "../router"
import { openSchedulePopup } from '../popups/new_schedule';
import { ref } from 'vue';

</script>

<template>
<div id="sidebar" :mobile="isMobile" :opened="sidebarOpened">
    <button id="sidebar-button" v-if="isMobile" @click="sidebarOpened = false"><</button>
    <h1 id="calendar-month-header">{{ moment({month: currMonth, year: currYear}).format("MMMM, YYYY") }}</h1>
    <Calendar></Calendar>
    <!-- <SidebarButton label="TaskList" :func="() => { Router.switch(Views.TASKS, `TaskListView`) }" /> -->
    <SidebarButton label="Planner" :func="() => { Router.switch(Views.PLANNER, `Planner`) }" />
    <SidebarButton label="Focus" :func="() => { Router.switch(Views.FOCUS, `Focus Session`) }" />
    <SidebarButton label="Projects" :func="() => { Router.switch(Views.FOCUS, `Projects`) }" />
    <SidebarButton label="Schedules" :func="() => { Router.switch(Views.SCHEDULES, `Schedules`, openSchedulePopup) }" />
</div>
</template>

<style scoped>
#sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    width: var(--sidebar-width);
    height: 100%;
    overflow: hidden;
}

#sidebar[mobile=true] {
    position: absolute;
    z-index: 2;
    background-color: var(--theme-back-1);
    transition: 500ms;
    transition-property: width;
}

#sidebar[mobile=true][opened=false] {
    width: 0px;
}

#sidebar[mobile=true][opened=true] {
    width: var(--sidebar-width);
}

#calendar-month-header {
    width: 100%;
    text-align: center;
    font-family: "MontserratBold";
}

#sidebar-button {
    background-color: var(--theme-back-2);
    font-family: "MontserratExtraBold";
    font-size: 64px;
    width: 64px;
    height: 64px;
}
</style>
