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
exports.testPush = function(test) {
	var doThis = function() {
		test.equals(true, myTestSwitch);
		test.done();
	};
	test.expect(1);
	var q = qlib({onNext:doThis});
	var myTestSwitch = false;
	q.push('cat',function(el) { myTestSwitch = true; console.log("Cat!");});
};
