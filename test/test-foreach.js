var test = require('tape');

// in this test we also test that the second forEach happens after the first
// and that the all done functions are done in order
test('forEach',function(t) {
    var Q = require('../');
    var queue = new Q;
    var list = ['a','b','c','d','e']
    t.plan(list.length*2 + 1)
    var time_first, time_second
    queue
    .list(list)
    .forEach(function(item,idx,lib) {
        setTimeout(function() {
            console.log(item)
            t.equal(item, list[idx])
            lib.done()
        },500)
    })
    .end(function() {
        time_first = new Date().getTime()
    })
    queue
    .list(list)
    .forEach(function(item,idx,lib) {
        setTimeout(function() {
            console.log(item.toUpperCase())
            t.equal(item, list[idx])
            lib.done()
        },10)
    })
    .end(function() {
        time_second = new Date().getTime()
        console.log(time_second - time_first)
        t.ok((time_second - time_first) > (list.length * 10),'Ensure that the second call back happened after the first, and that elapsed time total of the second forEach is correct')
    })
})


test('empty forEach',function(t) {
    var Q = require('../');
    var queue = new Q;
    var list = []
    t.plan(1)
    queue
    .list(list)
    .forEach(function(item,idx,lib) {
        setTimeout(function() {
            console.log(item)
            lib.done()
        },500)
    })
    .end(function() {
        t.pass("Sure");
    })
})
