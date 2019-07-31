/* eslint-disable no-unused-vars, no-undef */

import chai from 'chai';
import full01 from 'library/tests/full01';

const { expect } = chai;

describe('Main Test Cases', () => {
  describe('Full01 Test', function () {
    this.timeout(5000);
    it('.then()', () => full01()
        .then((result) => {
          expect(result).to.exists;
        }));
  });
});
