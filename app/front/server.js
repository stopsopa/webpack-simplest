
const path = require('path');

const log = require('inspc');

const se = require('nlab/se')

module.exports = ({
  app,
  configWebpack,
}) => {

  const ifDevUseFileModificationTime = (function () {

    if (process.env.NODE_ENV !== "production") {

      try {

        const w           = require('@root/webpack.config');

        return path.resolve(w.output.path, w.output.filename.replace(/\[name\]/g, Object.keys(w.entry)[0]));
      }
      catch (e) {

        log.dump({
          ifDevUseFileModificationTime_error: e,
        })
      }
    }
  }());

  const template = require('@root/webpack/server-template')({
    buildtimefile   : configWebpack.server.buildtime,
    tempatefile     : path.resolve(__dirname, 'index.html'),
    isProd          : configWebpack.isProd
  })

  app.get('*', (req, res) => {

    try {

      let mtime;

      if (ifDevUseFileModificationTime) {

        try {

          if (fs.existsSync(ifDevUseFileModificationTime)) {

            const stats = fs.statSync(ifDevUseFileModificationTime);

            mtime = (stats.mtime).toISOString().substring(0, 19).replace('T', '_').replace(/:/g, '-') + '_dev_mtime'
          }
        }
        catch (e) {

        }
      }

      let tmp = template({
        mode            : process.env.NODE_ENV || 'undefined',
        mtime,
      });

      res.send(tmp);
    }
    catch (e) {

      log.dump({
        'front_server_general_error': se(e),
      });

      res
        .status(500)
        .send("front server error")
      ;
    }
  });
}