(function(module) {

    var net = require('net'),
        extend = require('extend'),
        util = require('util'),
        events = require('events');

    var defaultOptions = {};

    function TcpServer(port, options) {
        events.EventEmitter.call(this);

        this.conf = extend({}, defaultOptions, options);

        var $this = this;
        this.server = net.createServer(function(socket) {
            var connection = new TcpConnection(socket);

        }).listen(port, function() {
            $this.emit('ready');
        });
    }

    util.inherits(TcpServer, events.EventEmitter);

    function TcpConnection() {
        events.EventEmitter.call(this);
    }

    module.exports = {
        TcpServer: TcpServer
    };
})(module);