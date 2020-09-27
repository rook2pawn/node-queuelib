const JobQueue = require("../");

const jq = new JobQueue();
jq.enqueue((done) => {
  console.log("Hi! A");
  setTimeout(done, 2000);
});
jq.enqueue((done) => {
  return new Promise((resolve, reject) => {
    console.log("Promise B!");
    resolve();
  });
});
jq.enqueue((done) => {
  console.log("Hello! B");
  setTimeout(done, 2000);
});
jq.enqueue((done) => {
  console.log("Hola! C");
  setTimeout(done, 2000);
});
jq.enqueue((done) => {
  console.log("Anyoung! D");
  setTimeout(done, 2000);
});
