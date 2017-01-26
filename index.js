var EventEmitter = require('events').EventEmitter;
var Hash = require('hashish');
exports = module.exports = QueueLib;

function QueueLib () {
	this.queue = [];
	this.working = false;
  this.hash = {};
};
QueueLib.prototype.workSync = function() {
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
QueueLib.prototype.pushSync = function(el,fn) {
  if ((arguments.length == 1) && (typeof el == 'function')) {
    this.queue.push({fn:el,type:'sync'});
  } else 
    this.queue.push({el:el,fn:fn,type:'sync'});
  if ((this.queue.length > 0) && (this.working == false)) {
    this.workSync();
  }
};

QueueLib.prototype.workAsync = function() {
  var item = this.queue.shift();
  var x = function() {
    var self = this;
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

QueueLib.prototype.pushAsync = function(el,fn,idx) {
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


QueueLib.prototype.get = function(key) {
  return this.hash[key];
};
QueueLib.prototype.set = function(obj) {
  if ((obj) && (typeof obj == 'object')) {
    Hash(this.hash).update(obj);
  }
  return true;
};

QueueLib.prototype.done = function(obj) {
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

QueueLib.prototype.terminate = function() {
  var tmp = [];
  var last = this.queue.pop();
  this.queue = [];
  if ((last !== undefined) && (last.isAllDoneFunction)) {
    last.fn();
  }
};

QueueLib.prototype.series = function(list, alldone) {
  if (list && list.length) {    
    list.forEach(function(obj,idx) {
      if ((typeof obj === 'object') && (obj.fn) && (obj.context))
        this.queue.push({fn:obj.fn.bind(obj.context),type:'async'});
      else 
        this.queue.push({fn:obj,type:'async'});
      if ((idx == list.length - 1) && (alldone !== undefined)) 
        this.queue.push({fn:alldone, type:'sync',isAllDoneFunction:true})      
    },this);
    if ((this.queue.length > 0) && (this.working == false)) 
      this.workAsync();
  } else {
    alldone();
  }
};

QueueLib.prototype.forEach = function(list, iterator, padding, alldone) {
  if (typeof padding == 'function') {
    alldone = padding;
    padding = 0;
  } else if (padding === undefined) 
    padding = 0
  if (list && list.length) {
    list.forEach(function(arg,idx) {
      this.queue.push({fn:iterator,type:'async',idx:idx,arg:arg,padding:padding})
      if ((idx == list.length - 1) && (alldone !== undefined)) 
        this.queue.push({fn:alldone, idx:idx,type:'sync',isAllDoneFunction:true})
    },this);
    if ((this.queue.length > 0) && (this.working == false))
      this.workAsync();
  } else {
    alldone();
  }
}

var gen_id = function() {
  return String.fromCharCode(~~(Math.random() * 26) + 97).concat((Math.random()+1).toString(36).substr(2,5))
}
