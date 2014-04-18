(function(module) {
    'use strict';

    var extend = require('extend'),
        fs = require('fs'),
        path = require('path');

    // define defaults
    var defaults = {
        intercomhttp: 9989
        // accesstoken: No default for secrets cause people are stupid and do not change this
    };

    var readConfig = {};
    try {
        var configStr = fs.readFileSync(path.join(process.cwd(), '../config.json'));
        readConfig = JSON.parse(configStr);
    } catch(e) {
        console.error('Unable to read config file. Using defaults instead.');
        readConfig = {};
    }

    var config = extend(true, {}, defaults, readConfig);

    module.exports = {
        get: function(name) {
            return config[name];
        },
        set: function(name, value) {
            config[name] = value;
        }
    };
})(module);