import { Capacitor } from "@capacitor/core";
import { isMobile } from "./persist";
import { androidInit } from "./platforms/android";
import { webInit } from "./platforms/web";

let plat = Capacitor.getPlatform()
print("Device Platform:", plat)

switch (plat) {
  case "android":
    androidInit()
  break;
  case "web":
    webInit()
  break;
}

declare global {
  var skipLocalNotificationReady: boolean;
  interface Window { skipLocalNotificationReady: boolean; cordova: any; device: any; }
}