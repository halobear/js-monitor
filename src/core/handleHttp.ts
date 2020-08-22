import { ReportFn } from 'types/js-monitor'
import { JS_TRACKER_ERROR_MAP } from '../constants'

interface CustomXHR extends XMLHttpRequest {
  _method: string
  _url: string
  _startTime: number
  _isAbort: Boolean | null
}

function getStack(
  status: number = 0,
  method: string = 'GET',
  startTime: number = 0,
  text: string
): string {
  return `status:${status},${method}:${new Date().getTime() - startTime}ms,${text}`
}

// 重写XMLHttpRequest
function rewriteXHR(callback: ReportFn) {
  if (!('XMLHttpRequest' in window)) return

  const nativeAjaxSend = XMLHttpRequest.prototype.send // 首先将原生的方法保存。
  const nativeAjaxOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function () {
    // 劫持open方法，是为了拿到请求的url
    const xhrInstance = this as CustomXHR
    xhrInstance._method = arguments[0]
    xhrInstance._url = arguments[1]
    xhrInstance._startTime = new Date().getTime()
    return nativeAjaxOpen.apply(this, arguments as any)
  }

  XMLHttpRequest.prototype.send = function (...args) {
    // 对于ajax请求的监控，主要是在send方法里处理。
    const oldCb = this.onreadystatechange
    const xhrInstance = this as CustomXHR

    // 主动取消ajax的情况需要标注，否则可能会产生误报
    xhrInstance.addEventListener('abort', function (e) {
      if (e.type === 'abort') {
        xhrInstance._isAbort = true
      }
    })

    // 这里捕获到的error是一个ProgressEvent。e.target 的值为 XMLHttpRequest的实例。当网络错误(ajax并没有发出去)或者发生跨域的时候，会触发XMLHttpRequest的error, 此时，e.target.status 的值为:0，e.target.statusText 的值为:''
    xhrInstance.addEventListener('error', function (e) {
      const { status, statusText } = (e.target || {}) as any
      const { _url, _method, _startTime } = xhrInstance
      callback({
        type: JS_TRACKER_ERROR_MAP.ERROR_HTTP,
        brief: _url,
        stack: getStack(status, _method, _startTime, statusText),
      })
    })

    this.onreadystatechange = function (...innerArgs) {
      if (xhrInstance.readyState === 4) {
        if (!xhrInstance._isAbort && xhrInstance.status !== 200) {
          const { status, statusText, _method, _startTime } = xhrInstance
          callback({
            type: JS_TRACKER_ERROR_MAP.ERROR_HTTP,
            brief: xhrInstance._url,
            stack: getStack(status, _method, _startTime, statusText),
          })
        }
      }
      oldCb && oldCb.apply(this, innerArgs)
    }
    return nativeAjaxSend.apply(this, args)
  }
}

// 重写fetch方法
function rewriteFetch(callback: ReportFn) {
  if (!('fetch' in window)) return
  const nativeFetch = fetch
  window.fetch = function (): Promise<Response> {
    const startTime = new Date().getTime()
    const url = arguments[0] as string
    const { method = 'GET' } = arguments[1] || {}
    return nativeFetch.apply(window, arguments as any).then(
      (res) => {
        const { status } = res
        if (status !== 200) {
          res.text().then((text) => {
            const stack = getStack(status, method, startTime, text)
            callback({ type: JS_TRACKER_ERROR_MAP.ERROR_HTTP, brief: url, stack })
          })
        }
        return res
      },
      (e) => {
        const stack = getStack(0, method, startTime, e.name + e.message)
        callback({ type: JS_TRACKER_ERROR_MAP.ERROR_HTTP, brief: url, stack })
        return e
      }
    )
  }
}

export default (callback: ReportFn) => {
  rewriteXHR(callback)
  rewriteFetch(callback)
}
