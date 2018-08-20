
const getOptions = require('loader-utils').getOptions;

module.exports = function loader(source) {

    const options = getOptions(this);

    return source.replace(/\.([^\s]+)\s/g, '.$1' + (options.sufix || '-default-sufix') + ' ' );
}