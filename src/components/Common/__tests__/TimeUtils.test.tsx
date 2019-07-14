import { doDateRangesOverlap } from '../TimeUtils';

import moment = require('moment');

describe('TimeUtils doDateRangesOverlap tests', () => {

  const now = moment();
  const tomorrow = moment().add(1, 'day');
  const twoDaysFromNow = moment().add(2, 'day');
  const threeDaysFromNow = moment().add(3, 'days');

  it('no overlap', () => {
    const result = doDateRangesOverlap(now, tomorrow, twoDaysFromNow, threeDaysFromNow);
    expect(result).toBe(false);
  });

  it('overlap, neither range contains other range completely', () => {
    const result = doDateRangesOverlap(now, twoDaysFromNow, tomorrow, threeDaysFromNow);
    expect(result).toBe(true);
  });

  it('overlap, other range contains the other one completely', () => {
    const result = doDateRangesOverlap(now, threeDaysFromNow, tomorrow, twoDaysFromNow);
    expect(result).toBe(true);
  });

});
