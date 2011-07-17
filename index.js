var EventEmitter = require('events').EventEmitter;
var main = new EventEmitter;
exports = module.exports = qlib;
function qlib(obj) {
	var work = obj.work;
	var emitter = obj.emitter;
	var queue = [];
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
		if (queue.length > 0) { 
			queue.shift();
		} 
		if (queue.length > 0) {
			self.start(); 
		}
	});
	if (emitter.listeners('done').length == 0) {
		emitter.on('done',function() { console.log("Queue currently empty. All done.");});
	} 
	var stats = {
		totalProcessed : 0,
	}
	var self = {};
	self.start = function() {
		if (queue[0]) {
			stats.totalProcessed++;
			work.call(work,queue[0]);
		} 
	};
	self.push = function(el) {
		queue.push(el);
		if (queue.length == 1) {
			this.start();
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
	return self;
};
