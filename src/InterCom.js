(function(module) {
    'use strict';

    var http = require('http'),
        url = require('url'),
        config = require('./Config'),
        Errors = require('./Errors'),
        Router = require('./Routing').Router,
        Service = require('./Service').Service;

    function jsonMessage(req, cb) {
        var body = '';
        req.on('data', function(str) {
            body += str;
        });

        req.on('end', function() {
            try {
                var json = JSON.parse(body);

                if(!json) {
                    cb(new Error('Invalid JSON data.'));
                    return;
                }

                cb(null, json);
            } catch (e) {
                cb(new Error('Unable to parse request body as JSON.'));
            }
        });
    }

    /**
     * Inter-Service-Communication manager class.
     * Stats the InterCom-Server
     *
     * @constructor
     */
    function InterCom(cb) {
        var $this = this;

        if(!config.get('intercomhttp')) {
            throw new Errors.InterComException('No intercom http port given in configuration');
        }

        if(typeof cb !== 'function') {
            cb = function() {};
        }

        // port
        this.port = config.get('intercomhttp');
        console.log('Starting InterCom on port:', this.port);

        // running
        this.running = false;

        // routing
        this.router = new Router();

        // server setup
        this.server = http.createServer(function(req, res) {
            $this.accept(req, res);
        });

        this.server.on('error', function (e) {
            if (e.code === 'EADDRINUSE') {
                console.log('Address in use, retrying...');
                setTimeout(function () {
                    $this.server.close();
                    $this.server.listen($this.port, cb);
                }, 1000);
            }
        });

        this.server.listen(this.port, function() {
            $this.running = true;
            cb(null, $this);
        });
    }

    /**
     * Accept method is called for every incoming connection.
     * This method should implement protocol logic and decide if the connection
     * is a service ( server ) or a client.
     *
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    InterCom.prototype.accept = function(req, res) {
        var parsedUrl = url.parse(req.url);

        // check for a valid access token
        if(!this.validateAccessToken(req.headers['esb-access-token'])) {
            res.writeHead(403, 'Invalid access token');
            res.end();
            return;
        }

        // check for ... a service key in general
        if(!this.validateServiceKey(req.headers['service-key'])) {
            res.writeHead(403, 'Invalid service key');
            res.end();
            return;
        }

        // routing
        switch(parsedUrl.pathname) {

            // status/ping
            case '/':
                res.writeHead(204);
                res.end();
                break;

            // service discovery
            case '/discovery':
                this.actionDiscovery(req, res);
                break;

            default:
                res.writeHead(404, 'Unknown path.');
                res.end();
        }
    };

    /**
     * Validate the access token.
     * Uses Config module for validation.
     *
     * @param {string} token
     * @returns {boolean}
     */
    InterCom.prototype.validateAccessToken = function(token) {
        return (
            token &&
            typeof token === 'string' &&
            token === config.get('accesstoken')
        );
    };

    /**
     *
     * @param key
     * @returns {*|boolean}
     */
    InterCom.prototype.validateServiceKey = function(key) {
        return (
            key &&
            typeof key === 'string' &&
            key.length > 3
        );
    };

    /**
     * Disable Inter-Service-Communication.
     */
    InterCom.prototype.stop = function() {
        this.running = false;
        this.server.close();
    };

    /**
     * Returns true if the http server is running.
     *
     * @returns {boolean}
     */
    InterCom.prototype.isRunning = function() {
        return this.running;
    };

    /**
     * +++++++++++++++++++++
     * ++++++ ACTIONS ++++++
     * +++++++++++++++++++++
     */

    /**
     * Process a /discovery request
     *
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    InterCom.prototype.actionDiscovery = function(req, res) {
        var $this = this;

        if(req.method !== 'PUT' && req.method !== 'POST') {
            res.writeHead(405);
            res.end();
            return;
        }

        var serviceKey = this.validateServiceKey(req.headers['service-key']);

        if(this.router.has(serviceKey)) {
            res.writeHead(409, 'Service key already in use');
            res.end();
            return;
        }

        jsonMessage(req, function(err, json) {
            if(err) {
                console.error(err);
                // todo log error
                res.writeHead(500, 'Server error');
                res.end();
                return;
            }

            if(!json.ip || !json.port) {
                res.writeHead(400, 'Missing IP or PORT.');
                res.end();
                return;
            }

            var basePath = json.ip + ':' + json.port,
                service = new Service(serviceKey, basePath);

            try {
                var jsonStr = JSON.stringify({
                    services: $this.router.getList()
                });

                $this.router.add(service);

                res.setHeader('Content-Length', jsonStr.length);
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.write(jsonStr);
                res.end();
                console.log(jsonStr);
            } catch (e) {
                console.error(e);
                // todo log error
                res.writeHead(500);
                res.end();
            }
        });
    };

    module.exports = {
        InterCom: InterCom
    };
})(module);