var QL = require('../');

var q = new QL;
var sum = 0;
q.forEach([1,2,3],function(val,idx,lib) {
  sum += val;
  lib.done();
},function() {
  console.log(sum)
})