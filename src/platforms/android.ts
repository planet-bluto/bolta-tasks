import { BackgroundRunner } from "@capacitor/background-runner";
import { Interval } from "../interval";
import { NotificationHandler, NotificationHandlerBase, NotificationPayload } from "../notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { reminderCheck } from "../reminders";

class NotificationHandlerAndroid extends NotificationHandlerBase {
  constructor() {
    super()

    notificationPerms()
  }

  fire(payload: NotificationPayload): void {
    LocalNotifications.schedule({notifications: [{
      id: 100,
      title: payload.title,
      body: payload.body
    }]})
  }
}

export function androidInit() {
  NotificationHandler.value = new NotificationHandlerAndroid()

  Interval.on("minute", reminderCheck)
}
  
async function notificationPerms() {
  let status = await LocalNotifications.checkPermissions()
  if (status.display == "prompt") {
    status = await LocalNotifications.requestPermissions()
  }
}