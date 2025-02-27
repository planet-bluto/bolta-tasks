import { HeaderPopupElement, TextPopupInput, DateTimePopupInput, SubmitPopupButton, CheckboxPopupInput, PopupDriver, SelectPopupInput } from '../popups';
import { Project, ProjectStatic, ProjectTask, ProjectTaskStatic, TaskStatus } from "bolta-tasks-core";
import { API_ENDPOINT, Projects } from "../api";
import { SubAPI } from '../sub_api';

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
    let options = {}

    Projects.value.forEach(project => {
        options[`${project.title} (#${project._id})`] = project._id
    })

    return (new SelectPopupInput(_, "project_id", options, 0))
}

export const NewProjectTaskPopup = (context: "New" | "Edit" | "Clone" = "New") => [
    [new HeaderPopupElement(context + " Project Task")],
    [new TextPopupInput("Title", "title")],
    [ProjectsSelectPopupInput()],
    [new DateTimePopupInput("Due", "due")],
    [new SubmitPopupButton()],
]

interface InputProjectTaskStatic extends ProjectTaskStatic {
  project: string;
}

export function openProjectTaskPopup(task: InputProjectTaskStatic = null, newAnyway = false) {
  let input_task = task
  print("INPUT: ", input_task)

  let mode: "New" | "Edit" | "Clone" = (newAnyway ? "Clone" : (task?._index != null ? "Edit" : "New")) 

  let {html_elems, inputs} = PopupDriver.open(NewProjectTaskPopup(mode), input_task, async (data: InputProjectTaskStatic) => {
    // let new_schedule = new Schedule(data)
    if (newAnyway) {
      delete input_task["_id"]
    }

    print("DATA: ", data)

    let project_id = data.project_id
    let index = data._index
    
    // Save to API SOMEHOW???
    if (index != null) {
        // Projects.edit(data._id, data)
        await new SubAPI("projects", project_id, "tasks").edit(index, data)
    } else {
        // Projects.add(data)
        await new SubAPI("projects", project_id, "tasks").insert(data)
    }
  })

  if (mode != "New") {
    (inputs["project_id"].children[1] as HTMLSelectElement).disabled = true
  }
}