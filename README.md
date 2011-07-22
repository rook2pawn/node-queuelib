QueueLib
========

QueueLib is a small, flexible asynchronous event driven queue library.
Features:
1.	Work function for each element
2.	or, each element can supply its own work function!
3.	Transformation Middleware with .use to transform elements
4.	Sorting Middleware with .sort or .sortall

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

you choose your own policy
--------------------------
Often, an individual in possession of a queue, will want to attempt to use a priority queue system. All you have to do 
is use the .use method to transform your push values into something that has a numeric index, and then supply an appropriate sort
method with the .sortall method. Simply supply a function that will accept the entire queue and the .sortall will perform a
sortall-on-push.

methods
=======

.push(val)
-----
Push a value onto the queue. 

.use(function(val) { // transform val ; return val})
----
Supply a function that will take a queue value and return a queue value before a value is pushed onto the queue.

.sort(function(a,b) { // perform numeric comparison; })
-----
Supply a numeric comparison sort function that takes two values that will sort-on-push. This uses the built-in array.sort comparison function feature (you supply a comparison function, and the Array.sort will do the rest)

	e.g. .sort(function (a,b) { return a - b }) 

.sortall(function(queue) { // perform sort on queue; return queue; })
--------
.sortall will superscede a .sort. Supply a function that will A .sort and .sortall method go hand-in-hand with implementing your own priority queues.

	e.g. .sortall(function (queue) { 
		// sort the queue your way, use the .use method to create on-the-fly indexes. ;
		return queue; }

 
