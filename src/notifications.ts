import { Ref, ref } from "vue";

export interface NotificationPayload {
  title: string;
  body?: string;
  icon?: string;
}

export class NotificationHandlerBase {
  fire(payload: NotificationPayload): void {

  }
}

export const NotificationHandler: Ref<NotificationHandlerBase> = ref(new NotificationHandlerBase())