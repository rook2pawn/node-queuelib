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

