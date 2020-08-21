export namespace Halo {
  export interface options {
    pid: string
    uid: string
    reportUrl: string
    needReport?: Function
    delay?: number
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
    brief: string
    stack: string
  }

  export type errorKeys = keyof reportError

  export interface formatError extends reportError {
    from: string
  }
}
