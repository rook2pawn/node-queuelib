var EventEmitter = require('events').EventEmitter;
var Hash = require('hashish');
exports = module.exports = qlib;

function qlib(myWorkFunction) {
	this.emitter = new EventEmitter;
    this.current_alldone = ''
	this.queue = [];
    var nextfn = function() { 
        if (this.queue.length > 0) {
            var item = this.queue[0];
            if (item.type == 'sync') {
                this.workSync();
            } else if (item.type == 'async') {
                if (item.series) 
                    this.workAsync_series();
                else 
                    this.workAsync();
            }
        } else {
            if (this.alldone !== undefined)
                this.alldone()
        }
	};
	this.emitter.on('next',nextfn.bind(this));
	if (this.emitter.listeners('done').length == 0) {
		this.emitter.on('done',function() { 
            console.log("Queue currently empty. All done.");
        });
	} 
	this.working = false;
    this.current_each_alldone = '';
    this.workAsync = function() {
        var item = this.queue.shift();
        if (item.id)
            this.current_alldone = item.id
        if (item !== undefined) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            if (item.idx !== undefined)
    			fn.apply(fn,[item.el,item.idx,this]);
            else if (item.el === undefined)
			    fn.apply(fn,[this]);
		}
	};
	this.pushAsync = function(el,fn,idx,id) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    this.queue.push({fn:el,type:'async'});
        } else if (arguments.length == 2)
            this.queue.push({el:el,fn:fn,type:'async'});
        else if (arguments.length == 4)
            this.queue.push({el:el,fn:fn,idx:idx,id:id,type:'async'});
		if ((this.queue.length > 0) && (this.working == false)) {
			this.workAsync();
		}
		return this;
	};
    this.workAsync_series = function() {
        var item = this.queue.shift();
        if ((item !== undefined) && (item.series)) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            var id = item.id;
            if (item.el === undefined) {
			    fn.apply(fn,[this,id]);
            } else {
                this.terminate = this.terminate.bind(s);
    			fn.apply(fn,[item.el,this,id]);
            }
		} 
	};
	this.pushAsync_series = function(fn,id) {
        this.queue.push({fn:fn,type:'async',id:id,series:true});
		if ((this.queue.length > 0) && (this.working == false)) {
			this.workAsync_series();
		}
		return this;
	};
    this.workSync = function() {
        var item = this.queue.shift();
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
        // this is for forEach
        if (this.current_alldone != '') {
            var count = getCount(this.queue,this.current_alldone)
            if (count == 0) {
                this.donemap[this.current_alldone]()
                delete this.donemap[this.current_alldone]
                this.current_alldone = ''
            }
        }
        // generally
        if ((obj) && (typeof obj == 'object')) {
            Hash(this.hash).update(obj);
        }
        this.working = false;
		this.emitter.emit('next');
	};
    this.terminate = function(id) {
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
    this.series = function(list) {
        var id = gen_id()
        list.forEach(function(item) {
            this.pushAsync_series(item,id);
        },this);
        return id
    }
    this._list = [];
    this.list = function(list) {
        this._list = list;
        return this
    }
    this._iterator;
    this.donemap = {}
    this.forEach = function(iterator) {
        this._iterator = iterator
        return this
    }
    this.end = function(alldone) {
        var id = gen_id();    
        this.donemap[id] = alldone || function() {}
        if (this._list.length)
            this._list.forEach(function(item,idx) {
                this.pushAsync(item,this._iterator,idx,id)
            },this)
        else {
            this.donemap[id]()
            delete this.donemap[id]
        }
            
    }
};
