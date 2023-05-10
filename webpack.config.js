const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({ mode }) => ({
  mode: mode || 'development',
  entry: './src/index.jsx',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
})
