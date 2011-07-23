QueueLib
========

QueueLib is an easy, small, and flexible asynchronous event driven queue library. 

one-minute example
------------------

	var Qlib = require('queuelib');
	var q = Qlib({work:function(val) { console.log( parseInt(val) + 3) }});
	q
	.push(2)
	.push(3)
	.push(4);

	// Results in 
	
	> 5
	> 6
	> 7

Features
========

1. First-In, First-Out (FIFO) over asynchronous functions
2. Loopback control (Objects can requeue themselves, see examples/loopback.js)
3. control over emitter and the queue 
4. Policy free priority queueing with middleware .use and .sort
5. Global or per-object work functions

handles asynchronous functions with ease!
-----------------------------------------
The design of QueueLib has asynchronous functions especially in mind! 
Just emit "next" at the end of your function! (Where the emitter is the one you pass to Qlib),
and your all your asynchronous functions will behave in a FIFO manner!
Although synchronous functions work just as fine!

example #1 (global work functionality)
------------------------------------------

	var Qlib = require('queuelib');
	var myEmitter = new EventEmitter;
	var q = Qlib({
			work:function(val,emitter) { 
				console.log( val + " is great!");
				emitter.emit('next');
			},
			emitter:myEmitter
		});

	q
	.push('NodeJS')
	.push('DNode')
	// Results in 

	> NodeJS is great!
	> DNode is great!


example #2 (per object work functionality)
------------------------------------------

	var Qlib = require('queuelib');
	var myEmitter = new EventEmitter;
	var q = Qlib({emitter:myEmitter});

	q
	.push('NodeJS',function(val,emitter) {console.log(val + " is great!");emitter.emit('next');})
	.push('DNode',function(val,emitter) {console.log(val + " is freestyle RPC!");emitter.emit('next');})
	.push('Cats', function(val,emitter) {console.log(val + " are fuzzy and sleepy.");emitter.emit('next');});

	// Results in 

	> NodeJS is great!
	> DNode is freestyle RPC!
	> Cats are fuzzy and sleepy.

example #3 (asynchronous example behaving serially)
---------------------------------------------------

	var Qlib = require('queuelib');
	var myEmitter = new EventEmitter;
	var q = Qlib({
			work:function(val,emitter) { 
				setTimeout(function() {
					console.log( val + " is great!");
					emitter.emit('next');
				}, 2500)
			},
			emitter:myEmitter
		});

	q
	.push('NodeJS')
	.push('DNode')

	// Results in 

	(2500 millisecond delay...)
	> NodeJS is great!

	(another 2500 millisecond delay...)
	> DNode is great!


you choose your own policy
--------------------------
Priority queue system? All you have to do 
is use the .use method to transform your push values into something that has a numeric index, and then supply an appropriate sort
method with the .sortall method. Simply supply a function that will accept the entire queue and the .sortall will perform a
sortall-on-push.

example:

	var q = Qlib({work:myWorkfn3,emitter:myEmitter3});
	
	q
	.use(function(el) { 
		return {element:el, index:el.slice(0,1).charCodeAt(0)}})
	.sort(function(a,b) { return b.index-a.index })

means that all future pushes will be sorted! In this specific example, the index we create is on
the numeric value of the first letter. Thus the priority will be for element strings that start 
from the letter z, y, x, ... , b, a. Go Zachary! Or Xanadu!


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

the work function
=================

1. Basic workfn : function(element) 

2. Regular workfn : function(element,emitter)

3. Object Awareness: workfn : function(element, emitter,queue)

the work function is passed along three values
1. the element itself
2. the emitter
3. and the queue itself.

1. the purpose of passing the element is for the work function to do something with the element.
2. the purpose of passing the emitter is for the work function to signal that its done by emitting next on the emitter.
3. the purpose of passing the queue is so that the work function may itself do arangement such as placing itself
back in line.
