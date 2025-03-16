import { io } from "socket.io-client";
import { API_DATABASES, API_ENDPOINT, API_Refresh } from "./api";
import { Timers } from "./timer_manager";
import { wait } from "./wait";

// print(API_ENDPOINT.replace("https", "wss").replace("http", "ws"))
export const socket = io(API_ENDPOINT);

// socket.on("update", async (db_key) => {
//   print(db_key, " ==> ", API_DATABASES)
//   // await API_DATABASES.value[db_key]._refresh()
  
// })

socket.on("update_with_data", (db_key, data) => {
  print(db_key, " ==> ", API_DATABASES)
  API_DATABASES.value[db_key]._refresh(data)
})

socket.on("update_timer", (id: string) => {
  print("TIMER UPDATE: ", id)
  Timers.value[id]._refresh()
})