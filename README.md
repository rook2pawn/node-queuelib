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


