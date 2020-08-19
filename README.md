## haloMonitor

一个入门级别的前端监控

## 使用

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
