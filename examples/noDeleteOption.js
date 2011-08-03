var EventEmitter = require('events').EventEmitter;
var Qlib = require('../index');
var q5 = Qlib({noDeleteOnNext:true});
q5
	.push('aardvark!!!!',function(obj,self) { 
		console.log(obj + " is a creature!");
		console.log(self.queue());
		setTimeout(function(){
			self.push(obj,function(val,self){
				console.log(val + " is back of the line again...");self.done();
				console.log(self.queue());	
			});
		},600);
		self.done();
	})
	.push('bat',function(obj,self){ console.log(obj+ " is a flying furry!");console.log(self.queue());self.done();})
	.push('cephalopod',function(obj,self){ console.log(obj + " likes to play footsie in the sea!");console.log(self.queue());self.done();})
	.push('dog',function(obj,self){ console.log(obj + " woofs!"); console.log(self.queue()); self.update();console.log("After update"); console.log(self.queue()); self.done();})
	.push('elephant', function(obj,self){ console.log(obj + " has tusks."); console.log(self.queue());self.done();})
;

