import { ReportFn } from 'types/js-monitor'
import { JS_TRACKER_ERROR_MAP } from '../constants'

function handleRejection(callback: ReportFn) {
  // 监听未处理的promise错误
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      // console.log('promise收集到错误', event)
      callback({
        type: JS_TRACKER_ERROR_MAP.ERROR_PROMISE,
        brief: `Unhandled Rejection reason: ${event.reason}`,
        stack: event.reason.stack || 'no stack',
      })
    },
    true
  )
}

export default handleRejection
