'use strict';

var glob        = require("glob");

var path        = require("path");

var fs          = require("fs");

const isObject  = require('nlab/isObject');

const log = require('inspc');

require('colors');

const th = msg => new Error(`utils.js error: ${msg}`);

function json(data) {
    return JSON.stringify(data, null, '    ').replace(/\\\\/g, '\\');
}

function findentries(root, mask) {

    if (typeof mask === 'undefined') {

        mask = "/**/*.entry.{js,jsx}";
    }

    const list = glob.sync(root + mask);

    let tmp, entries = {};

    for (let i = 0, l = list.length ; i < l ; i += 1) {

        tmp = path.parse(list[i]);

        tmp = path.basename(tmp.name, path.extname(tmp.name));

        if (entries[tmp]) {

            throw th("There are two entry files with the same name: '" + path.basename(entries[tmp]) + "'");
        }

        entries[tmp] = list[i];
    }

    return entries;
}

var utils = {
    config: false,
    setup: function (config) {

        if ( ! this.config && config ) {

            this.config = config;
        }

        // console && console.log && console.log('env: '.yellow + process.env.NODE_ENV.red + "\n");
        //
        // return process.env.NODE_ENV;
    },
    entries: function (mask, suppressNotFoundError) {

        var t, i, tmp = {}, root = this.config.js.entries;

        if (!root) {

            throw th("First specify root path for entry");
        }

        if (Object.prototype.toString.call( root ) !== '[object Array]') {

            root = [root];
        }

        root.forEach(function (r) {

            t = findentries(r, mask);

            for (i in t) {

                if (tmp[i]) {

                    throw th("There are two entry files with the same name: '" + path.basename(t[i]) + "'");
                }

                tmp[i] = t[i];
            }
        });

        if ( ! suppressNotFoundError && ! Object.keys(tmp).length) {

            throw th("Not found *.entry.js files in directories : \n" + json(root, null, '    '));
        }

        return tmp;
    },
    aliases: function () {

        const file = path.resolve(this.config.root, 'package.json');

        if ( ! fs.existsSync(file) ) {

            throw th(`file '${file}' doesn't exist`);
        }

        let json;

        try {

            json = require(file);
        }
        catch (e) {

            throw th(`json parsing error in file '${file}', error: ${e}`)
        }

        let paths;

        try {

            paths = json._moduleAliases;
        }
        catch (e) {

            throw th(`can't extract json._moduleAliases from file '${file}'`)
        }

        if ( ! isObject(paths) ) {

            throw th(`json._moduleAliases from file '${file}' is not an object`)
        }

        return Object.entries(paths).reduce((acc, [key, p]) => {

            const dir = path.resolve(this.config.root, p) + '/';

            try {

                fs.lstatSync(dir).isDirectory();
            }
            catch (e) {

                throw th(`can't determine if '${dir}' is a directory (check '${file}' _moduleAliases), error: ${e}`);
            }

            if ( ! fs.lstatSync(dir).isDirectory() ) {

                throw th(`'${dir}' is not a directory`);
            }

            acc[key] = dir;

            return acc;
        }, {});
    }
};

module.exports = utils;


