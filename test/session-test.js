var vows = require('vows'),
    assert = require('assert');

var Session = require('./../src/Storage/Session').Session,
    SessionStorage = require('./../src/Storage/Session').Storage;

var Errors = require('./../src/Errors');

vows.describe('ESB Sessions').addBatch({
    'A session': {
        topic: new Session('testkeysecretandrandom')
    }
}).export(module);