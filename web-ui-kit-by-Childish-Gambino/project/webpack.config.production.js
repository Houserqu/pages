const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.less$/,
        use: ['style-loader', 'css-loader', {
          loader: 'less-loader',
        }],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false, // remove all comments
      },
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new ExtractTextPlugin({
      filename: '[hash].css'
    }),
  ]
}