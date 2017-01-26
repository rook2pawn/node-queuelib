var Q = require('../');
var test = require('tape');

test('terminate test while in forEach', function(t) {
  t.plan(1);  
  var queue = new Q;
  var list = [];
  queue.forEach(['a','b','c','d'],function(val,idx,lib) {
    list.push(val);
    if (idx == 2) {
      lib.terminate();
      return
    } else 
      lib.done();    
  }, function() {
    t.deepEqual(list,['a','b','c'])
  })
})

test('terminate test while in series', function (t) {
  var queue = new Q;
  var list = [];

  t.plan(1);
  queue.series([
    function(lib) {
      list.push(1);
      lib.done();
    },
    function(lib) {
      list.push(2);
      lib.terminate();
    },
    function(lib) {
      list.push(3);
      lib.done();
      t.fail('YOU SHOULD NEVER SEE THIS MESSAGE');
    }
  ], function() {
    t.deepEqual(list,[1,2]);
  });    
});
