
const path              = require("path");

const root              = path.resolve(__dirname);

const vardir            = path.resolve(root, 'var');

const public            = path.resolve(root, 'public');

const node_modules      = path.resolve(root, 'node_modules');

const app               = path.resolve(root, 'app');

const override          = path.resolve(app, 'override');

// relative path to public server directory
const output            = path.resolve(public, 'dist');

require('dotenv').config();

const env = require('@root/libs/env');

const isProd = env('NODE_ENV') === 'production';

module.exports = mode => ({
  // just name for this project, it's gonna show up in some places
  name: env('PROJECT_NAME'),
  root,
  app,
  node_modules,
  vardir,
  output,
  public,
  isProd,
  resolve: [ // where to search by require and files to watch

    app,

    override,

    'node_modules', // https://github.com/ReactTraining/react-router/issues/6201#issuecomment-403291934
  ],
  js: {
    entries: [ // looks for *.entry.{js|jsx} - watch only on files *.entry.{js|jsx}
      app,
    ],
  },
  server: {
    preprocessor  : path.resolve(public, "preprocessed.js"),
    buildtime     : path.resolve(public, 'buildtime.js'),
  },
});

