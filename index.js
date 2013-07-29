var EventEmitter = require('events').EventEmitter;
exports = module.exports = qlib;
function qlib(myWorkFunction) {
	var emitter = new EventEmitter;
	var queue = [];
    var nextfn = function() { 
        if (queue.length > 0) {
            var item = queue[0];
            if (item.type == 'sync') {
                this.workSync();
            }
            if (item.type == 'async') {
                this.workAsync();
            }
        }
	};
	emitter.on('next',nextfn.bind(this));
	if (emitter.listeners('done').length == 0) {
		emitter.on('done',function() { console.log("Queue currently empty. All done.");});
	} 
	this.working = false;
	this.workSync = function() {
		var item = queue[0];
		if (item) {
			this.working = true
			queue.shift();
			var element = item.el;
			var fn = item.fn || myWorkFunction;
			fn.apply(fn,[element,this]);
            emitter.emit('next');
		} 
	};
    this.workAsync = function() {
		var item = queue[0];
		if (item) {
			this.working = true;
			queue.shift();
			var element = item.el;
			var fn = item.fn || myWorkFunction;
			fn.apply(fn,[element,this]);
		} 
	};
	this.pushSync = function(el,fn) {
		queue.push({el:el,fn:fn,type:'sync'});
		if ((queue.length > 0) && (this.working == false)) {
			this.workSync();
        }
		return this;
	};
	this.pushAsync = function(el,fn) {
		queue.push({el:el,fn:fn,type:'async'});
		if ((queue.length > 0) && (this.working == false)) {
			this.workAsync();
		} else {
            console.log(this.working);
        }  
		return this;
	};
	this.done = function() {
        this.working = false;
		emitter.emit('next');
	};
	this.queue = function() {
		return queue.slice(0);
	};	
};
