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
test('oneseries',function(t) {
    t.plan(2)
    var q = new Q;
    q.series([
        function(lib) {
            console.log("A")
            t.ok(true)
            lib.done()
        },
        function(lib) {
            console.log("B")
            t.ok(true)
            lib.terminate()
        },
        function(lib) {
            console.log("No")
            t.ok(false) 
            lib.done()
        }
    ])
})
