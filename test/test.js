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

test("ordering test B", function (t) {
  t.plan(1);
  let number = 1;
  const jq = new JobQueue({ MAX_ACTIVE: 2 });
  jq.enqueue((done) => {
    return new Promise((resolve, reject) => {
      number *= 2;
      resolve();
    });
  });
  jq.enqueue((done) => {
    number++;
    done();
  });
  jq.on("empty", () => {
    t.equal(number, 3); // 1 => 2 => 3
  });
});
