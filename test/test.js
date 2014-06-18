var Q = require('../');
var queue = new Q;
var test = require('tape');
var list = [];

test('testPushAsyncAndSeries',function(t) {
    t.plan(1);
    queue.pushAsync(function(lib) {
        setTimeout(function() {
            list.push(1);
            lib.done();
        },100);
    });

    queue.pushAsync(function(lib) {
        setTimeout(function() {
            list.push(2);
            lib.done();
        },100);
    });


    queue.series([
        function(lib) {
            setTimeout(function() {
                list.push(3);
                lib.done();
            },100);
        },
        function(lib) {
            setTimeout(function() {
                list.push(4);
                lib.done();
            },100);
        },
    ]);
    queue.pushAsync(function(lib) {
        t.deepEqual(list,[1,2,3,4])
        lib.done();
    });
});
