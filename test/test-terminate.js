var Q = require('../');
var queue = new Q;
var list = [];
var test = require('tape');

test('terminate test', function (t) {
    t.plan(2);
    queue.series([
        function(lib) {
            setTimeout(function() {
                list.push(1);
                lib.done();
            },100);
        },
        function(lib) {
            setTimeout(function() {
                list.push(2);
                lib.terminate();
            },100);
        },
        function(lib) {
            setTimeout(function() {
                list.push(3);
                lib.done();
            },100);
        }
    ]);
    queue.pushAsync(function(lib) {
        list.push(1);
        lib.done();
    });
    queue.pushAsync(function(lib) {
        t.deepEqual(list,[1,2,1]);
        lib.done();
    }); 
    queue.series([
        function(lib) {
            list.push(2);
            lib.done();
        },
        function(lib,id) {
            t.deepEqual(list,[1,2,1,2]);
            lib.terminate();
        },
        function(lib) {
            t.fail('YOU SHOULD NEVER SEE THIS MESSAGE');
        }
    ]);
});
