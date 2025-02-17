import { Interval } from "../interval";
import { reminderCheck } from "../reminders";

// class NotificationHandlerAndroid extends NotificationHandlerBase {
//   constructor() {
//     super()

//     notificationPerms()
//   }

//   fire(payload: NotificationPayload): void {
//     LocalNotifications.schedule({notifications: [{
//       id: 100,
//       title: payload.title,
//       body: payload.body
//     }]})
//   }
// }

export function webInit() {
  Interval.on("minute", reminderCheck)
}