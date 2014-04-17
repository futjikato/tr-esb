(function(module) {
    'use strict';

    var http = require('http'),
        url = require('url'),
        config = require('./Config');

    /**
     * Inter-Service-Communication manager class.
     * Stats the InterCom-Server
     *
     * @constructor
     */
    function InterCom(cb) {
        if(typeof cb !== 'function') {
            cb = function() {};
        }

        this.port = config.intercomhttp;
        this.server = http.createServer(this.accept);
        this.server.listen(this.port, cb);
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
        var parsedUrl = url.parse(res.url);

        if(!this.validateAccessToken(req.headers['Esb-Access-Token'])) {
            res.writeHead(403, 'Invalid access token');
            res.end();
            return;
        }

        if(!this.validateServiceKey(req.headers['Service-Key'])) {
            res.writeHead(403, 'Invalid service key');
            res.end();
            return;
        }

        res.writeHead(404, 'Unknown path.');
        res.end();
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
            token === config.accesstoken
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

    module.exports = {
        InterCom: InterCom
    };
})(module);