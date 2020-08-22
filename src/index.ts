/**
 * js 错误上报
 */
import { InitOptions, ReportOptions } from 'types/js-monitor'
import { uid } from './utils/util'
import handleError from './utils/handleError'
import handleHttp from './utils/handleHttp'
import handleRejection from './utils/handleRejection'
import report from './utils/report'
import { JS_TRACKER_ERROR_MAP } from './constants'

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
  private config: InitOptions = defaults

  init(config: InitOptions) {
    // 初始化只会进行一次
    if (this.config.reportUrl) return

    // 简单校验参数
    if (!config.reportUrl) {
      return '请填写上报地址'
    }
    Object.assign(this.config, config)

    const doReport = this.report.bind(this)
    // 监听onerror事件
    handleError(doReport)
    // 监听http错误
    !this.config.disabledHttp && handleHttp(doReport)
    // 监听未处理的promise错误
    !this.config.disabledRejection && handleRejection(doReport)
  }

  // 开始上报
  report(options: ReportOptions) {
    const { reportUrl, needReport } = this.config
    if (!reportUrl) return console.log('缺失上报地址')
    if (needReport && !needReport(options)) return
    report(options, this.config)
  }

  // 上报Error错误
  error(e: Error) {
    this.report({
      type: JS_TRACKER_ERROR_MAP.ERROR_CUSTOM,
      brief: `${e.name} ${e.message}`,
      stack: e.stack || 'no stack',
    })
  }
}

// 暴露HaloMonitor
export default new HaloMonitor()
