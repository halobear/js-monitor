const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const { resolve } = require('./utils')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: resolve('lib'),
    filename: '[name].js',
    library: 'HaloMonitor',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
  mode: 'production',
})
