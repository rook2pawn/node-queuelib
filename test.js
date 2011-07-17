var EventEmitter = require('events').EventEmitter;
var myEmitter = new EventEmitter;
var myWorkfn = function(el) { console.log(el + " is an animal");myEmitter.emit('next');};
var Qlib = require('./index.js');
var q = Qlib({work:myWorkfn,emitter:myEmitter}); 
q
	.push('cat')
	.push('dog')
	.push('horse')
;

q.push('insect');
q.push('jellyfish');
q.push('kangaroo');
console.log(q.stats());

var myEmitter2 = new EventEmitter;
var myWorkfn2 = function(el) { console.log(el + " is a creature"); myEmitter2.emit('next');};
myEmitter2.on('next',function(){ if (q.length() > 0) console.log("next!")});
myEmitter2.on('end',function(){ console.log("All Done.")});
q = Qlib({work:myWorkfn2,emitter:myEmitter2});
q
	.push('aardvark')
	.push('bat')
	.push('cephalopod')
;
