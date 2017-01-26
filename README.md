[![Build Status](https://travis-ci.org/rook2pawn/node-queuelib.svg?branch=master)](https://travis-ci.org/rook2pawn/node-queuelib)

# QueueLib - a smaller, focused async library 

Focusing on flow control in .series and .forEach, queuelib also has rate limiting and early termination in .series and .forEach without the need to throw errors.

## Breaking changes 1/26/2017

Type signatures forEach and series have changed

### Main Methods

#### .forEach (list,iterator,ratelimit,alldone)

Optional ratelimit takes a positive integer that specifies the number of
milliseconds between iterations. 

Optional alldone function to be executed after entire list is processed.


*Iterator* signature is called as follows: 

    function (value, idx, lib) {
      lib.done(); // to signal next
    }

    // OR 

    function (value, idx, lib) {
      lib.terminate(); // to stop the forEach.
    }


#### .series([fn1, fn2, ... ], alldone)

Optional alldone function to be executed after entire list is processed.

Example:

    q.series([
      function(value,lib) {
        lib.done();
      },
      function(value,lib) {
        lib.done();
      }, 
      ...
      function(value,lib) {
        lib.done();
      }
    ])


You can also bind a context for any function in the series by declaring an object with a "fn" parameter and a "context" parameter like so: 

    q.series([
      { fn : function(lib) {
          var x = this.a + this.b; // 42
          lib.done();
        },
        context: {a:30, b:12}
      },
      function(lib) {
        lib.done();
      }
    ]);


### Flow control

#### .done()

    queue.series([
      function(lib) {
        lib.done();
      },
      function(lib) {
        lib.done();
      }
    ]);


#### .terminate()

    queue.series([
      function(lib) {
        lib.terminate();
      },
      function(lib) {
          // this function will be removed from the queue after the call to terminate
      },
      function(lib) {
          // so will this one  , etc
      }
    ]);


### Other features

#### memory key-value store across series or forEach

Just call .done(hash) to store the keys/values of the hash

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
          assert.equal(43,lib.get('one') + lib.get('life'));
          lib.done();
      }
    ]);



#### .pushAsync(fn)

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


### License

MIT 
Copyright 2011-2017 David Wee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.