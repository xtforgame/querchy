export function defaultToPromiseFunc(prev, curr, index, array) {
  return Promise.resolve(curr);
}

export function toSeqPromise(inArray, toPrmiseFunc = defaultToPromiseFunc) {
  return inArray.reduce(
    (prev, curr, index, array) => prev.then(
      () => toPrmiseFunc(prev, curr, index, array),
    ),
    Promise.resolve(),
  );
}

export function promiseWait(waitMillisec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, waitMillisec);
  });
}

export class PreservePromise<T> {
  fulfilled : boolean;
  promise : Promise<T>;
  result? : {
    type: 'resolve' | 'reject',
    value: T | Error,
  };
  _resolve?: (value?: T | PromiseLike<T> | undefined) => void;
  _reject?: (reason?: any) => void;

  constructor() {
    this.fulfilled = false;
    this.promise = new Promise<T>((resolve, reject) => {
      if (this.result) {
        if (this.result.type === 'resolve') {
          resolve(<T>this.result.value);
        } else {
          reject(this.result.value);
        }
      } else {
        this._resolve = resolve;
        this._reject = reject;
      }
    });
  }

  resolve(value) {
    if (this.fulfilled) {
      return; // TODO: handle error
    }
    if (this._resolve) {
      this._resolve(value);
    } else {
      this.result = {
        type: 'resolve',
        value,
      };
    }
    this.fulfilled = true;
  }

  reject(value) {
    if (this.fulfilled) {
      return; // TODO: handle error
    }
    if (this._reject) {
      this._reject(value);
    } else {
      this.result = {
        type: 'reject',
        value,
      };
    }
    this.fulfilled = true;
  }
}

const toCamel = (str : string) : string => str.replace(/_([a-z])/g, g => g[1].toUpperCase());
const toUnderscore = (str : string) : string => str.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`);
const capitalizeFirstLetter = (str : string) : string => (
  str.charAt(0).toUpperCase() + str.slice(1)
);

export {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
};

/*
toSeqPromise([1, 2, 3, 4, 5, 6, 7], (_, value) => {
  console.log('value :', value);
  if(value != 5){
    return Promise.resolve(value);
  }
  return Promise.reject(value);
});
*/
