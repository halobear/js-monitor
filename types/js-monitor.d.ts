// 初始化参数
export interface InitOptions {
  pid: string
  reportUrl: string
  uid?: string
  needReport?: Function
  delay?: number
}

// 上报参数
export interface ReportOptions {
  type: number
  brief: string
  stack: string
}

// 上报参数keys
export type ReportOptionsKeys = keyof ReportOptions

// 资源加载错误类型
export interface loadErrorMap {
  readonly SCRIPT: number
  readonly LINK: number
  readonly IMG: number
  readonly AUDIO: number
  readonly VIDEO: number
}

export type loadErrorMapKeys = keyof loadErrorMap

// 错误队列中单个对象
export interface ItemError extends ReportOptions {
  from: string
}
export type ItemErrorKeys = keyof ItemError

// 格式化错误函数
export interface ReportFn {
  (options: ReportOptions): void
}
