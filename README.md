## haloMonitor

一个入门级别的前端监控

## 使用一、通过 <script> (推荐)

```html
<script src="../lib/HaloMonitor.js"></script>
<script>
  ;(function initHaloMonitor(options) {
    window.haloMonitor = HaloMonitor(options)
  })({
    pid: 'test',
    reportUrl: 'http://localhost:9601/api/report',
  })
</script>
```

## 使用二、通过 npm

```bash
npm install -S @halobear/monitor
```

```js
import initHaloMonitor from '@halobear/monitor'

export default initHaloMonitor({
  pid: 'test',
  reportUrl: 'http://localhost:9601/api/report',
})
```
