/* eslint-disable no-unused-vars, no-undef */

import chai from 'chai';
import fullX1 from 'library/tests/fullX1';

const { expect } = chai;

describe('Main Test Cases', () => {
  describe('Full01 Test', function () {
    this.timeout(5000);
    it('.then()', () => fullX1()
        .then((result) => {
          expect(result).to.exists;
        }));
  });
});
