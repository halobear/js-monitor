import {
  InitOptions,
  ReportOptions,
  ItemError,
  ItemErrorKeys,
  StringifyObj,
} from 'types/js-monitor'
import { formatError, stringify } from './util'

// 错误栈
let errors: ItemError[] = []
let timer: null | NodeJS.Timer

// 上报并提交errors
function toReport(options: InitOptions) {
  const { pid, uid, reportUrl } = options
  if (!errors.length) return ''
  // console.log('准备提交收集到的错误信息', this.errors)
  if (!reportUrl) return console.error('没有配置reportUrl')
  const errorMap: StringifyObj = {
    pid,
    uid: uid || '',
  }
  errors.forEach((item, i) => {
    Object.keys(item).forEach((key) => {
      const v = item[key as ItemErrorKeys] || ''
      errorMap[`${key}[${i}]`] = v
    })
  })
  const src = `${reportUrl}?${stringify(errorMap)}`
  const img = new Image()
  img.src = src
  // 清空错误队列
  errors = []
}

// 上报错误
export default function report(option: ReportOptions, config: InitOptions) {
  const data: ItemError = formatError(option)
  // 重复的错误不重复上报
  if (errors.some((item) => item.brief === data.brief)) return

  const { delay = 1000, needReport } = config

  // 手动过滤不需要上报的错误
  if (needReport && !needReport(data)) return

  // 加入错误栈
  errors.push(data)

  // 做一个简单的节流
  if (timer) clearTimeout(timer)

  // 错误达到5个或者等待1s后提交
  if (errors.length >= 5) {
    toReport(config)
  } else {
    timer = setTimeout(() => {
      toReport(config)
    }, delay)
  }
}
