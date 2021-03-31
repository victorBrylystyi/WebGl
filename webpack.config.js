const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: '/src/index.js',
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'bundle.js',
  },
  devServer: {
    overlay: true,
    port: 9000
  },
  plugins:[ 
      new htmlWebpackPlugin ({template:'./index.html'})
  ]
};