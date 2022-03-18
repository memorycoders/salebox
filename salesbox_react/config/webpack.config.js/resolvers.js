const paths = require('../paths');

module.exports = {
  extensions: ['.js', '.mjs', '.json', '.jsx', '.css'],
  modules: paths.resolveModules,
  alias: {
    '../../theme.config$': `${paths.srcStyle}/semantic-theme/theme.config`,
    config: paths.config,
  },
};
