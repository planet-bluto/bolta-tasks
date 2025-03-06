import {Ref, ref} from 'vue'
import { CalendarDate, FocusSession, Project } from 'bolta-tasks-core'
import moment from 'moment';
import EventEmitter from 'eventemitter3';

export const currMonth = ref(Number(moment().get("month")))
export const currYear = ref(Number(moment().get("year")))
export const sidebarOpened = ref(false)
export const isMobile = ref(false)

export var TaskListFilters: Ref<Function[]> = ref([])
export var FocusedDate: Ref<CalendarDate | null> = ref(null)
export var FocusedProject: Ref<Project | null> = ref(null)
export var FocusedSession: Ref<FocusSession | null> = ref(null)

class MouseMoverClass extends EventEmitter {
  constructor() {
    super()
  }
}
export const MouseMover = new MouseMoverClass()

document.onmousemove = e => {
  MouseMover.emit("mousemove", e)
}