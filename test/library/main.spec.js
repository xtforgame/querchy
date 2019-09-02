/* eslint-disable no-unused-vars, no-undef */

import chai from 'chai';
import fullX1 from 'test-data/fullX1';
import fullX2 from 'test-data/fullX2';

const { expect } = chai;

describe('Main Test Cases', () => {
  describe('FullX1 Test', function () {
    this.timeout(5000);
    it('.then()', () => fullX1()
        .then((result) => {
          expect(result).to.exists;
        }));
  });

  describe('FullX2 Test', function () {
    this.timeout(50000);
    it('.then()', () => fullX2()
        .then((result) => {
          expect(result).to.exists;
        }));
  });
});
