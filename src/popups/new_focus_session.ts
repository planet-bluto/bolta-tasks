import moment from "moment";
import { HeaderPopupElement, TextPopupInput, ClockTimePopupInput, DurationPopupInput, MultiPopupInput, CardPopupInput, CalendarDatePopupInput, NumberPopupInput, MultiSelectPopupInput, WeekPopupInput, SelectPopupInput, DateTimePopupInput, SubmitPopupButton, CheckboxPopupInput, PopupDriver } from '../popups';
import { InstanceRuleType, Weekdays, ReminderType, CleanProjectStatuses, ProjectStatus, FocusTimerSegmentType } from "bolta-tasks-core";
import { Project, ProjectStatic } from "bolta-tasks-core";
import { FocusSessions, Projects } from "../api";
import { FocusSessionStatic } from '../../../bolta-tasks-core/src/models/focus_session';
import { FocusSession } from "bolta-tasks-core";

const _ = null // best

const MonthSelectPopupTemplate = {
    "January": 0,
    "February": 1,
    "March": 2,
    "April": 3,
    "May": 4,
    "June": 5,
    "July": 6,
    "August": 7,
    "October": 8,
    "September": 9,
    "November": 10,
    "December": 11,
}

function ProjectsSelectPopupInput() {
    let options = {"None": null}

    Projects.value.forEach(project => {
        options[`${project.title} (#${project._id})`] = project._id
    })

    return (new SelectPopupInput(_, "project", options, 0))
}

export const NewFocusSessionPopup = (context: "New" | "Edit" | "Clone" = "New") => [
    [new HeaderPopupElement(context + " Focus Session")],
    [new TextPopupInput("Title", "title")],
    [ProjectsSelectPopupInput()],
    [new MultiPopupInput("Interval", "interval", [], () => ({
        [FocusTimerSegmentType.ACTIVE]: {label: "Active", input: () => new CardPopupInput(_, _, _, (() => [
            [new HeaderPopupElement("Active")],
            [new DurationPopupInput("Duration", "duration")],
        ]))},
        [FocusTimerSegmentType.BREAK]: {label: "Break", input: () => new CardPopupInput(_, _, _, (() => [
            [new HeaderPopupElement("Break")],
            [new DurationPopupInput("Duration", "duration")],
        ]))},
    }))],
    [new DurationPopupInput("Time Limit", "time_limit")],
    [new SubmitPopupButton()],
]

export function openFocusSessionPopup(focus_session: FocusSession = null, newAnyway = false) {
  let input_focus_session = focus_session
  let {html_elems, inputs} = PopupDriver.open(NewFocusSessionPopup((newAnyway ? "Clone" : (focus_session?._id != null ? "Edit" : "New"))), input_focus_session, async (data: FocusSessionStatic) => {
    // let new_schedule = new Schedule(data)
    if (newAnyway) {
      delete input_focus_session["_id"]
    }
    
    if (data._id) {
        FocusSessions.edit(data._id, data)
    } else {
        FocusSessions.add(data)
    }
  })
}