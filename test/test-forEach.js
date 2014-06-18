var Q = require('../');
var tape = require('tape')
var queue = new Q;
var list = ['a','b','c','d','e']
var list2 = [1,2,3,4,5]

var output = [];

tape('test forEach',function(t) {
    t.plan(3)
    var start_time = new Date().getTime()
    queue.forEach(list,function(item,lib) {
        setTimeout(function() {
            output.push(item)
            lib.done()
        },100)
    },function() {
        
    })
    queue.forEach(list2,function(item,lib) {
        output.push(item)
        lib.done()
    },function() {
        var curr_time = new Date().getTime()
        t.deepEqual(['a','b','c','d','e',1,2,3,4,5],output)
        t.ok((curr_time - start_time) > 1000)
        t.ok((curr_time - start_time) < 1100)
    },100)
})
