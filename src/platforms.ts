import { Capacitor } from "@capacitor/core";
import { isMobile } from "./persist";
import { androidInit } from "./platforms/android";
import { webInit } from "./platforms/web";
import { desktopInit } from "./platforms/desktop";

let plat = Capacitor.getPlatform()
print("Device Platform:", plat)

switch (plat) {
  case "android":
    androidInit()
  break;
  case "web":
    webInit()
  break;
  case "electron":
    desktopInit()
  break;
}

declare global {
  var skipLocalNotificationReady: boolean;
  interface Window { skipLocalNotificationReady: boolean; cordova: any; device: any; }
}