import { Ref, ref } from "vue";
import { FetchedEvent, FocusSessions } from "./api";
import { FocusTimer } from "./timer";

export const Timers: Ref<{[session_id: string]: FocusTimer}> = ref({})

FetchedEvent.on("fetched", () => {
  FocusSessions.value.forEach(session => {
    if (!Timers.value[session._id]) {
      Timers.value[session._id] = new FocusTimer(session._id)
    }
  })

  Object.keys(Timers.value).forEach(key => {
    if (!FocusSessions.value.find(session => session._id == key)) {
      delete Timers.value[key]
    }
  })
})