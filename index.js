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
	// we unshift so that we may shift the queue down first, so that 
	// the user may query the queue with the assumption that in the
	// supplied next function, it can be assumed that next has already shifted the queue.
	nextListeners.unshift(function() { 
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
