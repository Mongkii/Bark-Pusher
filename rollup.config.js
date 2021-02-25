import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import svelte from 'rollup-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/manifest.json',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      // always put chromeExtension() before other plugins
      chromeExtension(),
      // Adds a Chrome extension reloader during watch mode
      simpleReloader(),
      svelte({
        preprocess: autoPreprocess(),
      }),
      postcss({
        minimize: isProduction,
      }),
      resolve(),
      commonjs(),
      typescript(),
      copy({ targets: [{ src: 'src/assets/iconfont.woff2', dest: 'dist/assets' }] }),
      isProduction && terser(),
    ],
  },
];
