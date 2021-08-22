const test = require("tape");
const JobQueue = require("../");

test("error handling", function (t) {
  t.plan(2);
  const jq = new JobQueue();
  jq.on("empty", ({ success, failure }) => {
    console.log(`Success: ${success} Failure: ${failure}`);
    t.equal(success, 2);
    t.equal(failure, 2);
  });
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
    // error
    return done("boo");
  });
  jq.enqueue((done) => {
    // good
    return done();
  });
});

test("error handling - failure event", function (t) {
  t.plan(2);
  const jq = new JobQueue();
  let count = 0;
  jq.on("failure", ({ error }) => {
    if (count === 1) {
      t.equal(error, "beep");
    }
    if (count === 2) {
      t.equal(error, "boo");
    }
  });
  jq.enqueue(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        count++;
        return reject("beep");
      }, 2000);
    });
  });
  jq.enqueue((done) => {
    // error
    count++;
    return done("boo");
  });
});
