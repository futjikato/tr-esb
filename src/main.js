/**
 * Futjikato TR ESB
 */
(function() {
    'use strict';

    var extend = require('extend');

    // @todo First read configuration from config file
    var defaults = {
        ports: {
            intercomhttp: 9989
        }
    };
    var config = extend({}, defaults, {});

    var InterCom = require('./InterCom').InterCom,
        com = new InterCom(config);

    com.work();
})();
