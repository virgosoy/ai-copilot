
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import relativeDate from "dayjs/plugin/relativeTime"
export default defineNuxtPlugin(nuxtApp => {
  dayjs.extend(relativeDate)
  dayjs.extend(utc)
})