const fixme = require('fixme');

fixme({
  path: process.cwd(),
  ignored_directories: ['node_modules/**', '.git/**'],
  file_patterns: ['src/**/*.js', 'config/**/*.js'],
  file_encoding: 'utf8',
  line_length_limit: 1000,
  skip: [],
});
