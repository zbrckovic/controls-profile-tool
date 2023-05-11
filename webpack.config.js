const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode || 'production'
  const isDevelopment = mode === 'development'

  return ({
    mode,
    entry: './src/index.jsx',
    output: {
      publicPath: isDevelopment ? '/' : '/controls-profile-tool',
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css'],
      modules: [path.resolve(__dirname, './node_modules')],
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
}
