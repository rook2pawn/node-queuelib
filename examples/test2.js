var myWorkfn = function(el,self) { console.log(el + " is an animal");self.done();};
var Qlib = require('../index.js');
var q = Qlib({work:myWorkfn}); 
q
	.push('cat')
	.push('dog')
	.push('horse')
;
q.push('insect');
q.push('jellyfish');
q.push('kangaroo');
console.log(q.stats());
console.log("*************");
q = Qlib({work:function(val) { console.log( parseInt(val) + 3) }});
	q
	.push(2)
	.push(3)
	.push(4);
