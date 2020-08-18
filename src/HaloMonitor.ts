/**
 * js 错误上报
 * [参考部分代码](https://github.com/LianjiaTech/fee/blob/master/sdk/lib/js-tracker/index.js)
 */
import userId from './userId'

namespace CreateReport {
  export interface options {
    pid: string
    uid: string
    reportUrl: string
    needReport?: Function
    delay?: number
  }
  export interface loadErrorType {
    readonly SCRIPT: number
    readonly LINK: number
    readonly IMG: number
    readonly AUDIO: number
    readonly VIDEO: number
  }

  export type loadErrorKeys = keyof loadErrorType

  export interface reportError {
    type: number
    desc: string
    stack: string
    from?: string
  }

  export type errorKeys = keyof reportError
}

// 默认配置
const defaults: CreateReport.options = {
  pid: 'test', // 项目名字
  uid: userId, // 用户id
  reportUrl: '', // 接口地址
  delay: 1000, // 延迟时间
}

// 前端错误类型
enum JS_TRACKER_ERROR_MAP {
  ERROR_RUNTIME = 1,
  ERROR_SCRIPT = 2,
  ERROR_STYLE = 3,
  ERROR_IMAGE = 4,
  ERROR_AUDIO = 5,
  ERROR_VIDEO = 6,
  ERROR_CONSOLE = 7,
  ERROR_TRY_CATCH = 8,
}

// 资源加载错误
const LOAD_ERROR_TYPE: CreateReport.loadErrorType = {
  SCRIPT: JS_TRACKER_ERROR_MAP.ERROR_SCRIPT,
  LINK: JS_TRACKER_ERROR_MAP.ERROR_STYLE,
  IMG: JS_TRACKER_ERROR_MAP.ERROR_IMAGE,
  AUDIO: JS_TRACKER_ERROR_MAP.ERROR_AUDIO,
  VIDEO: JS_TRACKER_ERROR_MAP.ERROR_VIDEO,
}

// 上次上报时间
class ErrorMonitor {
  private timer: NodeJS.Timeout | null
  private options: CreateReport.options
  private errors: CreateReport.reportError[]
  constructor(options: CreateReport.options) {
    this.errors = []
    this.timer = null
    this.options = { ...defaults, ...options }
    this.init()
  }

  private init() {
    // console.log('初始化成功')
    // 监听onerror事件
    window.addEventListener(
      'error',
      (event) => {
        // console.log('收集到错误', event)
        const errorTarget = event.target || {}
        const node = (errorTarget || {}) as Node
        const nodeName = (node.nodeName || '').toUpperCase()
        if (errorTarget !== window && nodeName && nodeName in LOAD_ERROR_TYPE) {
          // 资源加载错误
          const key = nodeName as CreateReport.loadErrorKeys
          const anyNode = node as any
          const data: CreateReport.reportError = {
            type: LOAD_ERROR_TYPE[key],
            desc: `${anyNode.baseURI}@${anyNode.src || anyNode.href}`,
            stack: 'no stack',
          }
          this.report(data)
        } else {
          // runtime错误
          const { message, filename, lineno, colno, error } = event
          const data: CreateReport.reportError = {
            type: JS_TRACKER_ERROR_MAP.ERROR_RUNTIME,
            desc: `${message} at ${filename}:${lineno}:${colno}`,
            stack: error && error.stack ? error.stack : 'no stack',
          }
          this.report(data)
        }
      },
      true
    )

    // 监听未处理的promise错误
    window.addEventListener(
      'unhandledrejection',
      (event) => {
        console.log(event)
        this.report({
          type: JS_TRACKER_ERROR_MAP.ERROR_RUNTIME,
          desc: `Unhandled Rejection reason: ${event.reason}`,
          stack: event.reason.stack || 'no stack',
        })
      },
      true
    )
  }

  report(data: CreateReport.reportError) {
    // 又重复的错误不重复上报
    if (this.errors.some((item) => item.desc === data.desc)) return

    const { delay = 1000, pid, uid, reportUrl, needReport } = this.options

    // 手动过滤不需要上报的错误
    if (needReport && !needReport(data)) return

    // 保存最新的10条错误
    data.from = window.location.href
    this.errors.push(data)
    this.errors = this.errors.slice(-10)

    // 做一个简单的节流
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      console.log('准备提交收集到的错误信息', this.errors)
      if (!reportUrl) return console.error('没有配置reportUrl')
      const pairs: string[] = [`pid=${pid}`, `uid=${uid}`]
      this.errors.forEach((item, i) => {
        Object.keys(item).forEach((key) => {
          const v = item[key as CreateReport.errorKeys] || ''
          pairs.push(`${key}[${i}]=${v}`)
        })
      })
      const src = `${reportUrl}?${pairs.join('&')}`
      const img = new Image()
      img.src = src
      // 清空错误队列
      this.errors = []
    }, delay)
  }
}

// 通过单例模式暴露
let errorReport: ErrorMonitor
export default (settings: CreateReport.options) => {
  // 判断必填写条件
  if (!settings.reportUrl) {
    console.error('没有配置reportUrl')
    return null
  }

  if (errorReport) return errorReport
  errorReport = new ErrorMonitor(settings)
  return errorReport
}
