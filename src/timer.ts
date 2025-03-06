import { FocusSession } from "bolta-tasks-core";
import EventEmitter from "eventemitter3";

function wrapNumber(number, min, max) {
  const range = max - min + 1;
  return (number - min) % range + min;
}

export class FocusTimer extends EventEmitter {
  intervals: number;
  session: FocusSession;
  running: boolean;

  _elapsed: number = 0;
  _start_time: number = 0;
  _timeout: any | null = null;

  constructor(session: FocusSession) {
    super()
    this.session = session
    this.intervals = 0

    this.on("expired", this._expired)
  }

  get perc() {
    return (1.0 - (this.time_remaining / this.current_interval.duration))
  }

  get current_interval_index() {
    // return (this.intervals % this.session.interval.length)
    return wrapNumber(this.intervals, 0, this.session.interval.length-1)
  }

  get current_interval() {
    return this.session.interval[this.current_interval_index]
  }

  get time_remaining() {
    let _raw = this.current_interval.duration - (this.running ? Date.now() - this._start_time : 0) - (this._elapsed)
    return Math.max(_raw, 0)
  }

  _hard_stop() {
    this._elapsed = 0
    this.reset()
  }

  _expired() {
    this._hard_stop()
    this.intervals += 1
  }

  back() {
    this._hard_stop()
    if (this.intervals == 0) {
      this.intervals = this.session.interval.length-1
    } else {
      this.intervals -= 1
    }
  }

  next() {
    this._hard_stop()
    this.intervals += 1
  }

  start() {
    if (this.running) { return }

    this.running = true
    this._start_time = Date.now()
    this._timeout = setTimeout(() => {
      this.emit("expired")
    }, this.current_interval.duration - (this._elapsed))
  }

  pause() {
    if (!this.running) { return }

    this.running = false
    this._elapsed += Date.now() - this._start_time
    clearTimeout(this._timeout)
  }

  reset() {
    this.running = false
    this._elapsed = 0
    clearTimeout(this._timeout)
  }

  seek(ms: number) {
    if (this.running) {
      this.running = false
      clearTimeout(this._timeout)
    }
    
    this._elapsed = ms
  }
}