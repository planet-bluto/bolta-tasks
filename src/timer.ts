import axios, { Axios, AxiosInstance } from "axios";
import { FocusSession } from "bolta-tasks-core";
import EventEmitter from "eventemitter3";
import { API_ENDPOINT, FocusSessions } from "./api";

function wrapNumber(number, min, max) {
  const range = max - min + 1;
  return (number - min) % range + min;
}

export class FocusTimer extends EventEmitter {
  intervals: number;
  session_id: string;
  // session: FocusSession;
  running: boolean;

  _elapsed: number = 0;
  _start_time: number = 0;
  _timeout: any | null = null;

  _axios: AxiosInstance;
  _host: string = API_ENDPOINT;

  constructor(session_id) {
    super()
    this.session_id = session_id
    // this.session = session
    // this.intervals = 0

    // this.on("expired", this._expired)

    this._axios = axios.create({
      baseURL: this._host
    })

    this._refresh()
  }
  
  async _base_request(method: ("GET" | "POST" | "PATCH" | "PUT" | "DELETE"), url: string, data: object = null) {
    let res = await this._axios({ url: `/focus_timers/${this.session_id}`+url, method, data })
    return res.data
  }

  async _call_method(method: string, ...args: any[]) {
    let result = await this._base_request("PATCH", "/call/"+method, {args})
    return result
  }

  async _refresh() {
    let data = await this._base_request("GET", "")
    print(data)
    Object.assign(this, data)
  }

  get session(): FocusSession {
    return FocusSessions.findEntry(this.session_id)
  }

  get perc() {
    return (1.0 - (this.time_remaining / this.current_interval.duration))
  }

  get current_interval_index() {
    // return (this.intervals % this.session.interval.length)
    return wrapNumber(this.intervals, 0, this.session.interval.length-1)
  }

  get current_interval() {
    // print("CURRENT INT: ", this)
    return this.session.interval[this.current_interval_index]
  }

  get time_remaining() {
    let _raw = this.current_interval.duration - (this.running ? Date.now() - this._start_time : 0) - (this._elapsed)
    return Math.max(_raw, 0)
  }

  back() {
    return this._call_method("back")
  }

  next() {
    return this._call_method("next")
  }

  jump(interval: number) {
    return this._call_method("jump", interval)
  }

  start() {
    return this._call_method("start")
  }

  pause() {
    return this._call_method("pause")
  }

  reset() {
    return this._call_method("reset")
  }

  seek(ms: number) {
    return this._call_method("seek", ms)
  }
}