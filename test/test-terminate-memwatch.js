var Q = require('../');
var list = [];
var test = require('tape');
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
test('terminate test', function (t) {
    t.plan(500);
    var doSomething= function () {
        var x = 10e5;
        var q = new Q;
        q.series([
            function(lib) {
                lib.set({foo:"bar".repeat(x)})
                t.ok(1);
                lib.done()
            },
            function(lib) {
                lib.set({baz:"cat".repeat(x)})
                lib.terminate()
            },
            function(lib) {
                console.log("this should not happen")
                t.fail()
                lib.done()
            }
        ])
    }
    for (var i = 0; i < 500; i++) {
        doSomething();
    }
});
