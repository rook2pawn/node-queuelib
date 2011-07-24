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

example #4 (loopback control)
---------------------------------------------------

	var Qlib = require('queuelib');
	var myEmitter = new EventEmitter;
	var q = Qlib({emitter:myEmitter});
	q.push('aardvark', function(obj,emitter,self) {
		console.log(obj + " is a creature!");
		setTimeout(function(){
			self.push(obj,function(val,emitter,self) {
			console.log(obj + " is now in the back of the line");
			emitter.emit('next');
			});
		}, 600);
		emitter.emit('next');
	})
	.push('bat', function(obj,emitter) {
		console.log(obj + " flies.");
		emitter.emit('next');
	})
	.push('cephalopod',function(obj,emitter){
		console.log(obj + " likes to play sea footsie!");
		emitter.emit('next');
	});

	// results in
	
	> aardvark is a creature!
	> bat flies.
	> cephalopod likes to play sea footsie!
	// after 600 ms
	> aardvark is now in the back of the line

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

invocations
===========

Qlib is flexible!

1. var q = Qlib();
2. var q = Qlib({work:function(){});
3. var q = Qlib({emitter:myEmitter});
4. var q = Qlib({work:function(){},emitter:myEmitter});

New: Also included is 
5. var q = Qlib({noDeleteOnNext:true}); 

noDeleteOnNext flag allows you to keep the FIFO behaviour of the queue, without specifically deleting the elements on emit('next').
This allows one a fine grain control over when and how the delete behaviour should be invoked within the realm of the work function
(the work function is passed self as the third parameter, you can retrieve the queue via self.queue() within the work function)


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

.queue 
------
.queue returns the internal queue. this method is primarily meant to be invoked through the work function self parameter, i.e. self.queue() within the execution of the work function

the work function
=================

work(element,emitter,self)

The work function, combined with .use, allows for many types of queue constructs

1. Internally directed flow control
2. Loop back (self-placement)
3. Serial Asynchronous : asynchronous functions executes serially
4. Full Asynchronous : if you don't include the emitter on invocation of
Queuelib, then Queuelib assumes to emit next after execution of the work function, regardless if the work function is synchronous or asynchronous.

