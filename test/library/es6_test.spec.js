/* eslint-disable no-unused-vars, no-undef, no-param-reassign */

import chai from 'chai';

const { expect } = chai;

describe('Es6 features test', () => {
  describe('Promise test 1: Basic', () => {
    function promise_test_01() {
      return new Promise(((resolve, reject) => {
        resolve(true);
      }));
    }

    function promise_test_02() {
      return Promise.reject(new Error('err'));
    }

    it('.then()', () => promise_test_01()
        .then((result) => {
          expect(result).to.equal(true);
        }));

    it('.catch()', () => promise_test_02()
        .then()
        .catch((error) => {
          expect(error.message).to.equal('err');
        }));
  });


  describe('Promise test 2: eachSeries', () => {
    function asyncEachSeries(in_array, in_func, start_value) {
      return in_array.reduce(
        (previousPromise, currentValue, currentIndex, array) => previousPromise.then(
          previousValue => in_func(previousValue, currentValue, currentIndex, array)
        ), Promise.resolve(start_value)
      );
    }

    it('asyncEachSeries', () => asyncEachSeries([0, 1, 2, 3, 4, 5, 6], (previousValue, currentValue, currentIndex, array) => previousValue + currentValue, 0)
      .then((result) => {
        expect(result).to.equal(21);
      }));
  });
});
