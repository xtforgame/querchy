/* eslint-disable no-unused-vars, no-undef */

import chai from 'chai';
import mainFunc from 'library';

import {
  data01,
  err01,
} from '../test-data';

const { expect } = chai;

describe('Main Test Cases', () => {
  describe('Echo Test', () => {
    it('.then()', () => mainFunc(data01)
        .then((result) => {
          expect(result).to.exists;
          expect(result.val01).to.equal(1);
        }));
  });
});
