```js
//promise 是一个构造函数
//传入的参数也是一个函数
const Promise1 = function (executor) {
  this.status = 'pending'; //状态 pending fulfilled rejected
  this.value = undefined; //成功的值
  this.reason = undefined; //失败的值
  //`fulfilledCallbacks` 和 `rejectedCallbacks` 是数组，因为一个 Promise 可以有多个 `then` 方法调用。每次调用 `then` 方法时，都会向这两个数组中添加回调函数。
  //当 Promise 的状态变为 fulfilled 或 rejected 时，会执行相应数组中的所有回调函数。这是 Promise 的异步特性的一部分，允许在 Promise 完成之前添加多个回调函数，并在 Promise 完成时一次性执行所有回调函数。
  this.FulfilledCallbacks = []; //成功的回调
  this.RejectedCallbacks = []; //失败的回调
  //成功
  const resolve = value => {
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'resolved';
        this.value = value;
        this.FulfilledCallbacks.forEach(fn => fn(this.value));
      }
    });
  };
  //失败
  const reject = reason => {
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.RejectedCallbacks.forEach(fn => fn(this.reason));
      }
    });
  };
  executor(resolve, reject); //函数传入的参数是两个函数resolve，reject
};

//then方法,then方法接收两个参数，一个是成功的回调，一个是失败的回调
Promise1.prototype.then = function (onFulfilled, onRejected) {
  //onFulfilled, onRejected应该是微任务
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
  onRejected =
    typeof onFulfilled === 'function'
      ? onRejected
      : error => {
          throw error;
        };
  if (this.status === 'resolved') {
    onFulfilled(this.value);
  }
  if (this.status === 'rejected') {
    onRejected(this.reason);
  }
  if (this.status === 'pending') {
    this.FulfilledCallbacks.push(onFulfilled);
    this.RejectedCallbacks.push(onRejected);
  }
};

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});
p1.then(
  data => {
    console.log(data);
  },
  error => {
    console.log(error);
  }
);
```

- class 写法

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending'; // Promise 状态
    this.value = undefined; // fulfilled 状态的值
    this.reason = undefined; // rejected 状态的原因
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === 'fulfilled') {
      onFulfilled(this.value);
    } else if (this.status === 'rejected') {
      onRejected(this.reason);
    }
    if (this.status === 'pending') {
      this.onResolvedCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}
```

- 链式调用

then 方法返回一个新的 promise，所以可以链式调用

```js
//promise 是一个构造函数
//传入的参数也是一个函数
const Promise1 = function (executor) {
  this.status = 'pending';
  this.value = undefined;
  this.reason = undefined;
  this.FulfilledCallbacks = [];
  this.RejectedCallbacks = [];

  const resolve = value => {
    if (this.status === 'pending') {
      this.status = 'resolved';
      this.value = value;
      this.FulfilledCallbacks.forEach(fn => fn(this.value));
    }
  };

  const reject = reason => {
    if (this.status === 'pending') {
      this.status = 'rejected';
      this.reason = reason;
      this.RejectedCallbacks.forEach(fn => fn(this.reason));
    }
  };

  executor(resolve, reject);
};

Promise1.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : error => {
          throw error;
        };

  return new Promise1((resolve, reject) => {
    if (this.status === 'resolved') {
      try {
        const x = onFulfilled(this.value);
        resolve(x);
      } catch (e) {
        reject(e);
      }
    }

    if (this.status === 'rejected') {
      try {
        const x = onRejected(this.reason);
        resolve(x);
      } catch (e) {
        reject(e);
      }
    }

    if (this.status === 'pending') {
      this.FulfilledCallbacks.push(() => {
        try {
          const x = onFulfilled(this.value);
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

const p1 = new Promise1((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});
const p2 = p1.then(
  data => {
    console.log(data);
  },
  error => {
    console.log(error);
  }
);
console.log(p2);
```

- class 写法

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        try {
          const x = onFulfilled(this.value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      } else if (this.status === 'rejected') {
        try {
          const x = onRejected(this.reason);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      } else if (this.status === 'pending') {
        this.onResolvedCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  }
}
```

- resolvePromise 处理 then 的返回值

```js
function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise2 和 x 指向同一个对象，那么会产生循环引用的问题，需要抛出错误
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 如果 x 是对象或者函数，那么有可能是一个 Promise 对象
  if (x && (typeof x === 'object' || typeof x === 'function')) {
    let used;
    try {
      // 尝试获取 x.then
      let then = x.then;
      // 如果 then 是函数，那么我们认为 x 是一个 Promise
      if (typeof then === 'function') {
        // 使用 call 方法调用 then，第一个参数绑定 this 到 x，后面两个参数是 Promise 成功和失败的回调
        then.call(
          x,
          y => {
            // 如果 used 为 true，那么直接返回，避免多次调用
            if (used) return;
            used = true;
            // 递归调用，因为 y 可能还是一个 Promise
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            // 如果 used 为 true，那么直接返回，避免多次调用
            if (used) return;
            used = true;
            // 如果 then 方法中抛出错误，则将状态改为 rejected
            reject(r);
          }
        );
      } else {
        // 如果 then 不是函数，那么 x 不是一个 Promise，直接 resolve
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (e) {
      // 如果获取 x.then 的过程中抛出错误，则将状态改为 rejected
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    // 如果 x 不是对象也不是函数，那么 x 不能是一个 Promise，直接 resolve
    resolve(x);
  }
}

Promise1.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : error => {
          throw error;
        };

  let promise2 = new Promise1((resolve, reject) => {
    if (this.status === 'resolved') {
      try {
        let x = onFulfilled(this.value);
        resolvePromise(promise2, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    }

    if (this.status === 'rejected') {
      try {
        let x = onRejected(this.reason);
        resolvePromise(promise2, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    }

    if (this.status === 'pending') {
      this.FulfilledCallbacks.push(() => {
        try {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });

      this.RejectedCallbacks.push(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
  });

  return promise2;
};
```
