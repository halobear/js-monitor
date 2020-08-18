/**
 * js 错误上报
 * [参考部分代码](https://github.com/LianjiaTech/fee/blob/master/sdk/lib/js-tracker/index.js)
 */
declare namespace CreateReport {
    interface options {
        pid: string;
        url: string;
        delay?: number;
        needReport?: Function;
    }
    interface loadErrorType {
        readonly SCRIPT: number;
        readonly LINK: number;
        readonly IMG: number;
        readonly AUDIO: number;
        readonly VIDEO: number;
    }
    type loadErrorKeys = keyof loadErrorType;
    interface reportError {
        type: number;
        desc: string;
        stack: string;
    }
}
declare class ErrorMonitor {
    private lastReportTime;
    private options;
    private errors;
    constructor(options: CreateReport.options);
    private init;
    report(data: CreateReport.reportError): void;
}
declare const _default: (settings: CreateReport.options) => ErrorMonitor;
export default _default;
