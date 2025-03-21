import axios, { AxiosInstance } from "axios";
import { computed, ComputedRef, Ref, ref, triggerRef } from "vue";
import { PlannerTask, ProjectTask, Schedule, Project } from "bolta-tasks-core";
import EventEmitter from "eventemitter3";

import { Interfacer } from "bolta-tasks-core"
import { FocusSession } from "bolta-tasks-core";
import { FocusedProject } from "./persist";
import { wait } from "./wait";

export const API_ENDPOINT = "https://bolta.planet-bluto.net"
// export const API_ENDPOINT = "http://192.168.1.237:26582"

class FetchedEventClass extends EventEmitter {}
export const FetchedEvent = new FetchedEventClass()

const to_fetch = ["schedules", "planner_tasks"]
var fetched = ref(new Set())

export const API_DATABASES: Ref<{[db_key: string]: APIDatabase}> = ref({})
class APIDatabase {
  host: string = API_ENDPOINT;
  _axios: AxiosInstance;
  db_key: string;
  ref: Ref<any[]>;
  construct: any;
  compute: () => any[];
  dict: Ref<{}> = ref({});

  constructor(db_key, construct = null) {
    this.construct = construct
    this.db_key = db_key
    this._axios = axios.create({
      baseURL: this.host,
    })
    
    API_DATABASES.value[this.db_key] = this

    this.ref = ref([])
    this._refresh()

    this.compute = (() => {
      let arr = this.ref.value
      // print("COMPUTING??", arr)
      if (this.construct) {
        arr = arr.map(entry => (new this.construct(entry)))
      }
      return arr
    })
  }

  async _refresh(objs = null, bro = false) {
    print("REFRESHING DATABASE...")
    if (objs == null) {
      objs = await this.get_all(true)
    }
    this.ref.value = objs
    this.dict.value = {}
    this.ref.value.forEach(entry => {
      this.dict.value[entry._id] = (this.construct ? new this.construct(entry) : entry)
    })
    // triggerRef(this.ref)
    print(`DATABASE [${this.db_key}]: `, this.ref.value)
    fetched.value.add(this.db_key)

    if (this.db_key == "schedules") {
      print("Setting Interfacer: ", Interfacer)
      Interfacer["resolveSchedule"] = (schedule_id: string) => this.findEntry(schedule_id)
    }

    if (to_fetch.every(key => fetched.value.has(key))) {
      FetchedEvent.emit("fetched")
    }

    if (!bro) { APIWatcher.emit(this.db_key+"_refresh") }
  }

  get value() {
    return this.compute()
  }

  async _base_request(method: ("GET" | "POST" | "PATCH" | "PUT" | "DELETE"), url: string, data: object = null, refresh = false) {
    if (!refresh) { this._refresh() }
    let res = await this._axios({ url: "/db"+url, method, data })
    if (!refresh) { this._refresh() }
    return res.data
  }

  add(obj: object) {
    return this._base_request("POST", `/${this.db_key}`, obj)
  }

  get_all(refresh = false) {
    return this._base_request("GET", `/${this.db_key}`, null, refresh)
  }

  get(id: string) {
    return this._base_request("GET", `/${this.db_key}/${id}`)
  }

  edit(id: string, obj: object) {
    return this._base_request("PATCH", `/${this.db_key}/${id}`, obj)
  }

  delete(id: string) {
    return this._base_request("DELETE", `/${this.db_key}/${id}`)
  }

  findEntry(id: string) {
    return (this?.value || []).find(entry => entry._id == id)
  }
}

export const PlannerTasks = new APIDatabase("planner_tasks", PlannerTask)
// export const ProjectTasks = new APIDatabase("project_tasks", ProjectTask)
export const Schedules = new APIDatabase("schedules", Schedule)
export const Projects = new APIDatabase("projects", Project)
export const FocusSessions = new APIDatabase("focus_sessions", FocusSession)

class APIWatcherClass extends EventEmitter {}
export const APIWatcher = new APIWatcherClass()

export async function API_Refresh() {
  await Promise.all([
    PlannerTasks._refresh(),
    Schedules._refresh(),
    Projects._refresh(),
    FocusSessions._refresh(),
  ])

  APIWatcher.emit("refresh")
}

APIWatcher.on("projects_refresh", async () => {
  Projects._refresh(null, true) // WHY???? WHY- LITERALLY WHY I'M SO FUCKING CONFUSED, FUCK YOU.
})