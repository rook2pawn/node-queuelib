var test = require('tape');
test('testSeriesAsync',function(t) {
  t.plan(1);
  var Q = require('../');
  var queue = new Q;
  queue.series([
    function(lib) {
      setTimeout(function() {
        lib.done({one:1})
      },100);
    },
    function(lib) {
      setTimeout(function() {
        lib.done({three:3})
      },100);
    },
    function(lib) {
      var x = lib.get('one') + lib.get('three');
      t.equal(4,x);
      lib.done();
    }
  ]);
});
