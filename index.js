var EventEmitter = require('events').EventEmitter;
var Hash = require('hashish');
exports = module.exports = qlib;

function qlib() {
	this.queue = [];
	this.working = false;
    this.workAsync = function() {
        var item = this.queue.shift();
        var x = function() {
            var self = this;
            self._id = item.id;
            self.terminate = this.terminate.bind(self)
            if ((item.arg !== undefined) && (item.idx !== undefined))
                item.fn.apply({},[item.arg,item.idx,self]);
            else 
                item.fn.apply({},[self]);
        };
        if (item !== undefined) {
            this.working = true;
            if ((item.padding !== undefined) && (item.padding > 0)) {
                setTimeout(x.bind(this), item.padding)
            } else {
                x.call(this)
            }
		} 
	};
	this.pushAsync = function(el,fn,idx,id) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    this.queue.push({fn:el,type:'async'});
        } else if (arguments.length == 2)
            this.queue.push({el:el,fn:fn,type:'async'});
        else if (arguments.length == 4)
            this.queue.push({el:el,fn:fn,idx:idx,id:id,type:'async'});
        console.log("Push Async:", arguments);
        console.log("this.queue.length:", this.queue.length)
        console.log("this.working:", this.working)
		if ((this.queue.length > 0) && (this.working == false)) {
            console.log("WORKING ASYNC")
			this.workAsync();
		}
		return this;
	};
    this.workSync = function() {
        var item = this.queue.shift();
        if (item !== undefined) {
            this.working = true;
			var fn = item.fn;
            if (item.el === undefined)
			    fn.apply(fn,[this]);
            else 
    			fn.apply(fn,[item.el,this]);
        } 
        this.done()
    };
    this.pushSync = function(el,fn) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    this.queue.push({fn:el,type:'sync'});
        } else 
            this.queue.push({el:el,fn:fn,type:'sync'});
        if ((this.queue.length > 0) && (this.working == false)) {
            this.workSync();
        }
    }
    this.hash = {};
    this.get = function(key) {
        return this.hash[key];
    }
    this.set = function(obj) {
        if ((obj) && (typeof obj == 'object')) {
            Hash(this.hash).update(obj);
        }
        return true;
    }
    var getCount = function(list,id) {
        var count = 0;
        list.forEach(function(item) {
            if ((item.id) && (item.id == id))
                count++
        })
        return count
    }
	this.done = function(obj) {
        // generally
        if ((obj) && (typeof obj == 'object')) {
            Hash(this.hash).update(obj);
        }
        this.working = false;
        if (this.queue.length > 0) {
            var item = this.queue[0];
            if (item.type == 'sync')
                this.workSync();
            else if (item.type == 'async')
                this.workAsync();
        } 
	};
    this.terminate = function() {
        var id = this._id
        var tmp = [];
        for (var i = 0; i < this.queue.length; i++) {
            var item = this.queue[i];
            if ((item.id !== undefined) && (item.id == id)) {
                // unsaved
            } else {
                tmp.push(item);
            }
        }
        this.queue = tmp;
        this.done();
    };
    var gen_id = function() {
        return String.fromCharCode(~~(Math.random() * 26) + 97).concat((Math.random()+1).toString(36).substr(2,5))
    }
    this.series = function(list,padding) {
        if (padding === undefined) 
            padding = 0
        var id = gen_id()
        list.forEach(function(fn) {
            if ((typeof fn === 'object') && (fn.fn) && (fn.context))
                this.queue.push({fn:fn.fn.bind(fn.context),type:'async',id:id});
            else 
                this.queue.push({fn:fn,type:'async',id:id});
        },this);
        if ((this.queue.length > 0) && (this.working == false)) {
            this.workAsync();
        }
        return id
    }
    this.forEach = function(list, iterator, done, padding) {
        var id = gen_id()
        if (done === undefined)
            done = function() { console.log ("All done.") }
        if (padding === undefined) 
            padding = 0
        if (list && list.length) 
            list.forEach(function(arg,idx) {
                this.queue.push({fn:iterator,type:'async',idx:idx,id:id,arg:arg,padding:padding})
                if (idx == list.length - 1)
                    this.queue.push({fn:done, idx:idx,id:id,type:'sync'})
                if ((this.queue.length > 0) && (this.working == false))
                    this.workAsync();
            },this)
        else done()
    }
};
