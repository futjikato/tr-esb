(function(module) {
    'use strict';

    var vows = require('vows'),
        assert = require('assert'),
        http = require('http');

    var Service = require('./../src/Service').Service;

    // somehow complex and shitty way to fix race condition. What is first test or http server ?
    var serverReadyState = false,
        queue = [];

    var releaser = function(go) {
        // if test wants to start and server is already ready go
        if(serverReadyState) {
            go();
        } else {
            // else wait for server
            queue.push(go);
        }
    };

    // server is ready check if test(s) are waiting
    var wakeUp = function() {
        queue.forEach(function(i, fn) {
            fn();
        });
    };

    vows.describe('ESB Services').addBatch({
        'A service on port 9989': {
            topic: function() {
                var $this = this;
                releaser(function() {
                    $this.callback(null, new Service('FAKE-SERVICE', 'localhost:9989'));
                });
            },

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

    // spin up the fake service on port 9989
    http.createServer(function(req, resp) {
        if(req.method === 'GET') {
            resp.writeHead(200, {
                'Content-Type': 'application/json'
            });
            resp.end('{"foo":"bar"}', 'utf8');
        }
    }).listen(9989, function() {
        // mark server as ready
        serverReadyState = true;
        // wake may waiting tests
        wakeUp();
    });
})(module);