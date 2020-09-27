// JobQueue -
class JobQueue {
  constructor(params = {}) {
    const { MAX_ACTIVE = 1 } = params;
    this.MAX_ACTIVE = MAX_ACTIVE;
    this.num_active = 0;
    this.queue = [];

    this.eventHash = { empty: undefined };
    this.emptyTimerId = undefined;
  }
  on(event_type, cb) {
    this.eventHash[event_type] = cb;
  }
  next() {
    if (this.queue.length) {
      if (this.num_active < this.MAX_ACTIVE) {
        this.execute(this.queue.shift());
      }
    } else {
      if (this.eventHash["empty"] !== undefined) {
        if (this.emptyTimerId !== undefined) {
          clearTimeout(this.emptyTimerId);
        }
        this.emptyTimerId = setTimeout(() => {
          if (this.queue.length === 0) this.eventHash["empty"]();
        }, 1000);
      }
    }
  }
  finish() {
    this.num_active--;
    this.next();
  }
  execute(fn) {
    this.num_active++;
    new Promise((resolve, reject) => {
      const obj = fn(resolve);
      if (obj && typeof obj.then === "function") {
        resolve();
      }
    }).then(() => {
      this.finish();
    });
  }
  enqueue(fn) {
    this.queue.push(fn);
    this.next();
  }
  dequeue() {}
}

module.exports = exports = JobQueue;
