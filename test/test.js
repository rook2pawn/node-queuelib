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
	q.pushSync('cat',function(el) { 
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
	q.pushSync(testSwitch, function(el) {
		console.log("switching value of testSwitch: " + el)
		el = !el;
		testSwitch = el;
		console.log("new value of testSwitch: " + el);
	});
};
// test that the governor function modifies the queue
exports.testGovernor = function(test) {
	var doThis = function(queue,self) {
		queue[0].el = "dog";
	};
	test.expect(1);
	var q = qlib().governor(doThis);
	var outstring = "";
	q.pushSync('cat',function(el) { 
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
	q.pushSync('aardvark')
	.pushSync('bat')
	.pushSync('cat');
	q.pushSync('dog');
	test.deepEqual(['AARDVARK','BAT','CAT','DOG'],myResults);
	test.done();
};
// test that noDeleteOnNext flag is working
exports.testNoDeleteOnNext = function(test) {
	test.expect(1);
	var myQueue = [];
	var q = qlib({noDeleteOnNext:true,work:function(el) {}});
	q.pushSync('aardvark')
	.pushSync('bat')
	.pushSync('cat');
	q.pushSync('dog');
	myQueue = q.queue();
	test.deepEqual([
    {el:'aardvark',fn:undefined,type:'sync'},
    {el:'bat',fn:undefined,type:'sync'},
    {el:'cat',fn:undefined,type:'sync'},
    {el:'dog',fn:undefined,type:'sync'}],myQueue);
	test.done();
};

// test that updateToLastWorked method is working (noDelete flag must be on)
exports.testUpdateToLastWorked = function(test) {
	test.expect(1);
	var myQueue = [];
	var q = qlib({noDeleteOnNext:true,work:function(el) {}});
	q.pushSync('aardvark')
	.pushSync('bat')
	.pushSync('cat')
	.updateToLastWorked()
	.pushSync('dog');
	myQueue = q.queue();
    console.log("myQueue:");console.log(myQueue);
	test.deepEqual([{el:'dog',fn:undefined,type:'sync'}],myQueue);
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
	q.pushAsync('aardvark')
	.pushAsync('bat')
	.pushAsync('cat')
	.updateToLastWorked() // this should update to bat, cat, cutting out aardvark, which would have been worked on already.
	.pushAsync('dog', function(el,lib) {
		var ms = 600;
		setTimeout(function(){
			console.log(el);
			console.log("waiting "+ms+"ms");
			lib.done();
			myQueue = lib.queue();
            myQueue[myQueue.length-1].fn = 'strickenForTestingPurposes';
            test.deepEqual([
            {el:'bat',fn:undefined,type:'async'},
            {el:'cat',fn:undefined,type:'async'},
            {el:'dog',fn:'strickenForTestingPurposes',type:'async'}],myQueue);
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
	q.pushAsync('aardvark',function(el,lib) {
		test.deepEqual({el:'aardvark',firstLetter:'a'},el);
		lib.done();
	});
	q.pushAsync('bat',function(el,lib) {
		test.deepEqual({el:'bat',firstLetter:'b'},el);
		lib.done();
	});
	q.pushAsync('cat',function(el,lib) {
		test.deepEqual({el:'cat',firstLetter:'c'},el);
		lib.done();
	});
	test.done();
};

exports.testPauseOnSync = function(test) {
	var results = [];
	var q = qlib({work:function(el) {
		results.push(el);
	}});
	q
	.pushSync('aardvark')
	.pause()
	.pushSync('bat');
	test.expect(6);
	test.equals('aardvark', results.pop());
	test.equals(0, results.length);
	test.equals(1, q.queue().length);
	q.resume();
	test.equals('bat',results.pop());
	q.pause()
	.pushSync('cat');
	test.equals(0, results.length);
	test.equals(1, q.queue().length);
	test.done();
};
exports.testPauseOnAsync = function(test) {
	var results = [];
	var q = qlib({work:function(el,lib) {
		setTimeout(function() {
			console.log("pushing after 600ms");
			results.push(el);
			lib.done();
		},600);	
	}});
	q
	.pushAsync('aardvark')
	.pause()
	.pushAsync('bat')
	test.expect(5);
	console.log(q.queue());
	setTimeout(function(){
		console.log("testing after initial 750ms");
		test.equals('aardvark', results.pop());
		test.equals(0, results.length);
		test.equals(1, q.queue().length);
		q.resume();
		setTimeout(function() {
			console.log("testing after additional 750ms");	
			test.equals('bat',results.pop());
			test.equals(0,results.length);
			test.done();
		},750);
	},750);
};
exports.testPauseOnMixed = function(test) {
	test.expect(0);
	test.done();
};

exports.testVelocity = function(test) {
    test.expect(1);
    var q = qlib({work:function(el){}});
    q.pushSync('foo');
    setTimeout(function() {
        q.pushSync('bar');
        setTimeout(function() {
            q.pushSync('baz');
            setTimeout(function() {
                q.pushSync('qux');
                test.equals(4,q.getVelocity('push'));
                test.done();
            },210);
        },210);
    },210);
};
