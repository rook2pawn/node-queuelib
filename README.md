QueueLib
========

QueueLib is a small, flexible asynchronous event driven queue library.

example
-------

	var Qlib = require('queuelib');
	var myEmitter = new EventEmitter;
	var myWorkFunction = function(el) { console.log(el + " is great!"); myEmitter.emit('next'); };
	var q = Qlib({work:myWorkFunction, emitter:myEmitter});

	q
	.push('NodeJS')
	.push('DNode')
	.push('Cats');

	// Results in 

	> NodeJS is great!
	> DNode is great!
	> Cats is great! (exscuse my grammar)

handles asynchronous functions with ease!
-----------------------------------------
The design of QueueLib has asynchronous functions especially in mind! 
Just emit "next" at the end of your function! (Where the emitter is the one you pass to Qlib)

sample use case
---------------
Suppose your work function launches an asynchronous call, whose result is say, 15 seconds away.
Well, when the result is actually done, simply do

	myEmitter.emit('next')

And the queue will pick up again! 
