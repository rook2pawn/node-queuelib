var EventEmitter = require('events').EventEmitter;
exports = module.exports = qlib;
function qlib(myWorkFunction) {
	var emitter = new EventEmitter;
	var queue = [];
    var nextfn = function() { 
        if (queue.length > 0) {
            var item = queue[0];
            if (item.type == 'async') {
                this.workAsync();
            }
        }
	};
	emitter.on('next',nextfn.bind(this));
	if (emitter.listeners('done').length == 0) {
		emitter.on('done',function() { 
            console.log("Queue currently empty. All done.");
        });
	} 
	this.working = false;
    this.workAsync = function() {
		var item = queue[0];
		if (item) {
			queue.shift();
			var element = item.el;
			var fn = item.fn || myWorkFunction;
            if (element === undefined)
			    fn.apply(fn,[this]);
            else 
    			fn.apply(fn,[element,this]);
		} 
	};
	this.pushAsync = function(el,fn) {
        if (arguments.length == 1) {
		    queue.push({fn:el,type:'async'});
        } else 
            queue.push({el:el,fn:fn,type:'async'});
		if ((queue.length > 0) && (this.working == false)) {
			this.working = true;
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
    this.series = function(list) {
        list.forEach(function(item) {
            queue.push({fn:item,type:'async'});
        });
    }
};
