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
	.use(function(el) { return el.toUpperCase()})
	.push('aardvark')
	.push('bat')
	.push('cephalopod')
;
console.log("*************");
var myEmitter3= new EventEmitter;
var myWorkfn3 = function(el) { setTimeout(function() { console.log(el.element + " is a creature");
	console.log("\tindex is " + el.index);  myEmitter3.emit('next'); },5000);};
myEmitter3.on('next',function(){ if (q.length() > 0) console.log("next!")});
myEmitter3.on('end',function(){ console.log("All Done.")});
q = Qlib({work:myWorkfn3,emitter:myEmitter3});
q
	.use(function(el) { 
		return {element:el, index:el.slice(0,1).charCodeAt(0)}})
	.sort(function(a,b) { return b.index-a.index })
	.push('aardvark')
	.push('bat')
	.push('cephalopod')
;
