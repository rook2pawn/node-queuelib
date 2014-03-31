QueueLib
========

Asynchronous queue processor

    - lightweight, simple


Methods
=======

.pushAsync(fn)
--------------

    var Q = require('queuelib');
    var queue = new Q;
    
    queue.pushAsync(function(lib) {
        // do something asynchronously
        lib.done();
    });
    
    queue.pushAsync(function(lib) {
        // do something else asynchronously
        lib.done();
    });

.series ([fn1,fn2,..])
----------------------

queue.series([
    function(lib) {
        // do something asynchronously
        lib.done();
    },
    function(lib) {
        // do something else asynchronously
        lib.done();
    }
]);


Example 1
---------


    var Q = require('queuelib');
    var request = require('request');
    var queue = new Q;
    
    queue.pushAsync(function(lib) {
        // do something asynchronously
        request('http://google.com',function(err,response,body) {
            console.log(body);
            lib.done();
        });
    });
    
    queue.pushAsync(function(lib) {
        // do something else asynchronously
        request('http://reddit.com',function(err,response,body) {
            console.log(body);
            lib.done();
        });
        lib.done();
    });

Example 2
---------

    queue.series([
        function(lib) {
            console.log("getting xkcd");
            request('http://xkcd.com',function(err,response,body) {
                console.log(response.headers);
                lib.done();
            });
        },
        function(lib) {
            console.log("getting nmpjs");
            request('http://npmjs.org',function(err,response,body) {
                console.log(response.headers);
                lib.done();
            });
        }
    ]);


.pushSync(
There is also .pushSync for 
