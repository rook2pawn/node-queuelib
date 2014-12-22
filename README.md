[![Build Status](https://travis-ci.org/rook2pawn/node-queuelib.svg?branch=master)](https://travis-ci.org/rook2pawn/node-queuelib)

New!
===
Rate Limiting. Just supply the millisecond after .forEach or .series

    q.series(<list>,<padding>);

    // or

    q.forEach(<list>,<iterator>,<all done>, <padding>)


New!
==== 
ForEach

q.forEach(list,iterator,alldone)
--------------------------------------------------

    q.forEach(['c','a','t'],function(val,idx,lib) {
        console.log(val, idx);
        lib.done() // signal next
    }, function() {
        console.log("all done");
    });

    // c 0
    // a 1 
    // t 2


New!
====
Key value store across series! Just call .done(hash) to store the keys/values of the hash

    queue.series([
        function(lib) {
            lib.done({one:1})
        },
        function(lib) {
            lib.done({two:2})
        },
        function(lib) {
            var x = lib.get('one') + lib.get('two'); // x = 3
            lib.done();
        }
    ]);


You can also use .set(hash)

    queue.series([
        function(lib) {
            lib.set({one:1});
            lib.done()
        },
        function(lib) {
            lib.set({life:42})
            lib.done()
        },
        function(lib) {
            t.equal(43,lib.get('one') + lib.get('life'));
            lib.done();
        }
    ]);


New!
====
Early termination flow control in .series! 
        
    queue.series([
    function(lib) {
        // stuff
        lib.terminate();
    },
    function(lib) {
        // this function will be removed from the queue after the call to terminate
    },
    function(lib) {
        // so will this one  , etc
    }
    ]);


QueueLib
========

Asynchronous queue processor

    - lightweight, simple
    - flow control in series


Methods
=======

.pushAsync(fn)
==============

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
======================

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

You can also bind a context for any function in the series by declaring an object with a "fn" parameter and a "context" parameter like so: 


    queue.series([
        {
            fn:function(lib) {
                // do something asynchronously
                var x = this.a + this.b; // 42
                lib.done();
            },
            context: {a:30, b:12}
        }
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


.forEach (list, iterator, alldone) 
==================================

    var list = [1,2,3]
    var sum = 0;
    queue.forEach(list,function(item,idx,lib) {
        sum += item;
        lib.done()
    },function() {
        console.log(sum) // 6
    })
