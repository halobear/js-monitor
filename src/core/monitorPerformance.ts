import { PerformanceFn } from 'types/js-monitor'

function toReportPerformance(callback: PerformanceFn) {
  const { timing: t } = performance
  const load_time = t.loadEventEnd - t.navigationStart
  if (load_time < 0) {
    setTimeout(function () {
      toReportPerformance(callback)
    }, 200)
    return
  }
  const white_time = t.responseStart - t.navigationStart
  const dom_use_time = t.domComplete - t.responseEnd
  const redirect_time = t.redirectEnd - t.redirectStart
  const response_time = t.responseEnd - t.requestStart
  const dns_query_time = t.domainLookupEnd - t.domainLookupStart
  const dns_cache_time = t.domainLookupStart - t.fetchStart
  const tcp_time = t.connectEnd - t.connectStart
  callback({
    white_time,
    load_time,
    dom_use_time,
    redirect_time,
    response_time,
    dns_query_time,
    dns_cache_time,
    tcp_time,
  })
}

function monitorPerformance(callback: PerformanceFn) {
  if (!('performance' in window)) return
  window.addEventListener('load', function () {
    setTimeout(() => {
      toReportPerformance(callback)
    }, 300)
  })
}

export default monitorPerformance
