var vows = require('vows'),
    assert = require('assert');

var Router = require('./../src/Storage/Routing').Router,
    RouterNode = require('./../src/Storage/Routing').RouterNode;

var Errors = require('./../src/Errors');

vows.describe('ESB Routing').addBatch({
    'A router node': {
        topic: new RouterNode('/test'),

        'has initialy no children': function(node) {
            assert.isEmpty(node.children);
        },
        'and thus getChildren should return an empty array': function(node) {
            assert.isEmpty(node.getChildren());
        },
        'insert a new child wors fine': function(node) {
            var newNode = new RouterNode('/test/new');
            node.addChild(newNode);
        },
        'new child is present now': function(node) {
            assert.instanceOf(node.children.new, RouterNode, 'New child not in children list.');
        },
        'and no other child exists': function(node) {
            assert.lengthOf(Object.keys(node.children), 1, 'More children after one insert.');
        },
        'insert deep child works too': function(node) {
            var newNode = new RouterNode('/test/new2/deep/child');
            newNode.addServer({});
            node.addChild(newNode);
        },
        'deep child is also present together with all its parent paths': function(node) {
            assert.instanceOf(node.children.new2, RouterNode);
            assert.isEmpty(node.children.new2.servers);

            assert.instanceOf(node.children.new2.children.deep, RouterNode);
            assert.isEmpty(node.children.new2.children.deep.servers);

            assert.instanceOf(node.children.new2.children.deep.children.child, RouterNode);
            assert.lengthOf(node.children.new2.children.deep.children.child.servers, 1);
        }
    }
}).addBatch({
    'A new router storage': {
        topic: new Router(),

        'should have an empty routing table.': function(router) {
            assert.instanceOf(router._routingTable, RouterNode, 'Routing table is no instance of RoutingNode.');
            assert.isEmpty(router._routingTable.children, 'Root routing node has children after initialization.');
            assert.isEmpty(router._routingTable.servers, 'Root routing node has addresses which is bad in every moment.');
        },
        '/app request should fail': function(router) {
            assert.throws(function() {
                router.target('/app', {});
            }, Errors.RouterException);
        },
        'publishing a new route should work for /app': function(router) {
            router.publish('/app', {});

            assert.instanceOf(router._routingTable.children.app, RouterNode, '/app children is no instance of RoutingNode.');
            assert.lengthOf(router._routingTable.children.app.servers, 1, '/app node should have one address.');

            assert.doesNotThrow(function() {
                router.target('/app', {});
            }, Error);
        }
    }
}).export(module);