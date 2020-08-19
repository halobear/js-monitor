const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const logger = require('@luzhongk/node-logger')
const baseConfig = require('./webpack.config.base')
const { resolve } = require('./utils')

const port = 9003

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    library: 'HaloMonitor',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
  devServer: {
    after(app, server, compiler) {
      compiler.hooks.done.tap('webpack dev', () => {
        logger.run(port)
      })
    },
    host: '0.0.0.0',
    port,
    noInfo: true, // only errors & warns on hot reload
  },
  plugins: [
    new HtmlWebpackPlugin({
      path: '/',
      filename: 'index.html',
      template: resolve('public', 'index.html'),
    }),
  ],
})
