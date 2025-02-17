import { io } from "socket.io-client";
import { API_ENDPOINT, API_Refresh } from "./api";

// print(API_ENDPOINT.replace("https", "wss").replace("http", "ws"))
let socket = io(API_ENDPOINT);

socket.on("update", () => {
  API_Refresh()
})