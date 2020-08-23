// 初始化参数
export interface InitOptions {
  pid: string // 项目名称
  reportUrl: string // 上报地址
  uid?: string // 用户名称
  needReport?: Function // 是否上报验证函数
  delay?: number // 延迟时间 默认 1000
  disabledHttp?: Boolean //  是否xrh/fetch错误上报 默认：不禁用
  disabledRejection?: Boolean // 是否rejection上报 默认：禁用
  disabledPerformance?: Boolean // 是否上报性能  默认：不禁用
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

// 上报错误函数
export interface ReportFn {
  (options: ReportOptions): void
}

// 提交性能的对象
export interface PerformanceOptions {
  white_time: number
  load_time: number
  dom_use_time: number
  redirect_time: number
  response_time: number
  dns_query_time: number
  dns_cache_time: number
  tcp_time: number
}

// 性能上报函数
export interface PerformanceFn {
  (options: PerformanceOptions): void
}

// stringify obj
export interface StringifyObj {
  [key: string]: string | number
}
