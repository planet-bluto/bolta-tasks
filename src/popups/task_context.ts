import { PlannerTask, Task } from "bolta-tasks-core";
import { PlannerTasks } from "../api";
import { PopupButton, PopupDriver } from "../popups";
import { openPlannerTaskPopup } from "./new_task";

export const PlannerTaskContextPopup = (task: PlannerTask) => [
  [new PopupButton("Edit", () => {openPlannerTaskPopup(task)})],
  [new PopupButton("Clone", () => {openPlannerTaskPopup(task, true)})],
  [new PopupButton("Delete", () => {PlannerTasks.delete(task._id); PopupDriver.close()})],
]