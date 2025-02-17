// import moment from "moment"
// import { Reminder } from "./models/reminder"
// import { PlannerTask, ProjectTask, Task } from "./models/task"
import { Task, remindingTasks } from "bolta-tasks-core"
import { PlannerTasks, Schedules } from "./api"
// import { CalendarDate_fromDate, CalendarDate_isEqual, ClockTime, ClockTime_fromDate, ClockTime_isEqual, DateTime_toTimestamp, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, ReminderMetaOnce, ReminderMetaRelative, ReminderMetaTime, ReminderType, Weekdays } from "./types"
// import { Interval } from "./interval"
import { NotificationHandler } from "./notifications"

// Interval.on("minute", reminderCheck)

export async function reminderCheck(thisTimestamp: number) {
  print("Checking reminders...")
  await PlannerTasks._refresh()
  await Schedules._refresh()

  let firedTasks: Task[] = remindingTasks(PlannerTasks.value, thisTimestamp)

  if (firedTasks.length > 0) {
    fireReminder(firedTasks)
  } 
  return firedTasks
}


function fireReminder(tasks: Task[]) {
  print(`Firing Reminder for ${tasks.map(task => `'${task.title}'`).join(", ")}`)

  NotificationHandler.value.fire({
    title: `Reminder for ${tasks.length} task${(tasks.length > 1 ? "s" : "")}`,
    body: `Reminder${(tasks.length > 1 ? "s" : "")} for ${tasks.map(task => task.title).join(", ")}`
  })
}

// debugging
declare global {
  var reminderCheck: (thisTimestamp: number) => void;
  interface Window { reminderCheck: (thisTimestamp: number) => void; }
}

window.reminderCheck = reminderCheck

// export {} 