/**
 * Futjikato TR ESB
 */
var extend = require('extend');

// @todo First read configuration from config file
var defaults = {
    intercomTcpPort: 9987
};
var config = extend({}, defaults, {});

// Start a new routing storage
var Router = require('./../src/Storage/Routing').Router,
    router = new Router();

// Start the inter-service-communication server
var InterCom = require('./Server/InterCom').InterCom,
    comServer = new InterCom(config.intercomTcpPort);

comServer.on('registerService', function() {
    console.log('new service registered');
});

comServer.on('registerService', function() {
    console.log('new service registered');
});