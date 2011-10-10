var EventEmitter = require('events').EventEmitter;
var textual = require('textual');
exports = module.exports = qlib;
function qlib(obj) {
	var emitter = new EventEmitter;
	var paused = noDeleteOnNext = autoNext = false;
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
		if (paused === false) {
			if (onNext !== undefined) { onNext();}
			if (queue.length > 0) {
                var item = queue[0];
                if (item.type == 'sync') {
                    self.workSync();
                }
                if (item.type == 'async') {
                    self.workAsync();
                }
            }
		}
	});
	if (emitter.listeners('done').length == 0) {
		emitter.on('done',function() { console.log("Queue currently empty. All done.");});
	} 
	var stats = { totalProcessed : 0};
	var working = false;
	var self = {};
	self.workSync = function() {
		var item; 
		if (!noDeleteOnNext) item = queue[0];
		else item = queue[queue.next];
		if (item) {
			stats.totalProcessed++;
			if (!noDeleteOnNext) queue.shift();
			else queue.next++;
			var element = item.el;
			var fn = item.fn;
			var myWorkFunction;
			// use object specified work if supplied,
			// if undef, then use global.
			if (fn !== undefined) {
				myWorkFunction = fn;
			} else if ((fn  === undefined) && (work !== undefined)) {
				myWorkFunction = work;
			} 
			myWorkFunction.apply(myWorkFunction,[element,self]);
            emitter.emit('next');
		} 
	};
	self.workAsync = function() {
		var item; 
		if (!noDeleteOnNext) item = queue[0];
		else item = queue[queue.next];
		if (item) {
			stats.totalProcessed++;
			if (!noDeleteOnNext) queue.shift();
			else queue.next++;
			var element = item.el;
			var fn = item.fn;
			var myWorkFunction;
			// use object specified work if supplied,
			// if undef, then use global.
			if (fn !== undefined) {
				myWorkFunction = fn;
			} else if ((fn  === undefined) && (work !== undefined)) {
				myWorkFunction = work;
			} 
			myWorkFunction.apply(myWorkFunction,[element,self]);
		} 
	};
	// shorten the queue by n elements, starting from the beginning index 0 to n-1
	self.shorten = function(n) {
		for (var i = 0; i < n; i++) {
			queue.shift();
		}
	};
	self.updateToLastWorked = function() {
		this.shorten(queue.next);
		queue.next = 0;
		return self;
	};
	self.updateInPlace = function() {
		var last = queue[queue.length-1];
		// this is a stub function.
		// the goal of this function is to take the last element in
		// the queue, and then when that work function emits the next,
		// then there should be a trigger to make this fire,
		// thus this function has to insert a event at the place it
		// is called synchronously, so that update "behaves 
		// synchronously
	};
	self.pushSync = function(el,fn) {
        var obj = {};
        obj.el = el;
        obj.fn = fn;
        obj.type = 'sync';
		if (transform !== undefined) {
			obj.el = transform(el);
		}
		queue.push(obj);
		if (governor !== undefined) {
			governor(queue,self);
		}
		if (sortall !== undefined) {
			queue = sortall(queue);
		} else if (sort !== undefined) {
			queue.sort(sort);
		}	
		if ((queue.length > 0) && (working == false) && (paused === false)) {
			working = true;
			this.workSync();
		} else {
		}
		return self;
	};
	self.pushAsync = function(el,fn) {
        var obj = {};
        obj.el = el;
        obj.fn = fn;
        obj.type = 'async';
		if (transform !== undefined) {
		    obj.el = transform(el);
		}
		queue.push(obj);
		if (governor !== undefined) {
			governor(queue,self);
		}
		if (sortall !== undefined) {
			queue = sortall(queue);
		} else if (sort !== undefined) {
			queue.sort(sort);
		}	
		if ((queue.length > 0) && (working == false) && (paused === false)) {
			working = true;
			this.workAsync();
		} else {
		}
		return self;
	};
	self.pause = function() {
		paused = true;
		return self;
	};
	self.resume = function() {
		paused = false;
        if (queue.length > 0) {
            var item = queue[0];
            if (item.type == 'sync') {
                this.workSync();
            }
            if (item.type == 'async') {
                this.workAsync();
            }
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
