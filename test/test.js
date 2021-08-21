const test = require("tape");
const JobQueue = require("../");

test("ordering test", function (t) {
  t.plan(1);
  let number = 1;
  const jq = new JobQueue();
  jq.enqueue((done) => {
    number++;
    setTimeout(done, 2000);
  });
  jq.enqueue((done) => {
    return new Promise((resolve, reject) => {
      number *= 2;
      resolve();
    });
  });
  jq.on("empty", () => {
    t.equal(number, 4); // 1 => 2 => 4
  });
});

test("test that empty event fires", function (t) {
  t.plan(3);
  let number = 1;
  const jq = new JobQueue({ MAX_ACTIVE: 2 });
  jq.enqueue(() => {
    return new Promise((resolve, reject) => {
      number *= 2;
      resolve();
    });
  });
  jq.enqueue((done) => {
    number++;
    done();
  });
  jq.on("empty", ({ success, failure }) => {
    t.equal(success, 2);
    t.equal(failure, 0);
    t.equal(number, 3); // 1 => 2 => 3
  });
});
