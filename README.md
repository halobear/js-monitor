## haloMonitor

功能介绍

- 监控 js 运行错误
- 监控 JS、CSS、Image、Video、Audio 加载错误
- 监控 ajax/fetch 错误
- 监控 promise 未处理错误（默认不开启）
- 监控 performance 基本的性能统计

### 配套项目

- [js-monitor-server](https://github.com/halobear/js-monitor-server): node 服务(每周六凌晨 5 点自动清空 10 天前数据)
- [js-monitor-admin](https://github.com/halobear/js-monitor-admin): 监控的管理后台

### 使用一、通过 script (推荐)

```html
<script src="https://img1.halobear.com/static/haloMonitor.2.0.1.js"></script>
<script>
  haloMonitor.config({ pid: '测试项目', reportUrl: 'http://localhost:9601/api/monitor/report' })
</script>
```

### 使用二、webpack 模板 html 中

```html
<% if (process.env.NODE_ENV === 'production') { %>
<script src="https://img1.halobear.com/static/haloMonitor.2.0.1.js"></script>
<script>
  haloMonitor.config({
    pid: '测试项目',
    reportUrl: '/api/monitor/report',
  })
</script>
<% } %>
```

## 使用三、通过 npm

```bash
npm install -S @halobear/monitor
```

```js
import haloMonitor from '@halobear/monitor'

haloMonitor.init({
  pid: 'test',
  reportUrl: 'http://localhost:9601/api/report',
})

export default initHaloMonitor
```

## 初始化参数

```js
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
```
