(function(module) {
    'use strict';

    var vows = require('vows'),
        assert = require('assert'),
        request = require('request');

    var InterCom = require('./../src/InterCom').InterCom;

    vows.describe('ESB InterCom').addBatch({
        'InterCom': {
            topic: new InterCom({ports:{intercomhttp:1212}}),

            'should have a work() and stop() method': function(intercom) {
                assert.isFunction(intercom.work);
                assert.isFunction(intercom.stop);
            }
        }
    }).addBatch({
        'Working intercom': {
            topic: function() {
                var intercom = new InterCom({ports:{intercomhttp:1213}});
                intercom.work();
                return intercom;
            },

            'HTTP connection': {
                topic: function() {
                    request('http://localhost:1213/', this.callback);
                },

                'Response Code 200 OK': function(res) {
                    assert.equal(res.statusCode, 200);
                }
            }
        }
    }).addBatch({
        'Stoped intercom': {
            topic: function() {
                var intercom = new InterCom({ports:{intercomhttp:1214}});
                intercom.work();
                intercom.stop();
                return intercom;
            },

            'HTTP connection': {
                topic: function() {
                    var $this = this;
                    request('http://localhost:1214/', function(err) {
                        $this.callback(null, err);
                    });
                },

                'Error': function(err) {
                    assert.isNotNull(err);
                }
            }
        }
    }).export(module);
})(module);