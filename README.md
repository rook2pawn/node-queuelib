QueueLib
========

QueueLib is a robust and flexible asynchronous flow control queue library. 

Robust: Want a governor function that has full control over the queue on push?

How about a transform interface that modifies the queue elements on push?

Policy-Free Priority Queue? You got it with custom sorts and transforms.

A single work function for all your objects you push? Sure.

A work function supplied by each object that governs itself? Yup.


one-minute example
------------------

	var Qlib = require('queuelib');
	var work = function(val) {
		return parseInt(val) + 3
	};
	var q = Qlib({work:work}});
	q
	.push(2)
	.push(3)
	.push(4);

	// Results in 
	
	> 5
	> 6
	> 7

Methods
=======

.sort(sortfn) 
-------------
Supply a sorting function for your queue after a push. This sort function should take two arguments and return either a positive or negative or 0 value. It is applied exactly like the Array.prototype.sort

.sortall(sortfn) 
----------------
Supply a sorting function that works across the entire queue, after a push. This sort function should take the entire queue as its argument, and then return the queue after its done.

.transform(transformfn) 
-----------------------
Supply a transformation function that transforms each element before the push. This function takes one argument, the element that is getting pushed, and transforms it. Return the transformed value.

.governor(governorfn) 
---------------------
Supply a governor function, which should take the entire queue as its argument. This function is applied after the push. The idea behind a governor function is that you may want to do either housekeeping or additional queue re-arrangement or modification to the elements that require looking at the queue as a whole, but keep the logic separate from the .sortall function if supplied. 

.done()
-------
Call this in your supplied work function after you are done with the work.

.length()
---------
Returns the current length of the queue.

.update()
---------
Call this to trim the queue from index 0 to the current position. Use this option when the nodelete flag is specified.


