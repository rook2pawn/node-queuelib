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

Flags
=====

Flags as in, var Q = require('queuelib'); var myQueue = Q(flags);

flags.work (optional)
--------------------
Supply a global work function that will be used on each element as they are processed.

flags.autonext (optional)
------------------------
autonext is a boolean. If true, then the queue will process the next element immediately after calling the work function. Only set this to be true if you know your work function is synchronous. If set to true, there is no need to call self.done() at the end of your work function.

flags.noDeleteOnNext (optional) 
------------------------------
noDeleteOnNext is a boolean. If true, then the queue will NOT delete the element after it is done processing with the work function. Use this is conjuction with the .update() method to cull already processed members of the queue.

Methods
=======

.push(element, workfn) 
----------------------
element is required. workfn is optional, if already supplied by a global workfunction in the flags.work section. Pushes element onto the queue. If workfn is supplied, this overrides the global work function if set. 

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
Supply a governor function, which should takes a the queue and the lib argument (which consists of all these methods) as its arguments. The queue can be modified in place. This function is applied after the push. The idea behind a governor function is that you may want to do either housekeeping or additional queue re-arrangement or modification to the elements that require looking at the queue as a whole, but keep the logic separate from the .sortall function if supplied. 

	example:
		var q = Qlib().governor(function(queue,lib){
				\\ do stuff
			});

.done()
-------
Call this in your supplied work function after you are done with the work.

.length()
---------
Returns the current length of the queue.

.update()
---------
Call this to trim the queue from index 0 to the current position. Use this option when the nodelete flag is specified.

.queue() 
--------
Returns the most current copy of the entire queue.

The Work Function
=================

Okay a whole section devoted to just the work function!

Your supplied work function should look like this

	var myWorkFunction = function(element, lib) {
		// do stuff
		lib.done();
	};

The second argument is optional. In fact, if you just define 
your work function as

	var myWorkFunction = function(element) {
		// do stuff
	}

Notice that we did not call .done(). Queuelib is smart enough to recognize that
any second argument did not call that method, and will automagically invoke autonext to be true for that particular processing of that element! Sweet!

Here's what you need to know: 

The work function takes two arguments, the element itself that is to be processed, and the library argument. The library argument has access to all the methods discussed in the Methods section, most importantly, the .done() method in order to signify the work function is in fact, done processing.

Example:

	var workfn = function(element, lib) {
		var x = element % 5;
		lib.done();
	}


