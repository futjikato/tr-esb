(function(module) {
    'use strict';

    var Errors = require('./../Errors'),
        path = require('path');

    /**
     * ESB Router
     * Works like a switch in a network.
     * Every incoming request must have a route for the target application.
     * The router checks for the best matching route and directs the request to
     * that application. If the application si not able to handle the request
     * the router will broadcast the request to all known application.
     * The answering application will be saved in the routing table to be directly
     * asked on the next request.
     *
     * @constructor
     */
    function Router() {

        /**
         * Routing table
         *
         * @type {Array}
         * @private
         */
        this._routingTable = new RouterNode('/');

    }

    /**
     * Send the message object to the server responsible for handling the route.
     *
     * @param {string} route
     * @param {{}} messageObject
     */
    Router.prototype.target = function(route, messageObject) {
        var lastServers = [],
            routeKeys = route.split(path.sep);

        var currentNode = this._routingTable;
        routeKeys.forEach(function(key) {
            if(key.length > 0) {
                if(currentNode.children[key]) {
                    currentNode = currentNode.children[key];
                    lastServers = currentNode.servers;
                }
            }
        });

        if(lastServers.length === 0) {
            // @todo make brotcast ( pun intended ) to all servers
            throw new Errors.RouterException('Unable to find a server.');
        }

        // @todo sever handling
    };

    /**
     * Publish a new route with a server to target on requests for the given route.
     *
     * @param {string} route
     * @param {{}} server
     */
    Router.prototype.publish = function(route, server) {
        var node = new RouterNode(route);
        node.addServer(server);

        this._routingTable.addChild(node);
    };

    /**
     * A node within the routing table
     *
     * @param {string} path
     * @constructor
     */
    function RouterNode(path) {

        /**
         * Absolute routing path.
         *
         * @type {string}
         */
        this.path = path;

        /**
         * List of servers that accept requests for this path.
         *
         * @private
         * @type {Array}
         */
        this.servers = [];

        /**
         * List of known child paths.
         *
         * @private
         * @type {{}}
         */
        this.children = {};
    }

    /**
     * Returns an array with all children nodes.
     *
     * @returns {RouterNode[]}
     */
    RouterNode.prototype.getChildren = function() {
        var $this = this;
        var ary = [];
        Object.keys(this.children).forEach(function(key) {
            if($this.children.hasOwnProperty(key) && $this.children[key] instanceof RouterNode) {
                ary.push($this.children[key]);
            }
        });

        return ary;
    };

    /**
     * Add a child node
     *
     * @param {RouterNode} node
     */
    RouterNode.prototype.addChild = function(node) {
        var relPath = path.relative(this.path, node.path),
            pathAry = relPath.split(path.sep);

        // get key for next node from here
        var key = pathAry.shift();

        // it is not allowed to traverse to parent nodes
        if(key.substr(0, 1) === '.') {
            throw new Error('Invalid path name.');
        }

        // Sorry node, but your destination is in another castle.
        if(pathAry.length > 0) {
            // create next node if not present
            if(!this.children[key]) {
                var parentPath = path.join(this.path, key);
                var parentNode = new RouterNode(parentPath);

                this.addChild(parentNode);
            }

            // delegate to next node in chain
            this.children[key].addChild(node);
            return;
        }

        // check if node already exists
        if(this.children[key]) {
            throw new Error('Route for given path already exists.');
        }

        // insert node
        this.children[key] = node;
    };

    /**
     * Add a server to the node.
     *
     * @param {{}} server
     */
    RouterNode.prototype.addServer = function(server) {
        // @todo parameter validation
        this.servers.push(server);
    };

    // export modules
    module.exports = {
        Router: Router,
        RouterNode: RouterNode
    };
})(module);