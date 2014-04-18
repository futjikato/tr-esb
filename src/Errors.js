(function(module) {
    'use strict';

    var util = require('util');

    /**
     * Router Exception
     * Thrown if an error while routing a request occurred.
     *
     * @constructor
     */
    function RouterException(msg) {
        Error.call(this, msg);
    }
    util.inherits(RouterException, Error);

    /**
     * InterCom Exception
     * Thrown if an error happened in the InterCom.
     *
     * @constructor
     */
    function InterComException(msg) {
        Error.call(this, msg);
    }
    util.inherits(InterComException, Error);

    // export all application Exceptions
    module.exports = {
        RouterException: RouterException,
        InterComException: InterComException
    };
})(module);