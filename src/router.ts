import {Ref, ref} from 'vue'
import { CalendarDate, Project } from 'bolta-tasks-core'
import { FocusedDate, FocusedProject, TaskListFilters } from './persist'
import { Task } from 'bolta-tasks-core'
import moment from 'moment'
import EventEmitter from 'eventemitter3';
import { openPlannerTaskPopup } from './popups/new_planner_task'
import { openProjectTaskPopup } from './popups/new_project_task'

export enum Views {
    TASKS,
    PLANNER,
    TIMER,
    SESSIONS,
    SCHEDULES,
    PROJECT_TASKS
}

// TODO: Extent event listenerr
class RouterClass extends EventEmitter {
    current: Ref<Views> = ref(Views.TASKS)
    header: Ref<String> = ref("...")
    addButtonFunc: Ref<() => void> = ref(openPlannerTaskPopup)

    switch(val: Views, header: string, addButtonFunc: () => void = null) {
        this.current.value = val
        this.header.value = header
        if (addButtonFunc) { print("new add button function", addButtonFunc); this.addButtonFunc.value = addButtonFunc }
        // TODO: Somethin' somethin' event here
        this.emit("switch")
    }

    switch_to_date(date: CalendarDate) {
        this.current.value = Views.TASKS
        this.header.value = moment(date).format("ddd MMM Do, YYYY")
        this.addButtonFunc.value = openPlannerTaskPopup

        TaskListFilters.value = [(task: Task) => task.isOnDate(date)]

        FocusedDate.value = date

        // print(FocusedDate.value)

        this.emit("switch")
    }

    switch_to_project(project: Project) {
        this.current.value = Views.PROJECT_TASKS
        this.header.value = project.title
        this.addButtonFunc.value = () => {
            openProjectTaskPopup({project_id: project._id} as any)
        }
        FocusedProject.value = project
        print("new project :) ", FocusedProject.value)

        this.emit("switch")
    }
}

export var Router = new RouterClass()