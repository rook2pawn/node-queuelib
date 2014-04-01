var Q = require('../');
var request = require('request');
var queue = new Q;

var list = [];
exports.testTerminate = function(t) {
    t.expect(1);
    queue.series([
        function(lib) {
            console.log("getting xkcd");
            request('http://xkcd.com',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.done();
            });
        },
        function(lib,id) {
            console.log("getting nmpjs");
            request('http://npmjs.org',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.terminate(id);
            });
        },
        function(lib) {
            console.log("getting perl");
            request('http://perl.org',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.done();
            });
        }
    ]);
    queue.pushAsync(function(lib) {
        console.log("pushing last");
        list.push('last');
        lib.done();
    });
    queue.pushAsync(function(lib) {
        t.deepEqual(list,['xkcd.com','www.npmjs.org','last']);
        lib.done();
        t.done();
    }); 
};
