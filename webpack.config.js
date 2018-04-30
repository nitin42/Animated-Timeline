const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const output = () => ({
  filename: 'animated-timeline.min.js',
  path: path.resolve(__dirname, './build'),
  publicPath: '/',
  libraryTarget: 'umd'
})

const externals = () => ({
  fastdom: 'fastdom',
  'html-tags': 'html-tags',
  invariant: 'invariant',
  'prop-types': 'prop-types',
  rebound: 'rebound',
  'svg-tag-names': 'svg-tag-names',
  'react': 'react',
})

const jsLoader = () => ({
  test: /\.js$/,
  include: path.resolve(__dirname, './src'),
  exclude: ['node_modules', 'public', 'demo', 'dist', '.cache', 'docs', 'examples', 'media', 'flow-typed'],
  use: 'babel-loader'
})

const plugins = () => [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new UglifyJSPlugin()
]

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  mode: 'production',
  output: output(),
  target: 'web',
  externals: externals(),
  devtool: 'source-map',
  module: {
    rules: [jsLoader()]
  },
  plugins: plugins()
}
