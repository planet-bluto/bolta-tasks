import "./arrayLib.js"

import "./extends/array"
import "./extends/date"
import "./extends/print"
import "./extends/epoch"

// import "./models/reminder"
// import "./models/task"
// import "./models/schedule"

import { FetchedEvent } from "./api"

import PrimeVue from 'primevue/config';
import VueMobileDetection from "vue-mobile-detection";
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import "./database"
import "./classTest"
import "./platforms"
import "./interval"
import "./reminders.js"
import "./test"
import { isMobile } from "./persist"
import "./socket"

const app = createApp(App)
app.use(PrimeVue, { unstyled: true })
app.use(VueMobileDetection)

FetchedEvent.once("fetched", () => {
  print("FETCHED!!")
  app.mount('#app')
})

function sheetQueryFunc(sheet) {
  return Array.from(sheet.rules).some((rule: any) => rule.selectorText == ":root")
}

let width_idx = null
let height_idx = null

function updateSizes() {
  isMobile.value = (app.config.globalProperties as any).$isMobile()
  // let mobileMult = (isMobile ? 1.0 / 0.9 : 1.0)
  // document.body.style.setProperty("--viewport-width", `${window.innerWidth}px`)
  let width = (isMobile.value ? window.outerWidth : window.innerWidth)
  let height = (isMobile.value ? window.outerHeight : window.innerHeight)

  width_idx = setStyleRule(":root", `--viewport-width: ${width}px`, width_idx, sheetQueryFunc)
  // document.body.style.setProperty("--viewport-height", `${window.innerHeight}px`)
  height_idx = setStyleRule(":root", `--viewport-height: ${height}px`, height_idx, sheetQueryFunc)

  // setStyleRule(":root", `--gap: ${isMobile ? 0 : 16}px`, sheetQueryFunc)

  // print(`INNER SIZE: (${width}, ${height})`)
}

updateSizes()

window.addEventListener("DOMContentLoaded", e => {
  updateSizes()
})
window.addEventListener("resize", e => {
  updateSizes()
})

function setStyleRule (selector, rule, idx, queryFunc = (sheet) => {return true}) {
  var sheets = document.styleSheets,
      stylesheet = sheets[(sheets.length - 1)];
  
  // print(sheets)
      
  for( var i in document.styleSheets ){
      if( queryFunc(sheets[i]) ) {
          stylesheet = sheets[i];
          break;
      }
  }
  
  if (idx) { stylesheet.deleteRule(idx); }
  stylesheet.insertRule(selector + ' { ' + rule + ' }', (idx || stylesheet.cssRules.length));
}