// JobQueue -
class JobQueue {
  constructor(params = {}) {
    const { MAX_ACTIVE = 1 } = params;
    this.MAX_ACTIVE = MAX_ACTIVE;
    this.num_active = 0;
    this.success = 0;
    this.failure = 0;
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
          if (this.queue.length === 0)
            this.eventHash["empty"]({
              success: this.success,
              failure: this.failure,
            });
        }, 1000);
      }
    }
  }
  finish({ isSuccess }) {
    this.num_active--;
    isSuccess ? this.success++ : this.failure++;
    this.next();
  }
  execute(fn) {
    this.num_active++;

    new Promise((resolve, reject) => {
      const obj = fn(resolve, reject);
      // check if return value is then-able
      // https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise
      if (obj && typeof obj.then === "function") {
        return obj
          .then(() => {
            this.finish({ isSuccess: true });
          })
          .catch((e) => {
            this.finish({ isSuccess: false });
          });
      } else {
        return obj;
      }
    }).then((e) => {
      if (e !== undefined) {
        this.finish({ isSuccess: false });
      } else {
        this.finish({ isSuccess: true });
      }
    });
  }
  enqueue(fn) {
    this.queue.push(fn);
    this.next();
  }
  dequeue() {}
}

module.exports = exports = JobQueue;
