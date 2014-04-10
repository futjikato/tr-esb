(function(module) {
    'use strict';

    var http = require('http');

    /**
     * Inter-Service-Communication Server.
     * HTTP server for services and clients to connect to.
     *
     * @param {int} port
     * @constructor
     */
    function ComServer(port) {
        this.port = port;
        this.server = http.createServer(this.accept);
    }

    /**
     * Start listening on the port given at initialization.
     *
     * @param {function} cb
     */
    ComServer.prototype.listen = function(cb) {
        this.server.listen(this.port, cb);
    };

    /**
     * Stop listening
     */
    ComServer.prototype.stop = function() {
        this.server.close();
    };

    /**
     * Accept method is called for every incoming connection.
     * This method should implement protocoll logic and decide if the connection
     * is a service ( server ) or a client.
     *
     * @param {http.ClientRequest} req
     * @param {http.ServerResponse} res
     */
    ComServer.prototype.accept = function(req, res) {
        res.writeHead(200);
        res.end();
    };

    /**
     * Inter-Service-Communication manager class.
     * Stats the InterCom-Server
     *
     * @param {{}} config
     * @constructor
     */
    function InterCom(config) {
        this.config = config;

        this.server = new ComServer(config.ports.intercomhttp);
    }

    /**
     * Enable Inter-Service-Communication.
     *
     * @param cb
     */
    InterCom.prototype.work = function(cb) {
        this.server.listen(cb);
    };

    /**
     * Disable Inter-Service-Communication.
     */
    InterCom.prototype.stop = function() {
        this.server.stop();
    };

    module.exports = {
        ComServer: ComServer,
        InterCom: InterCom
    };
})(module);