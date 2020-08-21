import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const isDev = process.env.NODE_ENV === 'development'
console.log(process.env.NODE_ENV)

const config = {
  input: 'src/index.ts',
  output: {
    file: 'lib/HaloMonitor.js',
    format: 'umd',
    name: 'MITO',
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: 'node_modules',
    }),
    json(),
    typescript({
      // tsconfigOverride: { compilerOptions: { declaration: false } },
      useTsconfigDeclarationDir: true,
      declarationDir: 'dist/types/',
    }),
  ],
}

if (!isDev) {
  config.plugins.push(terser())
}

export default [config]
