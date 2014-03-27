(function(module) {

    var util = require('util'),
        events = require('events'),
        extend = require('extend');

    function Storage() {

        events.EventEmitter.call(this);

        this.sessions = {};
    }

    util.inherits(Storage, events.EventEmitter);

    Storage.prototype.add = function(session) {
        this.sessions[session.key] = session;
    };

    // default options for a session object
    var sessionDefaultOptions = {
        lifetime: 3200
    };

    /**
     * Session
     *
     * @param {string} key
     * @param {{}} options
     *
     * @constructor
     */
    function Session(key, options) {

        /**
         * Configuration for the session.
         *
         * @type {{}}
         */
        this.conf = extend({}, sessionDefaultOptions, options);

        /**
         * Unique identifier for this session.
         *
         * @type {string}
         */
        this.key = key;
    }

    module.exports = {
        Session: Session,
        Storage: Storage
    };
})(module);