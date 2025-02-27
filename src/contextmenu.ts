import { MenuItem } from "primevue/menuitem"
import { Ref, ref } from "vue";
import { openSchedulePopup } from "./popups/new_schedule";
import Schedules from "./components/views/Schedules.vue";
import { FocusSessions, PlannerTasks, Projects } from "./api";
import { openProjectPopup } from "./popups/new_project";
import { openPlannerTaskPopup } from "./popups/new_planner_task";
import { openFocusSessionPopup } from "./popups/new_focus_session";
import { openProjectTaskPopup } from "./popups/new_project_task";
import { SubAPI } from "./sub_api";
import { ProjectTask } from "bolta-tasks-core";

export const menu = ref();
export const items_base: MenuItem[] = [
    { label: 'Edit', command: (event) => {
      let {data} = event.item
      print(data.pingle)
    }},
    { label: 'Clone' },
    { label: 'Delete', command: (event) => {
      // Schedules.delete(focusedSchedule.value._id)
    }},
]
export const current_items: Ref<MenuItem[]> = ref(items_base);

export function openContextMenu(event: MouseEvent, items: MenuItem[], data: any = null, header: string | null = null) {
  // print(menu)
  let new_items = items.map(item => {
    item["data"] = data
    return item
  })

  if (header != null) {
    new_items = ([{label: header, disabled: true, class: `contextmenu-header`}, {separator: true}] as MenuItem[]).concat(new_items)
  }

  current_items.value = new_items
  menu.value.show(event)
}


//// Generic Task Context Menu ////
export const task_items: MenuItem[] = [
  { label: 'Edit', command: (event) => {
    let task = event.item.data
    if (task.type == "planner") {
      openPlannerTaskPopup(task)
    }
  }},
  { label: 'Clone', command: (event) => {
    let task = event.item.data
    if (task.type == "planner") {
      openPlannerTaskPopup(task, true)
    }
  }},
  { label: 'Delete', command: (event) => {
    // print(focusedTask.value)
    let task = event.item.data
    if (task.type == "planner") {
      PlannerTasks.delete(task._id)
    }
  }},
]

//// Generic Schedule Context Menu ////
export const schedule_items: MenuItem[] = [
  { label: 'Edit', command: (event) => {
    let schedule = event.item.data
    openSchedulePopup(schedule)
  }},
  { label: 'Clone', command: (event) => {
    let schedule = event.item.data
      openSchedulePopup(schedule, true)
  }},
  { label: 'Delete', command: (event) => {
    let schedule = event.item.data
    Schedules.delete(schedule._id)
  }},
]

//// Generic Project Context Menu ////
export const project_items: MenuItem[] = [
  { label: 'Edit', command: (event) => {
    let project = event.item.data
    openProjectPopup(project)
  }},
  { label: 'Clone', command: (event) => {
    let project = event.item.data
      openProjectPopup(project, true)
  }},
  { label: 'Delete', command: (event) => {
    let project = event.item.data
    Projects.delete(project._id)
  }},
]

//// Generic Project Task Context Menu ////
export const project_task_items: MenuItem[] = [
  { label: 'Edit', command: (event) => {
    let task = event.item.data
    openProjectTaskPopup(task)
  }},
  { label: 'Clone', command: (event) => {
    let task = event.item.data
    openProjectTaskPopup(task, true)
  }},
  { label: 'Delete', command: (event) => {
    let task: ProjectTask = event.item.data
    new SubAPI("projects", task.project_id, "tasks").remove(task._index)
    // Projects.delete(project._id)
  }},
]

//// Generic Focus Session Context Menu ////
export const focus_session_items: MenuItem[] = [
  { label: 'Edit', command: (event) => {
    let focus_session = event.item.data
    openFocusSessionPopup(focus_session)
  }},
  { label: 'Clone', command: (event) => {
    let focus_session = event.item.data
    openFocusSessionPopup(focus_session, true)
  }},
  { label: 'Delete', command: (event) => {
    let focus_session = event.item.data
    FocusSessions.delete(focus_session._id)
  }},
]