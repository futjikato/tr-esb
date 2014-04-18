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

    process.on('uncaughtException', function (err) {
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

            'Check if server is running': function(intercom) {
                assert.ok(intercom.isRunning());
            },

            'The server should respond to a request on /': {
                topic: function () {
                    request({
                        url: {
                            protocol: 'http:',
                            hostname: 'localhost',
                            port: 9912,
                            pathname: '/'
                        },
                        headers: {
                            'Service-Key': 'VOWSJS-TESTSERVICE',
                            'Esb-Access-Token': 'TESTACCESS'
                        }
                    }, this.callback);
                },

                'with a "204 No Content" status code': function(resp) {
                    assert.equal(resp.statusCode, 204);
                }
            },

            'The server should reject a request without access token': {
                topic: function () {
                    request({
                        url: {
                            protocol: 'http:',
                            hostname: 'localhost',
                            port: 9912,
                            pathname: '/'
                        },
                        headers: {
                            'Service-Key': 'VOWSJS-TESTSERVICE'
                        }
                    }, this.callback);
                },

                'with a 403 status code': function(resp) {
                    assert.equal(resp.statusCode, 403);
                },

                'no content should be provided': function(err, resp, body) {
                    assert.isEmpty(body);
                }
            },

            'The server should reject a request without service key': {
                topic: function () {
                    request({
                        url: {
                            protocol: 'http:',
                            hostname: 'localhost',
                            port: 9912,
                            pathname: '/'
                        },
                        headers: {
                            'Esb-Access-Token': 'TESTACCESS'
                        }
                    }, this.callback);
                },

                'with a 403 status code': function(resp) {
                    assert.equal(resp.statusCode, 403);
                },

                'no content should be provided': function(err, resp, body) {
                    assert.isEmpty(body);
                }
            }
        }
    }).export(module);
})(module);