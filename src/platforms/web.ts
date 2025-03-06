import { Interval } from "../interval";
import { NotificationHandler, NotificationHandlerBase, NotificationPayload } from "../notifications";
import { reminderCheck } from "../reminders";

class NotificationHandlerWeb extends NotificationHandlerBase {
  constructor() {
    super()
  }

  fire(payload: NotificationPayload): void {
    if (Notification.permission === "granted") {
      new Notification(payload.title, {
        body: payload.body
      })
    }
  }
}

export function webInit() {
  print("WEB INIT!!")
  Interval.on("minute", reminderCheck)
  NotificationHandler.value = new NotificationHandlerWeb()
  document.onkeydown = (e: KeyboardEvent) => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission()
    }
  }
}