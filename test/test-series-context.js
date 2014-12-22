var test = require('tape');

test('testSeriesContext',function(t) {
    t.plan(1);
    var QL = require('../');
    var q = new QL;

    q.series([
    {fn:
        function() {
            var c = this.a + this.b;
            t.equals(42,c)
        },
     context: {a:30,b:12}
    }
    ])
})
