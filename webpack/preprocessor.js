
require('module-alias/register')

const path = require("path");

const fs = require("fs");

const log = require("inspc");

const mkdirp = require("mkdirp");

const stringToRegex = require('nlab/stringToRegex');

const env = require('@root/libs/env');

const webpack = require('@root/config')(env('NODE_ENV'));

if ( typeof webpack.server.preprocessor !== 'string') {

  throw new Error(`webpack.server.preprocessor is not a string`);
}

const targets = [
  // path.resolve(__dirname, "..", "public", "preprocessed.js"),
  // path.resolve(__dirname, "..", "build", "preprocessed.js"),

  webpack.server.preprocessor,
];

const result = require('dotenv').config();

// const env = require("dotenv-up")(
//   {
//     override: false,
//     deep: 2,
//   },
//   true,
//   "preprocessor.js"
// );

const EXPOSE_EXTRA_ENV_VARIABLES = (function (e) {

  return stringToRegex(e);

}(env('EXPOSE_EXTRA_ENV_VARIABLES')));

const preprocessed = Object.keys(result.parsed).reduce((acc, key) => {

  if (EXPOSE_EXTRA_ENV_VARIABLES.test(key)) {

    acc[key] = env(key);
  }

  return acc;
}, {});

console.log("\nWeb exposed environment variables: \n");

const max = Object.keys(preprocessed).reduce((acc, val) => {
  const l = val.length;

  if (l > acc) {
    return l;
  }

  return acc;
}, 0);

Object.keys(preprocessed).map(key => {
  const l = key.length;

  let k = key;

  if (l < max) {
    k += " ".repeat(max - l);
  }

  console.log("    ", k, ":", env(key));
});

targets.forEach(target => {
  console.log("");

  console.log(`Saving ${target}`);

  const dir = path.dirname(target);

  if ( ! fs.existsSync(dir) ) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(
    target,
    `        
window.log = (function () {
    try {
        return console.log;
    }
    catch (e) {
        return function () {};
    }
}());

window.env = (function (e) {

    return function (key, def) {
    
        if (typeof key === 'undefined') {
        
            return Object.assign({}, e);
        }
        
        if (typeof key !== 'string') {
        
            throw new Error("window.env() error: key is not a string");
        }
        
        if ( ! key.trim() ) {
        
            throw new Error("window.env() error: key is an empty string");
        }
        
        var val = e[key];
        
        if ( typeof val === 'undefined') {
            
            return def;
        }
        
        return val;
    }
}(${JSON.stringify(preprocessed, null, 4)}))

log("const env = window.env")
  
  `
  );

  if (!fs.existsSync(target)) {
    // warning: if under dirfile there will be broken link (pointing to something nonexisting) then this function will return false even if link DO EXIST but it's broken

    throw new Error(`File '${target}' creation failed`);
  }
});
