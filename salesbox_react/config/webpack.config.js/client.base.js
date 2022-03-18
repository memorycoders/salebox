const path = require('path');
const paths = require('../paths');
const { client: clientLoaders } = require('./loaders');
const resolvers = require('./resolvers');
const plugins = require('./plugins');

module.exports = {
  name: 'client',
  target: 'web',
  entry: {
    bundle: ['@babel/polyfill', path.resolve(__dirname, '../../src/client.js')],
  },
  output: {
    path: paths.clientBuild,
    filename: 'bundle.js',
    publicPath: paths.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    globalObject: 'this',
  },
  module: {
    rules: clientLoaders,
    noParse: /node_modules\/(?!(jsvat|fuzzy-search)\/).*\/quill\/dist/
  },
  resolve: { ...resolvers },
  plugins: [...plugins.shared, ...plugins.client],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
    occurrenceOrder: true,
    // concatenateModules: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]((?!(jsvat|fuzzy-search)).*)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
};
