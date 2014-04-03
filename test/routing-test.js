(function(module) {
    'use strict';

    var vows = require('vows'),
        assert = require('assert');

    var Router = require('./../src/Storage/Routing').Router,
        Service = require('./../src/Service').Service;

    var Errors = require('./../src/Errors');

    vows.describe('ESB Routing').addBatch({
        'A new router storage': {
            topic: new Router(),

            'should have an empty routing table': function(router) {
                assert.isEmpty(router._storage);
            },

            'have an add(), get() and has() function': function(router) {
                assert.isFunction(router.add);
                assert.isFunction(router.get);
                assert.isFunction(router.has);
            },

            'has should return false for non existing ids': function(router) {
                assert.isFalse(router.has('NONEXISTING'));
            },

            '- a service': {
                topic: function(router) {
                    this.callback(new Service('FAKESERVICE', 'localhost:8898'), router);
                },

                'should be addable': function(service, router) {
                    router.add(service);
                },

                'then the service is gettable': function(service, router) {
                    assert.equal(router.get('FAKESERVICE'), service);
                },

                'then has() for the service id returns true': function(service, router) {
                    assert.isTrue(router.has(service.id));
                }
            }
        }
    }).export(module);
})(module);