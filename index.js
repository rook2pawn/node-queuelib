var EventEmitter = require('events').EventEmitter;
var main = new EventEmitter;
exports = module.exports = qlib;
function qlib(obj) {
	var work = obj.work;
	var emitter = obj.emitter;
	var queue = [];
	var sort = undefined;
	var middleware = undefined;
	var sortall = undefined;
	if (emitter === undefined) {
		emitter = new EventEmitter;
	}
	if ((work === undefined) || (typeof work != 'function')) {
		throw new Error("You must supply a work function.");
	}
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
		if (queue[0]) {
			stats.totalProcessed++;
			var item = queue.shift();
			work.call(work,item);
		} 
	};
	self.push = function(el) {
		if (middleware !== undefined) {
			el = middleware(el);
		}
		queue.push(el);
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
	self.use = function(middlewarefn) {
		middleware = middlewarefn;
		return self;
	};
	return self;
};
