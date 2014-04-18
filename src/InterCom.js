(function(module) {
    'use strict';

    var http = require('http'),
        url = require('url'),
        config = require('./Config'),
        Errors = require('./Errors');

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

        this.port = config.get('intercomhttp');
        console.log('Starting InterCom on port:', this.port);

        this.running = false;

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
     * This method should implement protocoll logic and decide if the connection
     * is a service ( server ) or a client.
     *
     * @param {http.ClientRequest} req
     * @param {http.ServerResponse} res
     */
    InterCom.prototype.accept = function(req, res) {
        var parsedUrl = url.parse(req.url);

        if(!this.validateAccessToken(req.headers['esb-access-token'])) {
            res.writeHead(403, 'Invalid access token');
            res.end();
            return;
        }

        if(!this.validateServiceKey(req.headers['service-key'])) {
            res.writeHead(403, 'Invalid service key');
            res.end();
            return;
        }

        switch(parsedUrl.pathname) {
            case '/':
                res.writeHead(204);
                res.end();
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
        this.server.stop();
    };

    InterCom.prototype.isRunning = function() {
        return this.running;
    };

    module.exports = {
        InterCom: InterCom
    };
})(module);