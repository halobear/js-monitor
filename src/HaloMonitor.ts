/**
 * js 错误上报
 * [参考部分代码](https://github.com/LianjiaTech/fee/blob/master/sdk/lib/js-tracker/index.js)
 */
namespace CreateReport {
  export interface options {
    pid: string
    url: string
    delay?: number
    needReport?: Function
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
  }
}

// 默认配置
const defaults: CreateReport.options = {
  pid: 'test', // 项目名字
  url: '', // 接口地址
  delay: 2000, // 延迟时间
  needReport: () => true, // 是否需要上报
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
  private lastReportTime: number
  private options: CreateReport.options
  private errors: CreateReport.reportError[]
  constructor(options: CreateReport.options) {
    this.errors = []
    this.lastReportTime = 0
    this.options = { ...defaults, ...options }
    this.init()
  }

  private init() {
    window.addEventListener('error', (event) => {
      console.log('onerror触发')
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
          stack: error && error.stack ? error.stack : 'no-stack',
        }
        this.report(data)
      }
    })

    window.addEventListener(
      'unhandledrejection',
      function (event) {
        console.log(event)
        // event.reason.message,
        // event.reason.stack
        // console.log('Unhandled Rejection at:', event.promise, 'reason:', event.reason)
        // this.report({
        //   type: JS_TRACKER_ERROR_MAP.ERROR_RUNTIME
        // })
        // handleError(event)
      },
      true
    )
  }

  report(data: CreateReport.reportError) {
    // 又重复的错误不重复上报
    if (this.errors.some((item) => item.desc)) return

    // 保存最新的10条错误
    this.errors.push(data)
    this.errors = this.errors.slice(-10)

    // 做一个简单节流
    const now = new Date().getTime()
    const { delay = 2000 } = this.options
    if (now - delay < this.lastReportTime) return
    this.lastReportTime = now

    console.log('准备提交的内容', this.errors)
    // const { otherData = {}, id, uin, reportUrl } = this.options
    // const stringify: string[] = []
    // stringify.push(`id=${id}`, `uin=${uin}`)
    // this.logs.forEach((newLog, i) => {
    //   const params = { from: window.location.href, level: 0, ...newLog, ...otherData }
    //   Object.keys(params).forEach((key) => {
    //     const value = (params as any)[key]
    //     stringify.push(`${key}[${i}]=${value}`)
    //   })
    // })
    // const src = `${reportUrl}?${stringify.join('&')}`
    // const img = new Image()
    // img.src = src
    // this.logs = []
  }
}

// 通过单例模式暴露
let errorReport: ErrorMonitor
export default (settings: CreateReport.options) => {
  if (errorReport) return errorReport
  errorReport = new ErrorMonitor(settings)
  return errorReport
}
