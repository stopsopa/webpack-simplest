
require('module-alias/register');

const express = require ('express');

const path = require ('path');

const os = require ('os');

const app = express();

const compression   = require('compression');

const env = require('@root/libs/env');

require('dotenv').config()

const host = env("HOST");

const port = env("PORT");

const configWebpack = require('./config')('production');

(function (h) {
  app.use((req, res, next) => {
      res.set('X-hostname', h);
      const reg = /^[a-z\d_]+$/;
      res.label = label => {
          if (typeof label !== 'string' || !label.trim()) {

              throw new Error(`req.label() error: label is not a valid string, it is '${label}'`);
          }
          if ( ! reg.test(label) ) {

              throw new Error(`req.label() error: label (${label}) don't match regex ${reg}`);
          }

          res.set(`X-controller`, label);
      }
      next();
  })
}(os.hostname()));

app.set('etag', false);
app.set('x-powered-by', false);

// app.use(require('libs/express-extend-res')(isProd, res => {

//   try {

//       const ct = res.get('content-type');

//       if ( ct && typeof ct === 'string') {

//           if ( ct.includes('text/html') ) {

//               // res.set('Cache-Control', 'no-store');

//               res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
//           }
//       }
//   }
//   catch (err) {

//       log.dump({
//           location: 'app => index.server.js => libs/express-extend-res',
//           err,
//       }, 4);
//   }
// }, false));

const requestIp = require('request-ip');

app.use(requestIp.mw());

const server    = require('http').createServer(app);

app.set('json spaces', 4);

// const io        = require('socket.io')(server); // io

app.use(compression({filter: (req, res) => {
  if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}}));

app.use(express.static(configWebpack.public, {
  maxAge: '356 days',
  index: false,
}));

// https://github.com/expressjs/express/blob/4.16.4/lib/express.js#L81
// https://expressjs.com/en/4x/api.html#express.urlencoded
// app.use(bodyParser.urlencoded({extended: false})); // no need to do it like this because bodyParser is part of express
app.use(express.urlencoded({extended: false}));

// https://github.com/expressjs/express/blob/4.16.4/lib/express.js#L78
// https://expressjs.com/en/4x/api.html#express.json
// app.use(bodyParser.json()); // no need to do it like this because bodyParser is part of express
app.use(express.json());

// configServer.knex && (async function () {

//   const knex              = require('knex-abstract');

//   knex.init(configServer.knex);

//   await knex().model.common.howMuchDbIsFasterThanNode(true); // crush if greater than 5 sec
// }());

app.use(require('./controllers')());

require('./app/test/server')({
  app,
  configWebpack
});

require('./app/front/server')({
  app,
  configWebpack
});

// for sockets
server.listen( // ... we have to listen on server
  port,
  host,
  undefined, // io -- this extra parameter
  () => {

      console.log(`\n 🌎  Server is running http://${host}:${port} \n`)
  }
);