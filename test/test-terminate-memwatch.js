var Q = require('../');
var list = [];
var test = require('tape');
var memwatch = require('memwatch')
memwatch.on('leak',function(info) {
    console.log("\n**********\nMemory leak", info)
})
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
test('terminate test', function (t) {
    t.plan(1);
    var doSomething= function () {
        console.log("doSomething", new Date())
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
                console.log(arguments) 
                lib.terminate()
            },
            function(lib) {
                console.log("WTF")
                t.equal(1,2)
                lib.done()
            }
        ])
    }
    doSomething()
//    for (var i = 0; i < 500; i++) {
//        doSomething();
//    }
});
