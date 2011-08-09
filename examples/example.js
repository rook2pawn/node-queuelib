var EventEmitter = require('events').EventEmitter;
var Qlib = require('../index');
var myWorkFunction = function(el,lib) { console.log(el + " is great!"); lib.done();};
var q = Qlib({work:myWorkFunction});

q.push('NodeJS');
q.push('DNode');

