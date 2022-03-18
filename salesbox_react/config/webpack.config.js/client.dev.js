const baseConfig = require('./client.base');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

const config = {
  ...baseConfig,
  plugins: [new WriteFileWebpackPlugin(), new webpack.HotModuleReplacementPlugin(), ...baseConfig.plugins],
  mode: 'development',
  devtool: 'eval-source-map',
  performance: {
    hints: false,
  },
};

module.exports = config;
