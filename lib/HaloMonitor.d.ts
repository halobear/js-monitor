declare namespace CreateReport {
    interface options {
        pid: string;
        uid: string;
        reportUrl: string;
        needReport?: Function;
        delay?: number;
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
    type errorKeys = keyof reportError;
    interface formatError extends reportError {
        from: string;
    }
}
declare class ErrorMonitor {
    private timer;
    private options;
    private errors;
    constructor(options: CreateReport.options);
    private init;
    report(itemError: CreateReport.reportError): void;
    private toReport;
    formatError(data: CreateReport.reportError): CreateReport.formatError;
}
declare const _default: (settings: CreateReport.options) => ErrorMonitor | null;
export default _default;
