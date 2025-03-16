// import moment from "moment"
// import { Reminder } from "./models/reminder"
// import { PlannerTask, ProjectTask, Task } from "./models/task"
import { Task } from "bolta-tasks-core"
// import { PlannerTasks, Schedules } from "./api"
// import { CalendarDate_fromDate, CalendarDate_isEqual, ClockTime, ClockTime_fromDate, ClockTime_isEqual, DateTime_toTimestamp, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, ReminderMetaOnce, ReminderMetaRelative, ReminderMetaTime, ReminderType, Weekdays } from "./types"
// import { Interval } from "./interval"
import { NotificationHandler } from "./notifications"
import { socket } from "./socket"

// Interval.on("minute", reminderCheck)

export async function reminderCheck(thisTimestamp: number) {
  print("Checking reminders... sike.")
  // await PlannerTasks._refresh()
  // await Schedules._refresh()

  // let firedTasks: Task[] = remindingTasks(PlannerTasks.value, thisTimestamp)

  // if (firedTasks.length > 0) {
  //   fireReminder(firedTasks)
  // } 
  // return firedTasks
}


// function fireReminder(payload) {
//   print(`Firing Reminder: ${payload.title}`)
// }

// debugging
declare global {
  var reminderCheck: (thisTimestamp: number) => void;
  interface Window { reminderCheck: (thisTimestamp: number) => void; }
}

window.reminderCheck = reminderCheck

// export {} 