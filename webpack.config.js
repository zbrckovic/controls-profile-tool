const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = (env, argv) => {
  const mode = argv.mode || 'production'
  const isDevelopment = mode === 'development'

  return ({
    mode,
    entry: './src/index.tsx',
    output: {
      publicPath: isDevelopment ? '/' : '/controls-profile-tool',
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: [
        path.resolve(__dirname, './node_modules'),
        path.resolve(__dirname, './src')
      ],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:5]',
                },
              },
            },
          ],
          include: /\.module\.css$/,
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ],
          exclude: /\.module\.css$/,
        },
        {
          test: /\.html$/,
          type: 'asset/resource',
          include: [path.resolve(__dirname, './src/templates')]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin(),
      new CopyWebpackPlugin({
        patterns: [{ from: 'resources', to: 'resources' }]
      })
    ]
  })
}
