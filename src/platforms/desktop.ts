import { Interval } from "../interval";
import { NotificationHandler, NotificationHandlerBase, NotificationPayload } from "../notifications";
import { reminderCheck } from "../reminders";
import { socket } from "../socket";

class NotificationHandlerDesktop extends NotificationHandlerBase {
  constructor() {
    super()
  }

  fire(payload: NotificationPayload): void {
    print("Firing to electron: ", payload)
    window.electron.ipcRenderer.send("notify", {title: payload.title, body: payload.body})
  }
}

function fireAlarm(type, alarmTime) {
  let thisTime = Date.now()
  let timeTillAlarm = (alarmTime > thisTime ? alarmTime - thisTime : 0)
  setTimeout(() => {
    window.electron.ipcRenderer.send(`${type}_alarm`)
  }, timeTillAlarm)
}

export function desktopInit() {
  print("DESKTOP INIT!!")
  Interval.on("minute", reminderCheck)
  NotificationHandler.value = new NotificationHandlerDesktop()

  socket.on("sleep_alarm", (sleepTime) => { fireAlarm("sleep", sleepTime) })
  socket.on("wake_alarm", (wakeTime) => { fireAlarm("wake", wakeTime) })
}

declare global {
  interface Window { electron: any; }
}