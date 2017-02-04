
var test = require('tape');

test('test pushAsync',function(t) {
  t.plan(1);
  var Q = require('../');
  var queue = new Q;
  var list = [];
  queue.pushAsync(function(lib) {
    setTimeout(function() {
      list.push(1);
      lib.done()
    }, 200);
  })
  queue.pushAsync(function(lib) {
    list.push(2);
    lib.done()
  })
  queue.pushAsync(function(lib) {
    list.push(3);
    lib.done();
  })
  queue.pushAsync(function(lib) {
    t.deepEquals(list,[1,2,3])
  })
});
