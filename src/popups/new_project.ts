import moment from "moment";
import { HeaderPopupElement, TextPopupInput, ClockTimePopupInput, DurationPopupInput, MultiPopupInput, CardPopupInput, CalendarDatePopupInput, NumberPopupInput, MultiSelectPopupInput, WeekPopupInput, SelectPopupInput, DateTimePopupInput, SubmitPopupButton, CheckboxPopupInput, PopupDriver } from '../popups';
import { InstanceRuleType, Weekdays, ReminderType, CleanProjectStatuses, ProjectStatus } from "bolta-tasks-core";
import { Project, ProjectStatic } from "bolta-tasks-core";
import { Projects } from "../api";

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

function instanceRuleMake(elements: any[]) {
    elements.push([new CheckboxPopupInput("Invert Rule", "inverse", false)])
    return (() => elements)
}

export const NewProjectPopup = (context: "New" | "Edit" | "Clone" = "New") => [
    [new HeaderPopupElement(context + " Project")],
    [new TextPopupInput("Title", "title")],
    [new MultiPopupInput("Rules", "rules", [], () => ({
        [InstanceRuleType.SINGLE]: {label: "Once", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Once")],
            [new CalendarDatePopupInput("Date", "date")],
        ]))},
        [InstanceRuleType.DAY]: {label: "Days", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Daily")],
            [new CalendarDatePopupInput("Starting on", "from")],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
        [InstanceRuleType.WEEK]: {label: "Week", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Weekly")],
            [new MultiSelectPopupInput("", "weekdays", Weekdays)],
            [new WeekPopupInput("Starting On", "from", {week: moment().week(), year: moment().year()})],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
        [InstanceRuleType.MONTH]: {label: "Month", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Monthly")],
            [new NumberPopupInput("Day", "day", 1, 1, 31)],
            [new CardPopupInput("Starting On", "from", [], () => [
                [new SelectPopupInput("Month", "month", MonthSelectPopupTemplate, moment().month(), "number"), new NumberPopupInput("Year", "year", moment().year(), 1970, 3070)]
            ])],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
        [InstanceRuleType.YEAR]: {label: "Year", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Yearly")],
            [new SelectPopupInput("Month", "month", MonthSelectPopupTemplate, moment().month(), "number"), new NumberPopupInput("Day", "day", moment().day(), 1, 31)],
            [new NumberPopupInput("Starting On", "from", moment().year(), 1970, 3070)],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
    }))],
    [new SelectPopupInput("Status", "status", CleanProjectStatuses, ProjectStatus.ACTIVE, "number")],
    [new SubmitPopupButton()],
]

export function openProjectPopup(project: Project = null, newAnyway = false) {
  let input_project = project
  let {html_elems, inputs} = PopupDriver.open(NewProjectPopup((newAnyway ? "Clone" : (project?._id != null ? "Edit" : "New"))), input_project, async (data: ProjectStatic) => {
    // let new_schedule = new Schedule(data)
    if (newAnyway) {
      delete input_project["_id"]
    }
    
    if (data._id) {
        Projects.edit(data._id, data)
    } else {
        Projects.add(data)
    }
  })
}