const paths = require('./config/paths');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    require('postcss-import')({
      path: [paths.srcStyle],
    }),
    require('postcss-nested')(),
    // require('postcss-custom-properties')(),
    require('postcss-flexbugs-fixes')(),
    require('autoprefixer')({
      browsers: ['last 3 versions', 'IE >= 9', 'Edge <= 15'],
    }),
    require('postcss-calc')(),
    // require('postcss-custom-properties')(),
    // require('postcss-assets')({
    //   basePath: './assets',
    // }),
    postcssPresetEnv({
      browsers: 'last 2 versions',
      // stage: 2,
      // features: {
      //   'nesting-rules': true,
      //   'color-mod-function': {
      //     unresolved: 'warn',
      //   },
      // },
    }),
    // require('postcss-normalize')(),
  ],
  sourceMap: true,
};
