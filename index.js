var EventEmitter = require('events').EventEmitter;
exports = module.exports = qlib;
function qlib(obj) {
	var work = obj.work;
	var emitter = obj.emitter;
	var autonext = false;
	if (emitter === undefined) {
		emitter = new EventEmitter;
		autonext = true; // bad, but meh. the use case will most likely be synchronous
		// if the user doesn't know how to implement event emitters
		// at least we try to give them functionality.
	}
	var queue = [];
	var sort = undefined;
	var middleware = undefined;
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
		if (queue[0]) {
			stats.totalProcessed++;
			var bits = queue.shift();
			var item = bits[0];
			var fn = bits[1];
			if (work !== undefined) {
				work.apply(work,[item,emitter,self])
			} else if ((work === undefined) && (fn !== undefined)) {
				fn.apply(fn,[item,emitter,self]);
			} 
			if (autonext) emitter.emit('next'); // the one-minute lazy use case
			// generally we want people to use the emitter in their code
			// but for quick and dirt this will be fine.
		} 
	};
	self.push = function(el,fn) {
		if (middleware !== undefined) {
			el = middleware(el);
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
	self.queue = function() {
		return queue;
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
