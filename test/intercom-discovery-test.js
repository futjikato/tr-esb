(function (module) {
    'use strict';

    var vows = require('vows'),
        assert = require('assert'),
        config = require('./../src/Config'),
        request = require('request');

    var InterCom = require('./../src/InterCom').InterCom;

    var Errors = require('./../src/Errors');

    config.set('intercomhttp', 9912);
    config.set('accesstoken', 'TESTACCESS');

    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
    });

    vows.describe('ESB InterCom').addBatch({
        'Start a InterCom HTTP server.': {
            topic: function () {
                try {
                    var a = new InterCom(this.callback);
                } catch (e) {
                    this.callback(e);
                }
            },

            'PUT a new services': {
                topic: function () {
                    request.put({
                        url: {
                            protocol: 'http:',
                            hostname: 'localhost',
                            port: 9912,
                            pathname: '/discovery'
                        },
                        headers: {
                            'Service-Key': 'VOWSJS-TESTSERVICE',
                            'Esb-Access-Token': 'TESTACCESS',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ip:'127.0.0.1', port:9913})
                    }, this.callback);
                },

                'with a "200" status code': function(resp) {
                    assert.equal(resp.statusCode, 200);
                },

                'list of known services should be provided but empty': function(err, resp, body) {
                    var json = null;
                    assert.doesNotThrow(function() {
                        json = JSON.parse(body);
                    });

                    assert.isArray(json.services);
                    assert.isEmpty(json.services);
                }
            },

            teardown : function (intercom) {
                intercom.stop();
            }
        }
    }).export(module);
})(module);