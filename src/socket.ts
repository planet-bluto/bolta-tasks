import { io } from "socket.io-client";
import { API_DATABASES, API_ENDPOINT, API_Refresh } from "./api";

// print(API_ENDPOINT.replace("https", "wss").replace("http", "ws"))
let socket = io(API_ENDPOINT);

socket.on("update", (db_key) => {
  API_DATABASES.value[db_key]._refresh()
})