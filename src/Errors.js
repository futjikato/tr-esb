(function(module) {
    'use strict';

    var util = require('util');

    /**
     * Router Exception
     * Thrown if an error while routing a request occurred.
     *
     * @constructor
     */
    function RouterException() {
        Error.call(this);
    }
    util.inherits(RouterException, Error);

    // export all application Exceptions
    module.exports = {
        RouterException: RouterException
    };
})(module);