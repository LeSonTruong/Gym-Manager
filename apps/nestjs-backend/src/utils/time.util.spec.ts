import { oneDay, oneHour, oneMinute, oneMonth, oneSecond, oneWeek } from './time.util';

describe('time.util constants', () => {
  it('should define one second in milliseconds', () => {
    expect(oneSecond).toBe(1000);
  });

  it('should derive one minute and one hour values consistently', () => {
    expect(oneMinute).toBe(60 * oneSecond);
    expect(oneHour).toBe(60 * oneMinute);
  });

  it('should derive one day, one week and one month values consistently', () => {
    expect(oneDay).toBe(24 * oneHour);
    expect(oneWeek).toBe(7 * oneDay);
    expect(oneMonth).toBe(2_629_746_000);
  });
});
