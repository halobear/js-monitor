import { ReportOptions, ItemError, InitOptions, StringifyObj } from 'types/js-monitor'
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

// 合并字符串
export function encodeStringify(obj: any) {
  const o = obj as StringifyObj
  const pairs: string[] = Object.keys(o).map((key) => {
    const value = encodeURIComponent(obj[key])
    return `${key}=${value === undefined ? '' : value}`
  })
  return pairs.join('&')
}

// 打印错误
export function printError(text: string) {
  console.log(
    `%c halobearMontor: %c${text}`,
    'color: #999;fonts-size: 12px',
    'color: #ff9900;font-size: 16px;'
  )
}

// 打印成功
export function printSuccess(options: InitOptions) {
  console.log('%c halobearMontor is running', 'color: #1AAD19;font-size: 12px;')
  const { pid = '', reportUrl = '' } = options
  console.dir({ pid, reportUrl })
}
