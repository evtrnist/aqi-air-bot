import { aqiValueMap, getAqiInfo } from './get-aqi-value.map';

describe('getAqiInfo', () => {
  test('returns correct info for AQI 0 (отличное)', () => {
    expect(getAqiInfo(0)).toEqual(aqiValueMap['0']);
  });

  test('returns correct info for AQI 50 (still отличное)', () => {
    expect(getAqiInfo(50)).toEqual(aqiValueMap['0']);
  });

  test('returns correct info for AQI 51 (среднее)', () => {
    expect(getAqiInfo(51)).toEqual(aqiValueMap['51']);
  });

  test('returns correct info for AQI 51 (среднее)', () => {
    expect(getAqiInfo(61)).toEqual(aqiValueMap['51']);
  });

  test('returns correct info for AQI 101 (вредное для чувствительных групп людей)', () => {
    expect(getAqiInfo(101)).toEqual(aqiValueMap['101']);
  });

  test('returns correct info for AQI 101 (вредное для чувствительных групп людей)', () => {
    expect(getAqiInfo(131)).toEqual(aqiValueMap['101']);
  });

  test('returns correct info for AQI 151 (вредное для любых групп людей)', () => {
    expect(getAqiInfo(151)).toEqual(aqiValueMap['151']);
  });

  test('returns correct info for AQI 151 (вредное для любых групп людей)', () => {
    expect(getAqiInfo(175)).toEqual(aqiValueMap['151']);
  });

  test('returns correct info for AQI 201 (очень вредное)', () => {
    expect(getAqiInfo(201)).toEqual(aqiValueMap['201']);
  });

  test('returns correct info for AQI 201 (очень вредное)', () => {
    expect(getAqiInfo(222)).toEqual(aqiValueMap['201']);
  });

  test('returns correct info for AQI 251 (пиздец)', () => {
    expect(getAqiInfo(251)).toEqual(aqiValueMap['251']);
  });

  // Корнер кейсы
  test('returns correct info for a very low AQI (negative value)', () => {
    expect(getAqiInfo(-1)).toEqual(aqiValueMap['0']);
  });

  test('returns correct info for a very high AQI', () => {
    expect(getAqiInfo(500)).toEqual(aqiValueMap['251']);
  });
});
