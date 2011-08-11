var EventEmitter = require('events').EventEmitter;
var textual = require('textual');
exports = module.exports = qlib;
function qlib(obj) {
	var emitter = new EventEmitter;
	var noDeleteOnNext,autoNext = false;
	var work,onNext  = undefined;
	if (obj !== undefined) {
		noDeleteOnNext = obj.noDeleteOnNext || false;
		work = obj.work || undefined;
		autonext = obj.autonext || false;
		onNext = obj.onNext || undefined;
	}
	var queue = [];
	if (noDeleteOnNext) queue.next = 0;
	var sort,transform,governor,sortall = undefined;
	var nextListeners = emitter.listeners('next');
	nextListeners.push(function() { 
		working = false;
		if (onNext !== undefined) { onNext();}
		if (queue.length > 0) self.work();
	});
	if (emitter.listeners('done').length == 0) {
		emitter.on('done',function() { console.log("Queue currently empty. All done.");});
	} 
	var stats = { totalProcessed : 0};
	var working = false;
	var self = {};
	self.work = function() {
		var item; 
		if (!noDeleteOnNext) item = queue[0];
		else item = queue[queue.next];
		if (item) {
			stats.totalProcessed++;
			if (!noDeleteOnNext) queue.shift();
			else queue.next++;
			var element = item[0];
			var fn = item[1];
			var myWorkFunction;
			if (work !== undefined) {
				myWorkFunction = work;
			} else if ((work === undefined) && (fn !== undefined)) {
				myWorkFunction = fn;
			} 
			myWorkFunction.apply(myWorkFunction,[element,self]);
			var doneCall = textual.doesObjectCallMethod(myWorkFunction,textual.getLastArg(myWorkFunction),'done');
			if ((!doneCall) || (autonext))  emitter.emit('next'); // the one-minute lazy use case
			// generally we want people to use the emitter in their code
			// but for quick and dirt this will be fine.
		} 
	};
	// shorten the queue by n elements, starting from the beginning index 0 to n-1
	self.shorten = function(n) {
		for (var i = 0; i < n; i++) {
			queue.shift();
		}
	};
	self.update = function() {
		this.shorten(queue.next);
		queue.next = 0;
	};
	self.push = function(el,fn) {
		if (transform !== undefined) {
			el = transform(el);
		}
		queue.push([].slice.call(arguments,0));
		if (governor !== undefined) {
			governor(queue,self);
		}
		if (sortall !== undefined) {
			queue = sortall(queue);
		} else if (sort !== undefined) {
			queue.sort(sort);
		}	
		if ((queue.length > 0) && (working == false)) {
			working = true;
			this.work();
		} 
		return self;
	};
	self.done = function() {
		emitter.emit('next');
	};
	self.queue = function() {
		return queue.slice(0);
	};	
	self.stats = function() {
		return stats;
	};
	self.length = function() {
		return queue.length;
	}
	self.shift = function() {
		queue.shift();
	};
	self.sort = function(sortfn) {
		sort = sortfn;
		return self;
	};
	self.sortall = function(sortfn) {
		sortall = sortfn;
		return self;
	};
	self.transform = function(middlewarefn) {
		transform = middlewarefn;
		return self;
	};
	self.governor = function(governorfn) {
		governor = governorfn;
		return self;
	};
	self.flags = function() {
		return obj;
	};
	return self;
};
