var Q = require('../');
var tape = require('tape')

tape('test forEach',function(t) {
  var queue = new Q;
  var list = ['a','b','c','d','e']
  var list2 = [1,2,3,4,5];
  var output = [];

  t.plan(3)
  var start_time = new Date().getTime()
  queue.forEach(list,function(item,idx,lib) {
    setTimeout(function() {
      output.push({item:item,idx:idx})
      lib.done()
    },100)
  }, function() {
    queue.forEach(list2,function(item,idx,lib) {
      output.push({item:item,idx:idx})
      lib.done()
    },100, function() {
      var curr_time = new Date().getTime()
      t.deepEqual([
        {item:'a',idx:0},
        {item:'b',idx:1},
        {item:'c',idx:2},
        {item:'d',idx:3},
        {item:'e',idx:4},
        {item:1,idx:0},
        {item:2,idx:1},
        {item:3,idx:2},
        {item:4,idx:3},
        {item:5,idx:4}],output)
      t.ok((curr_time - start_time) > 1000)
      t.ok((curr_time - start_time) < 1100)
    })
  })
})



tape('test forEach empty',function(t) {
  var queue = new Q;
  t.plan(1);
  queue.forEach([],function(item,idx,lib) {
      t.fail('iterator should not occur')
      lib.done()
  },function() {
    t.ok("Finished")
  })
})
