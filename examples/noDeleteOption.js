var EventEmitter = require('events').EventEmitter;
var Qlib = require('../index');
var myEmitter5= new EventEmitter;
myEmitter5.on('next',function(){ if (q5.length() > 0) console.log("next!")});
myEmitter5.on('end',function(){ console.log("All Done.")});
var q5 = Qlib({emitter:myEmitter5,noDeleteOnNext:true});
q5
	.push('aardvark!!!!',function(obj,emitter,self) { 
		console.log(obj + " is a creature!");
		console.log(self.queue());
		setTimeout(function(){
			self.push(obj,function(val,emitter,self){
				console.log(val + " is back of the line again...");emitter.emit('next');
				console.log(self.queue());	
			});
		},600);
		emitter.emit('next');
	})
	.push('bat',function(obj,emitter,self){ console.log(obj+ " is a flying furry!");console.log(self.queue());emitter.emit('next');})
	.push('cephalopod',function(obj,emitter,self){ console.log(obj + " likes to play footsie in the sea!");console.log(self.queue());emitter.emit('next');})
	.push('dog',function(obj,emitter,self){ console.log(obj + " woofs!"); console.log(self.queue()); self.update();console.log("After update"); console.log(self.queue()); emitter.emit('next');})
	.push('elephant', function(obj,emitter,self){ console.log(obj + " has tusks."); console.log(self.queue()); emitter.emit('next');})
;

