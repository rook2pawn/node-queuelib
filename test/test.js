var qlib = require('../index');

exports.testFlags = function(test) {
	var q = qlib();
	var q2 = qlib({});
	var q3 = qlib({noDeleteOnNext:true, work:function(){}});
	test.expect(4);
	test.equal(undefined, q.flags());
	test.deepEqual({}, q2.flags());
	test.equal(true, q3.flags().hasOwnProperty('work')); 
	test.equal(true, q3.flags().noDeleteOnNext);
	test.done();
};
// test that the queue correctly pushes a value.
exports.testPushInserts = function(test) {
	var doThis = function(queue,self) {
		var length = self.length();
		test.equals(1,length);
		test.done();
	};
	test.expect(1);
	var q = qlib().governor(doThis);
	q.push('cat',function(el) { 
		console.log(el + "!");
		
	});
};

// test that the queue correctly performs the work function
exports.testWorkFunction = function(test) {
	test.expect(1);
	var testSwitch = false;
	var q = qlib({onNext : function() { 
		test.equals(true, testSwitch);
		test.done();
	}});
	q.push(testSwitch, function(el) {
		console.log("switching value of testSwitch: " + el)
		el = !el;
		testSwitch = el;
		console.log("new value of testSwitch: " + el);
	});
};
// test that the governor function modifies the queue
exports.testGovernor = function(test) {
	var doThis = function(queue,self) {
		queue[0][0] = "dog";
	};
	test.expect(1);
	var q = qlib().governor(doThis);
	var outstring = "";
	q.push('cat',function(el) { 
		outstring = el + " meows?";
		console.log(outstring);
	});
	// should result in dog meows? 
	test.equals('dog meows?',outstring);
	test.done();
};
// test that the global work function is in effect
exports.testGlobalWorkFunction = function(test) {
	test.expect(1);
	var myResults = [];
	var q = qlib({work:function(el) { myResults.push(el.toUpperCase());}});
	q.push('aardvark')
	.push('bat')
	.push('cat');
	q.push('dog');
	test.deepEqual(['AARDVARK','BAT','CAT','DOG'],myResults);
	test.done();
};
// test that noDeleteOnNext flag is working
exports.testNoDeleteOnNext = function(test) {
	test.expect(1);
	var myQueue = [];
	var q = qlib({noDeleteOnNext:true,work:function(el) {}});
	q.push('aardvark')
	.push('bat')
	.push('cat');
	q.push('dog');
	myQueue = q.queue();
	test.deepEqual([['aardvark'],['bat'],['cat'],['dog']],myQueue);
	test.done();
};

// test that updateToLastWorked method is working (noDelete flag must be on)
exports.testUpdateToLastWorked = function(test) {
	test.expect(1);
	var myQueue = [];
	var q = qlib({noDeleteOnNext:true,work:function(el) {}});
	q.push('aardvark')
	.push('bat')
	.push('cat')
	.updateToLastWorked()
	.push('dog');
	myQueue = q.queue();
	test.deepEqual([['dog']],myQueue);
	test.done();
};

// test that updateToLastWorked method is working with long running async work functions
exports.testUpdateToLastWorkedLongAsync = function(test) {
	test.expect(1);
	var myQueue = [];
	var q = qlib({noDeleteOnNext:true,work:function(el,lib) {
		var ms = 600;
		setTimeout(function(){
			console.log(el);
			console.log("waiting "+ms+"ms");
			lib.done();
		},ms);
	}});
	q.push('aardvark')
	.push('bat')
	.push('cat')
	.updateToLastWorked() // this should update to bat, cat, cutting out aardvark, which would have been worked on already.
	.push('dog', function(el,lib) {
		var ms = 600;
		setTimeout(function(){
			console.log(el);
			console.log("waiting "+ms+"ms");
			lib.done();
			myQueue = lib.queue();
			myQueue[myQueue.length-1].pop();
			test.deepEqual([['bat'],['cat'],['dog']],myQueue);
			test.done();
		},ms);
	});
};
// test that the transform on push function is working
exports.testTransform = function (test) {
	test.expect(3);
	var q = qlib().transform(function(el) {
		return {el:el, firstLetter:el.slice(0,1)}
	});
	q.push('aardvark',function(el,lib) {
		test.deepEqual({el:'aardvark',firstLetter:'a'},el);
		lib.done();
	});
	q.push('bat',function(el,lib) {
		test.deepEqual({el:'bat',firstLetter:'b'},el);
		lib.done();
	});
	q.push('cat',function(el,lib) {
		test.deepEqual({el:'cat',firstLetter:'c'},el);
		lib.done();
	});
	test.done();
};
