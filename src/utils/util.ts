import { ReportOptions, ItemError } from '../../types/js-monitor'
import { JS_TRACKER_ERROR_MAP } from 'src/constants'

// 使用localStorage给用户一个唯一的标志
const key = 'halo_monitor_uid'
function getUserId(): string {
  let uid = localStorage.getItem(key)
  if (!uid) {
    uid = Number(Math.random().toString().substr(3, 11) + Date.now()).toString(36)
    localStorage.setItem(key, uid)
  }
  return uid
}

export const uid = getUserId()

// 格式化错误信息
export function formatError(data: ReportOptions): ItemError {
  return Object.assign({}, data, {
    type: data.type || JS_TRACKER_ERROR_MAP.ERROR_CUSTOM,
    stack: data.stack.slice(0, 150),
    from: window.location.href,
  })
}
