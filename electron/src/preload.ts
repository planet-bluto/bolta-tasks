require('./rt/electron-rt');

import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
}