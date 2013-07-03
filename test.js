var Qlib = require('./');
var myQ = new Qlib(function(data) {
    console.log(data*2);
    doSomething();
}); 
var doSomething = function() {
    setTimeout(function() {
        myQ.done();
    },1000);
};

myQ.pushAsync(2);
myQ.pushAsync(3);
myQ.pushAsync(4);
myQ.pushAsync(5);
myQ.pushAsync(6);
myQ.pushAsync(7);
