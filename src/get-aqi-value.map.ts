export const aqiValueMap = {
  0: { title: '🟩 отличное', emoji: '🤩' },
  51: { title: '🟨 среднее', emoji: '😕' },
  101: { title: '🟧 вредное для чувствительных групп людей', emoji: '🫨' },
  151: { title: '🟥 вредное для любых групп людей', emoji: '😷' },
  201: { title: '🟪 очень вредное', emoji: '💩' },
  251: { title: '⬛️ пиздец', emoji: '👹' },
};

type AqiInfo = {
  title: string;
  emoji: string;
};

export function getAqiInfo(aqi: number): AqiInfo {
  const keys = Object.keys(aqiValueMap)
    .map(Number)
    .sort((a, b) => b - a);
  for (const key of keys) {
    if (aqi >= key) {
      return aqiValueMap[key];
    }
  }
  return aqiValueMap[keys[keys.length - 1]];
}
