## haloMonitor

## 配合项目

- [js-monitor-server](https://github.com/halobear/js-monitor-server): node 服务
- [js-monitor-admin](https://github.com/halobear/js-monitor-admin): 管理后台

## 使用一、通过 <script> (推荐)

```html
<script src="../lib/haloMonitor.js"></script>
<script>
  haloMonitor.config({ pid: '测试项目', reportUrl: 'http://localhost:9601/api/monitor/report' })
</script>
```

## 使用二、通过 npm

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

## 配置

- `pid`: string 项目名称
- `reportUrl`: string 上报地址
- `uid`?: string 用户名称
- `needReport`?: Function 是否需要上报
- `delay`?: number
- `disabledHttp`?: Boolean
- `disabledRejection`?: Boolean 默认 false(会和 http 重复上报)
