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

const toCamel = (str : string) : string => str.replace(/_([a-z])/g, g => g[1].toUpperCase());
const toUnderscore = (str : string) : string => str.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`);
const capitalizeFirstLetter = (str : string) : string => (str.charAt(0).toUpperCase() + str.slice(1));

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