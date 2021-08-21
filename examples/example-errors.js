const JobQueue = require("../");

const jq = new JobQueue();
let number = 1;
jq.enqueue(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject("beep");
    }, 2000);
  });
});
jq.enqueue(() => {
  return Promise.resolve("boop");
});
jq.enqueue((done) => {
  return done("boo");
});
jq.enqueue((done) => {
  return done();
});
