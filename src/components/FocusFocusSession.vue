<script setup lang="ts">
import { FocusSession } from 'bolta-tasks-core';
import { focus_session_items, openContextMenu } from '../contextmenu';

const props = defineProps<{
  focus_session: FocusSession
}>()
</script>

<template>
<div class="focus-session-button" @contextmenu="event => {openContextMenu(event, focus_session_items, focus_session, focus_session.title)}" @click="console.log(`wow!`)">
  <p class="focus-session-header">{{ props.focus_session.title }}</p>
</div>
</template>

<style scoped>
.focus-session-button {
    width: calc(100% - 40px);
    height: calc(80px - 40px);
    background-color: var(--theme-back-2);
    border-radius: 20px;
    padding: 20px;
    vertical-align: middle;
    display: flex;
    align-items: center;
}

.focus-session-header {
    font-family: "MontserratBold";
    font-size: 30px;
    margin: 0px;
}
</style>
