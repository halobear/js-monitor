const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const { resolve } = require('./utils')

module.exports = {
  entry: {
    HaloMonitor: resolve('src/HaloMonitor'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    unknownContextCritical: false,
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
}
