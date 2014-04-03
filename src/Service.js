(function(module) {
    'use strict';

    var util = require('util'),
        events = require('events'),
        extend = require('extend'),
        request = require('request'),
        url = require('url');

    /**
     * Service class
     * Represents a http service.
     * On initialization it will contact the remote source and identify all routes
     *
     * @constructor
     */
    function Service(id, basePath) {
        events.EventEmitter.call(this);

        /**
         * Service id.
         *
         * @type {string}
         */
        this.id = id;

        /**
         * The base path should consist of a hostname and a port.
         * e.g localhost:8898
         *
         * @type {string}
         */
        this.basePath = basePath;
    }
    util.inherits(Service, events.EventEmitter);

    /**
     * Make an HTTP request to the service.
     *
     * @param {string} method
     * @param {{}||function} data
     * @param {function} cb
     */
    Service.prototype.http = function(method, data, cb) {
        var $this = this;

        // build options object for request
        var options = {
            uri : url.format({
                protocol: 'http', // @todo implement service config to use https
                host: this.basePath
            }),
            headers: {}
        };

        // data is optional while cb is required
        if(typeof data === 'function' && typeof cb === 'undefined') {
            cb = data;
            data = undefined;
        }

        // last check for a cb
        if(typeof cb === 'undefined') {
            throw new Error('You need to provide a callback method. Only data is optional.');
        }

        // if data is present set as request body
        if(data) {
            // stringify object
            if(typeof data !== 'object') {
                throw new Error('');
            }

            options.headers['Content-type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        request(options, function(err, response, body) {
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

    module.exports = {
        Service: Service
    };
})(module);