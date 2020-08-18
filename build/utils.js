const path = require('path')

exports.resolve = (...dir) => path.resolve(__dirname, '../', ...dir)
