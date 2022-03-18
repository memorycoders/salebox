const paths = require('./config/paths');

module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true,
    jest: true,
    mocha: true,
  },
  extends: [
    'wiremore',
    'wiremore/react',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
    'plugin:flowtype/recommended',
  ],
  plugins: ['jsx-a11y', 'redux-saga', 'security', 'prettier', 'flowtype'],
  settings: {
    'import/resolver': {
      node: {
        paths: paths.resolveModules,
      },
    },
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  rules: {
    'prettier/prettier': 2,
    indent: ['error', 2],
    // 'no-param-reassign': [ 'warn', { 'props': true, 'ignorePropertyModificationsFor': ['draft'] }],
    'import/named': 0,
    'import/no-unassigned-import': 0,
    'import/no-named-as-default-member': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
  globals: {
    addTranslations: true,
    oxygenCss: true,
    shallow: true,
  },
};
