const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const createMinifier = require('css-loader-minify-class');
const fs = require('fs');
const path = require('path');
const paths = require('../../config/paths');

const WEBPACK_PORT =
  process.env.WEBPACK_PORT ||
  (!isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) + 1 : 8501);

let babelConfig;

try {
  const contents = fs.readFileSync(path.resolve(__dirname, '../../.babelrc')).toString('utf8');
  babelConfig = JSON.parse(contents);
} catch (e) {
  console.error(path.resolve(__dirname, '../../.babelrc'), 'not found');
  babelConfig = undefined;
}

const babelLoaderClient = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules\/(?!(jsvat|fuzzy-search)\/).*/,
  use: {
    loader: 'babel-loader',
    options: babelConfig,
  },
};

const babelLoaderServer = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      ...babelConfig,
      plugins: [...babelConfig.plugins, 'babel-plugin-dynamic-import-node'],
    },
  },
};

const cssLoaderClient = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    'css-hot-loader',
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        camelCase: true,
        modules: true,
        importLoaders: 1,
        sourceMap: true,
        ident: 'css',
        localIdentName: '[name]_[local]-[hash:2]',
        // minimize: true,
        // getLocalIdent: createMinifier(),
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

const cssLoaderServer = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'css-loader/locals',
      options: {
        camelCase: true,
        importLoaders: 1,
        modules: true,
        ident: 'css',
        localIdentName: '[name]_[local]-[hash:2]',
        // minimize: true,
        // getLocalIdent: createMinifier(),
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

const lessLoaderClient = {
  test: /\.less$/,
  use: [
    {
      loader: 'css-hot-loader',
    },
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'less-loader',
    },
  ],
};

const lessLoaderServer = {
  test: /\.less$/,
  use: [
    {
      loader: 'css-loader',
    },
    {
      loader: 'less-loader',
    },
  ],
};

const imageLoaderClient = {
  test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.mp3$|\.svg$/,
  loader: 'file-loader',
  exclude: [/\.(config|overrides|variables)$/],
  options: {
    name: 'assets/[name].[hash:8].[ext]',
  },
};

const imageLoaderServer = {
  ...imageLoaderClient,
  options: {
    ...imageLoaderClient.options,
    emitFile: false,
  },
};

const woffLoaderClient = {
  test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    mimetype: 'application/font-woff',
    name: 'assets/[name].[hash:8].[ext]',
  },
};

const woffLoaderServer = {
  ...woffLoaderClient,
  options: {
    ...woffLoaderClient.options,
    emitFile: false,
  },
};

const ttfLoaderClient = {
  test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'file-loader',
  // exclude: [/\.(config|overrides|variables)$/],
};

const ttfLoaderServer = {
  ...ttfLoaderClient,
  options: {
    emitFile: false,
  },
};

const otfLoaderClient = {
  test: /\.otf(\?.*)?$/,
  loader: 'file-loader',
  // exclude: [/\.(config|overrides|variables)$/],
  options: {
    mimetype: 'application/font-otf',
  },
};

const otfLoaderServer = {
  ...otfLoaderClient,
  options: {
    emitFile: false,
  },
};

// Write css files from node_modules to its own vendor.css file
const externalCssLoaderClient = {
  test: /\.css$/,
  include: /node_modules/,
  use: [MiniCssExtractPlugin.loader, 'css-loader'],
};

// Server build needs a loader to handle external .css files
const externalCssLoaderServer = {
  test: /\.css$/,
  include: /node_modules/,
  loader: 'css-loader/locals',
};

const workerLoaderClient = {
  test: /\.worker\.js$/,
  use: [
    {
      loader: 'worker-loader',
      options: {
        publicPath: process.env.NODE_ENV === 'development' ? `http://localhost:${WEBPACK_PORT - 1}${paths.publicPath}` : undefined,
      },
    },
    {
      loader: 'babel-loader',
      options: babelConfig,
    },
  ],
};

// const htmlLoaderClient = {
//   test: /\.(html)$/,
//   use: [
//     {
//       loader: 'html-loader',
//       options: {
//         attrs: false,
//         // attrs: [':data-src'],
//         minimize: true,
//         removeComments: false,
//         collapseWhitespace: false
//       },
//     }
//   ],
// };

const client = [
  {
    oneOf: [
      workerLoaderClient,
      babelLoaderClient,
      lessLoaderClient,
      imageLoaderClient,
      woffLoaderClient,
      ttfLoaderClient,
      otfLoaderClient,
      // htmlLoaderClient,
      // fileLoaderClient,
      // ttfLoaderClient,
      externalCssLoaderClient,
      cssLoaderClient,
    ],
  },
];
const server = [
  {
    oneOf: [
      babelLoaderServer,
      cssLoaderServer,
      lessLoaderServer,
      imageLoaderServer,
      woffLoaderServer,
      ttfLoaderServer,
      otfLoaderServer,
      // htmlLoaderClient,
      // fileLoaderServer,
      // ttfLoaderServer,
      externalCssLoaderServer,
    ],
  },
];

module.exports = {
  client,
  server,
};
