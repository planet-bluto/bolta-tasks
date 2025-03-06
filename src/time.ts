export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export const WEEK = DAY * 7
export const MONTH = DAY * 30
export const YEAR = DAY * 365

export function parseDuration(duration: number) {
    let hours = Math.floor(duration / HOUR)
    let remainder = duration - (hours * HOUR)
    let minutes = Math.floor(remainder / MINUTE)
    let seconds = Math.floor((duration - (hours * HOUR) - (minutes * MINUTE)) / SECOND)
    let milliseconds = (duration - (hours * HOUR) - (minutes * MINUTE) - (seconds * SECOND))

    return {hours, minutes, seconds, milliseconds}
}

export function parseDurationString(duration: number, include_seconds = false) {
    let parsedDuration = parseDuration(duration)

    return String(parsedDuration.hours).padStart(2, "0") + ":" + String(parsedDuration.minutes).padStart(2, "0") + (include_seconds ? ":" + String(parsedDuration.seconds).padStart(2, "0") : "")
}