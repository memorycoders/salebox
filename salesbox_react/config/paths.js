const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  clientBuild: resolveApp('build/client'),
  serverBuild: resolveApp('build/server'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  config: resolveApp('config'),
  srcClient: resolveApp('src/client'),
  srcServer: resolveApp('src/server'),
  srcStyle: resolveApp('src/style'),
  tmp: resolveApp('tmp'),
  publicPath: '/static/',
};

paths.resolveModules = [paths.srcClient, paths.srcServer, paths.srcStyle, paths.src, 'node_modules'];

module.exports = paths;
