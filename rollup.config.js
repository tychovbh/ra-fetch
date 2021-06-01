import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import json from 'rollup-plugin-json'

import pkg from './package.json'

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true
        }
    ],
    loaders: [
        {test: /\.json$/, loader: 'json-loader'}
    ],
    external: [
        'node-fetch'
    ],
    plugins: [
        external(),
        postcss({
            modules: true
        }),
        url(),
        svgr(),
        babel({
            exclude: 'node_modules/**',
            plugins: ['external-helpers', 'transform-runtime'],
            runtimeHelpers: true
        }),
        resolve(),
        commonjs(),
        json()
    ]
}
