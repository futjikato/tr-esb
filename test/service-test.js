(function(module) {
    'use strict';

    var vows = require('vows'),
        assert = require('assert'),
        http = require('http');

    // spin up the fake service on port 9989
    http.createServer(function(req, resp) {
        if(req.method === 'GET') {
            resp.writeHead(200, {
                'Content-Type': 'application/json'
            });
            resp.end('{"foo":"bar"}', 'utf8');
        }
    }).listen(9989);

    var Service = require('./../src/Service').Service;

    vows.describe('ESB Services').addBatch({
        'A service on port 9989': {
            topic: new Service('localhost:9989'),

            'should respond to a request': {
                topic: function(service) {
                    var $this = this;
                    service.http('GET', function(json) {
                        $this.callback(null, json);
                    });
                },

                'and provide some kind of data': function(data) {
                    assert.isObject(data);
                },

                'and the data should be equal with what we expect': function(data) {
                    assert.deepEqual(data, {foo:'bar'});
                }
            }
        }
    }).export(module);
})(module);