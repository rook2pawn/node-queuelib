var EventEmitter = require('events').EventEmitter;
var textual = require('textual');
exports = module.exports = qlib;
function qlib(obj) {
	var work = obj.work;
	var emitter = new EventEmitter;
	var noDeleteOnNext = obj.noDeleteOnNext || false;
	var autonext = obj.autonext || false;
	var queue = [];
	if (noDeleteOnNext) queue.next = 0;
	var sort = undefined;
	var transform = undefined;
	var sortall = undefined;
	var nextListeners = emitter.listeners('next');
	// we push instead of unshift. why? if a user supplies a next function as well, and it is NOT
	// executed first before the self.work, then the work function supplied may change some state
	// that the user-supplied next function may have been looking for (not the new state) which would be wiped out
	// depending on what the work function is. 

	// suppose we unshifted into the listeners. Then as we started self.work immediately afterwards we then process
	// the remaining listeners on next. These listener functions have a REASONABLE assumption that the work function
	// for some unknown future item has not yet occurred, until all the listeners on the current 'next' event 
	// have been exhausted.
	nextListeners.push(function() { 
		working = false;
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
			console.log("Done call is " + doneCall);
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
	}
	self.push = function(el,fn) {
		if (transform !== undefined) {
			el = transform(el);
		}
		queue.push(arguments);
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
	}
	self.transform = function(middlewarefn) {
		transform = middlewarefn;
		return self;
	};
	return self;
};
