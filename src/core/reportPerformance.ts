import { PerformanceOptions, InitOptions } from 'types/js-monitor'
import { encodeStringify } from './util'

// 上报性能
function reportPerformance(options: PerformanceOptions, config: InitOptions) {
  const { pid, uid } = config
  const img = new Image()
  const src = `${config.reportUrl}/performance?${encodeStringify({
    ...options,
    pid,
    uid,
  })}`
  img.src = src
}

export default reportPerformance
