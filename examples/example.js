var EventEmitter = require('events').EventEmitter;
var Qlib = require('queuelib');
var myEmitter = new EventEmitter;
var myWorkFunction = function(el) { console.log(el + " is great!"); myEmitter.emit('next'); };
var q = Qlib({work:myWorkFunction, emitter:myEmitter});

q.push('NodeJS');
q.push('DNode');

