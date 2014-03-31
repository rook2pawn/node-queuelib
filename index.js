var EventEmitter = require('events').EventEmitter;
exports = module.exports = qlib;

function qlib(myWorkFunction) {
	this.emitter = new EventEmitter;
	var queue = [];
    var nextfn = function() { 
        if (queue.length > 0) {
            var item = queue[0];
            if (item.type == 'sync') {
                this.workSync();
            } else if (item.type == 'async') {
                this.workAsync();
            }
        }
	};
	this.emitter.on('next',nextfn.bind(this));
	if (this.emitter.listeners('done').length == 0) {
		this.emitter.on('done',function() { 
            console.log("Queue currently empty. All done.");
        });
	} 
	this.working = false;
    this.workAsync = function() {
        var item = queue.shift();
        if (item !== undefined) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            if (item.el === undefined)
			    fn.apply(fn,[this]);
            else 
    			fn.apply(fn,[item.el,this]);
		} 
	};
	this.pushAsync = function(el,fn) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    queue.push({fn:el,type:'async'});
        } else 
            queue.push({el:el,fn:fn,type:'async'});
		if ((queue.length > 0) && (this.working == false)) {
			this.workAsync();
		}
		return this;
	};
    this.workSync = function() {
        var item = queue.shift();
        if (item !== undefined) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            if (item.el === undefined)
			    fn.apply(fn,[this]);
            else 
    			fn.apply(fn,[item.el,this]);
        } 
    };
    this.pushSync = function(el,fn) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    queue.push({fn:el,type:'sync'});
        } else 
            queue.push({el:el,fn:fn,type:'sync'});
        if ((queue.length > 0) && (this.working == false)) {
            this.workSync();
        }
    }
	this.done = function() {
        this.working = false;
		this.emitter.emit('next');
	};
    this.series = function(list) {
        list.forEach(function(item) {
            queue.push({fn:item,type:'async'});
        });
    }
};
