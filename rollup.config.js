// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        resolve(),
        commonjs(),
    ]
};

  