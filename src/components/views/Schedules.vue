<script setup lang="ts">
import { Schedule } from 'bolta-tasks-core';
import { Schedules } from '../../api';
import ListSchedule from '../ListSchedule.vue';

import { openContextMenu, schedule_items } from '../../contextmenu';

</script>

<template>
<div>
  <div class="schedule-view">
    <ListSchedule v-for="schedule in Schedules.value" :schedule="(schedule as Schedule)" @contextmenu="event => openContextMenu(event, schedule_items, schedule, schedule.title)"></ListSchedule>
  </div>
</div>
</template>

<style scoped>
.schedule-view {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
