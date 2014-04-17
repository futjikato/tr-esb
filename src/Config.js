(function(module) {
    'use strict';

    var extend = require('extend');

    // define defaults
    var defaults = {
        intercomhttp: 9989
    };

    // todo read config from config file
    var readConfig = {};

    module.exports = extend(true, {}, defaults, readConfig);;
})(module);