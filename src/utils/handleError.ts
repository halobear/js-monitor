import { loadErrorMapKeys, ReportFn } from '../../types/js-monitor'
import { LOAD_ERROR_TYPE, JS_TRACKER_ERROR_MAP } from '../constants'

// 监听window的事件
function handleError(callback: ReportFn) {
  window.addEventListener(
    'error',
    (event) => {
      // console.log('onerror收集到错误', event)
      const errorTarget = event.target || {}
      const node = (errorTarget || {}) as Node
      const nodeName = (node.nodeName || '').toUpperCase()
      if (errorTarget !== window && nodeName && nodeName in LOAD_ERROR_TYPE) {
        // 资源加载错误
        const key = nodeName as loadErrorMapKeys
        const anyNode = node as any
        callback({
          type: LOAD_ERROR_TYPE[key],
          brief: anyNode.src || anyNode.href || 'no src',
          stack: 'no stack',
        })
      } else {
        // runtime错误
        const { message, filename, lineno, colno, error } = event
        callback({
          type: JS_TRACKER_ERROR_MAP.ERROR_RUNTIME,
          brief: `${message} at ${filename}:${lineno}:${colno}`,
          stack: error && error.stack ? error.stack : 'no stack',
        })
      }
    },
    true
  )
}

export default handleError
