/**
 * js 错误上报
 */
import { InitOptions, ReportOptions, PerformanceOptions } from 'types/js-monitor'
import { uid, printError, printSuccess } from './core/util'
import handleError from './core/handleError'
import handleHttp from './core/handleHttp'
import handleRejection from './core/handleRejection'
import report from './core/report'
import { JS_TRACKER_ERROR_MAP } from './constants'
import monitorPerformance from './core/monitorPerformance'
import reportPerformance from './core/reportPerformance'

// 默认配置
const defaults: InitOptions = {
  pid: 'test', // 项目名字
  uid, // 用户id
  reportUrl: '', // 接口地址
  delay: 1000, // 延迟时间
  disabledRejection: true, // 默认不开启unhandledrejection监听
}

// 上次上报时间
class HaloMonitor {
  private options: InitOptions = defaults

  config(options: InitOptions) {
    // 初始化只会进行一次
    if (this.options.reportUrl) return

    // 简单校验参数
    if (!options.reportUrl) {
      return printError('初始化失败，请填写上报地址')
    }
    Object.assign(this.options, options)

    const { disabledHttp, disabledRejection, disabledPerformance } = this.options

    const doReport = this.report.bind(this)
    const doReportPerformance = this.reportPerformance.bind(this)
    // 监听onerror事件
    handleError(doReport)
    // 监听http错误
    !disabledHttp && handleHttp(doReport)
    // 监听未处理的promise错误
    !disabledRejection && handleRejection(doReport)

    !disabledPerformance && monitorPerformance(doReportPerformance)

    // 打印成功
    printSuccess(this.options)
  }

  // 开始上报
  report(options: ReportOptions) {
    const { reportUrl, needReport } = this.options
    if (!reportUrl) return console.log('缺失上报地址')
    if (needReport && !needReport(options)) return
    report(options, this.options)
  }

  // 上报Error错误
  error(e: Error) {
    this.report({
      type: JS_TRACKER_ERROR_MAP.ERROR_CUSTOM,
      brief: `${e.name} ${e.message}`,
      stack: e.stack || 'no stack',
    })
  }

  // 上报性能
  reportPerformance(options: PerformanceOptions) {
    reportPerformance(options, this.options)
  }
}

// 暴露HaloMonitor
export default new HaloMonitor()
