const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const babel = require('@rollup/plugin-babel');
const typescript = require('@rollup/plugin-typescript');
const { dts } = require('rollup-plugin-dts');
const pkg = require('./package.json');

const input = ['src/index.ts'];
const defaultOptions = {
	exports: 'default',
	sourcemap: true,
};

module.exports = [
	{
		// UMD
		input,
		plugins: [
			nodeResolve(),
			babel({
				babelHelpers: 'bundled',
			}),
			terser(),
			typescript({ compilerOptions: { declaration: true, declarationDir: 'dist/dts' } }),
		],
		output: {
			file: `dist/${pkg.name}.min.js`,
			format: 'umd',
			name: 'Song',
			esModule: false,
			...defaultOptions,
		},
	},
	// ESM and CJS
	{
		input,
		plugins: [nodeResolve(), typescript()],
		output: [
			{
				dir: 'dist/esm',
				format: 'esm',
				...defaultOptions,
			},
			{
				dir: 'dist/cjs',
				format: 'cjs',
				...defaultOptions,
			},
		],
	},
	{
		input: './dist/dts/index.d.ts',
		plugins: [dts()],
		output: {
			file: 'dist/index.d.ts',
			format: 'es',
		},
	},
];