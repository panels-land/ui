import path from 'path'

import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'esm',
  },
  external: id => !(id.startsWith('.') || path.isAbsolute(id)),
  plugins: [
    del({
      targets: ['./build/**/*'],
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['solid'],
      extensions: ['.ts', '.tsx'],
    }),
    typescript(),
  ],
}
