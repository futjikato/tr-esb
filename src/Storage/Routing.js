(function(module) {
    'use strict';

    var Errors = require('./../Errors'),
        Service = require('./../Service').Service;

    /**
     * ESB Router
     * Works like a switch in a network.
     * Every incoming request must have a route for the target application.
     * The router checks for the best matching route and directs the request to
     * that application. If the application si not able to handle the request
     * the router will broadcast the request to all known application.
     * The answering application will be saved in the routing table to be directly
     * asked on the next request.
     *
     * @constructor
     */
    function Router() {

        /**
         * Routing table
         *
         * @type {{}}
         * @private
         */
        this._storage = {};

    }

    /**
     * Checks if teh given service id is existing in the storage.
     *
     * @param {string} serviceId
     *
     * @return {boolean}
     */
    Router.prototype.has = function(serviceId) {
        return !!this._storage[serviceId];
    };

    /**
     * Send the message object to the server responsible for handling the route.
     *
     * @param {string} serviceId
     *
     * @return {Service}
     */
    Router.prototype.get = function(serviceId) {
        if(!this._storage[serviceId]) {
            throw new Error('Service not found. ' + serviceId);
        }

        return this._storage[serviceId];
    };

    /**
     * Publish a new route with a server to target on requests for the given route.
     *
     * @param {Service} service
     */
    Router.prototype.add = function(service) {
        if(!service instanceof Service) {
            throw new Error('Service storage only can contain instances of the Service prototype.');
        }

        if(this._storage[service.id]) {
            throw new Error('Service ID is already in use: ' + service.id);
        }

        this._storage[service.id] = service;
    };

    // export modules
    module.exports = {
        Router: Router
    };
})(module);