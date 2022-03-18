const mainWebpackConfig = require('../config/webpack.config.js/client.dev');

module.exports = {
  resolve: mainWebpackConfig.resolve,
  plugins: mainWebpackConfig.plugins,
  module: mainWebpackConfig.module,
};
