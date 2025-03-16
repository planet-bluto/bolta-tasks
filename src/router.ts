import {Ref, ref} from 'vue'
import { CalendarDate, FocusSession, Project } from 'bolta-tasks-core'
import { FocusedDate, FocusedProject, FocusedProjectID, FocusedSession, TaskListFilters } from './persist'
import { Task } from 'bolta-tasks-core'
import moment from 'moment'
import EventEmitter from 'eventemitter3';
import { openPlannerTaskPopup } from './popups/new_planner_task'
import { openProjectTaskPopup } from './popups/new_project_task'
import { openFocusSessionPopup } from './popups/new_focus_session'

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
        FocusedProjectID.value = project._id
        print("new project :) (agony)", FocusedProject.value)

        this.emit("switch")
    }

    switch_to_focus_session(focus_session: FocusSession) {
        this.current.value = Views.TIMER
        this.header.value = focus_session.title
        this.addButtonFunc.value = () => {
            openFocusSessionPopup()
        }
        FocusedSession.value = focus_session
        print("new project :) (agony)", FocusedSession.value)

        this.emit("switch")
    }
}

export var Router = new RouterClass()