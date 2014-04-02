var vows = require('vows'),
    assert = require('assert'),
    http = require('http'),
    url = require('url');

// spin up the fake service on port 9989
http.createServer(function(req, resp) {
    var uInfo = url.parse(req.url);

    if(uInfo.pathname === '/routes') {
        resp.writeHead(200, {
            'Content-Type': 'application/json'
        });
        resp.end('{"routes":["/fake","/dummy", "/fake/new"]}', 'utf8');
    }
}).listen(9989);

var Service = require('./../src/Storage/Service').Service;

vows.describe('ESB Services').addBatch({
    'A service on port 9989': {
        topic: new Service('localhost:9989'),

        'should give me a list of supported routes': {
            topic: function(service) {
                var $this = this;
                service.on('routes', function(routeAry) {
                    $this.callback(null, routeAry);
                });
            },

            'and that should equal the list we gave it': function(routeAry) {
                assert.isArray(routeAry);
                assert.deepEqual(routeAry, ['/fake', '/dummy', '/fake/new']);
            }
        }
    }
}).export(module);