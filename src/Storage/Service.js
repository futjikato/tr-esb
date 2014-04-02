(function(module) {
    'use strict';

    var util = require('util'),
        events = require('events'),
        extend = require('extend'),
        request = require('request'),
        url = require('url');

    /**
     * Service storage container
     *
     * @constructor
     */
    function ServiceStorage() {

        /**
         * Array with all known services.
         *
         * @type {Service[]}
         */
        this.services = [];
    }

    ServiceStorage.prototype.addService = function(service) {
        this.services.push();
    };

    /**
     * Service class
     * Represents a http service.
     * On initialization it will contact the remote source and identify all routes
     *
     * @constructor
     */
    function Service(basePath) {
        events.EventEmitter.call(this);

        this.basePath = basePath;

        this.routes = [];

        this._askRoutes();
    }
    util.inherits(Service, events.EventEmitter);

    Service.prototype._ask = function(path, cb) {
        var $this = this;
        // create full route
        var route = url.format({
            protocol: 'http',
            host: this.basePath,
            pathname: path
        });
        // request the full route
        request(route, function(err, response, body) {
            if(err) {
                $this.emit('error', err);
                return;
            }

            if(response.statusCode !== 200) {
                $this.emit('error', new Error('Wrong status code ' + response.statusCode));
                return;
            }

            try {
                cb(JSON.parse(body));
            } catch (e) {
                $this.emit('error', e);
            }
        });
    };

    Service.prototype._askRoutes = function() {
        var $this = this;
        this._ask('/routes', function(json) {
            if(!json.routes) {
                $this.emit('error', new Error('Missing routes array in /routes response.'));
                return;
            }
            $this.routes = json.routes;
            $this.emit('routes', $this.routes);
        });
    };

    Service.prototype.getRoutes = function() {
        return this.routes;
    };

    module.exports = {
        Service: Service,
        ServiceStorage: ServiceStorage
    };
})(module);