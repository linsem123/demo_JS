function MyPromise(executor) {
  this.state = 'pending';
  this.value = undefined;
  this.reason = undefined;
  this.FullfilledCallbacks = [];
  this.RejectedCallbacks = [];
  const resolve = value => {
    if (this.state !== 'pending') return;
    this.state = 'fullfilled';
    this.value = value;
    this.FullfilledCallbacks.forEach(fn => fn(this.value));
  };
  const reject = reason => {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    this.reason = reason;
    this.RejectedCallbacks.forEach(fn => fn(this.reason));
  };
  executor(resolve, reject);
}
MyPromise.prototype.then = function (onFullfilled, onRejected) {
  onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => reason;
  return new MyPromise((resolve, reject) => {
    if (this.state === 'fullfilled') {
      try {
        const x = onFullfilled(this.value);
        resolve(x);
      } catch (e) {
        reject(e);
      }
    }
    if (this.state === 'rejected') {
      try {
        const x = onRejected(this.reason);
        resolve(x);
      } catch (e) {
        reject(e);
      }
    }
    if (this.state === 'pending') {
      this.FullfilledCallbacks.push(() => {
        try {
          const x = onFullfilled(this.value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      });

      this.RejectedCallbacks.push(() => {
        try {
          const x = onRejected(this.reason);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      });
    }
  });
};
const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});
p1.then(res => {
  console.log(res);
  return res + 'aa';
}).then(res => {
  console.log(res);
});

function MyNew(fn) {
  const obj = Object.create(fn.prototype);
  const result = fn.apply(ob, Array.prototype.slice.call(arguments, 1));
  return typeof result === 'object' ? result : obj;
}
