const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = require('../env')();

const shared = [];

const client = [
  new webpack.DefinePlugin(env.stringified),
  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __CLIENT__: 'true',
  }),
  new MiniCssExtractPlugin({
    filename: process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: process.env.NODE_ENV === 'development' ? '[id].css' : '[id].[contenthash].css',
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new ManifestPlugin({ fileName: 'manifest.json' }),
  // new WatcherReporterPlugin(),
];

if (process.env.NODE_ENV === 'production') {
  client.push(
    new CompressionPlugin({
      cache: true,
    })
  );
}

const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __CLIENT__: 'false',
  }),
  // new WatcherReporterPlugin(),
];

module.exports = {
  shared,
  client,
  server,
};
