var EventEmitter = require('events').EventEmitter;
var Qlib = require('./index');
var myEmitter5= new EventEmitter;
myEmitter5.on('next',function(){ if (q5.length() > 0) console.log("next!")});
myEmitter5.on('end',function(){ console.log("All Done.")});
var q5 = Qlib({emitter:myEmitter5});
q5
	.push('aardvark!!!!',function(obj,emitter,self) { 
		console.log(obj + " is a creature!");
		setTimeout(function(){
			self.push(obj,function(val,emitter,queue){
				console.log(val + " is back of the line again...");emitter.emit('next');
			});
		},600);
		emitter.emit('next');
	})
	.push('bat',function(obj,emitter){ console.log(obj+ " is a flying furry!");emitter.emit('next');})
	.push('cephalopod',function(obj,emitter){ console.log(obj + " likes to play footsie in the sea!");emitter.emit('next');})
;

