var QL = require('../');

var q = new QL;
var sum = 0;
q.series([
  function(lib) {
    sum += 1;
    lib.done();
  },
  function(lib) {
    sum += 2;
    lib.done();
  },
  function(lib) {
    sum += 3;
    lib.done();
  }
],function() {
  console.log(sum);
})