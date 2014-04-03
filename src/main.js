/**
 * Futjikato TR ESB
 */
(function() {
    'use strict';

    var extend = require('extend');

    // @todo First read configuration from config file
    var defaults = {
        intercomTcpPort: 9987
    };
    var config = extend({}, defaults, {});

    // Start a new routing storage
    var Router = require('./../src/Storage/Routing').Router,
        router = new Router();


})();
