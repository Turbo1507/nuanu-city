// Типограф: короткие слова не висят в конце строки (как у unithotels)
const KEEP = new Set(['где', 'что', 'кто', 'это', 'как', 'де', 'що', 'хто', 'як', 'pas']);
export function glue(s, l) {
  const g = t => t.replace(/(^|[\s>(« ])([\p{L}\d]{1,3})\.? (?=[\p{L}\d(«<])/gu, (m, a, w) => KEEP.has(w.toLowerCase()) ? m : m.slice(0, -1) + ' ');
  s = g(g(s));
  s = s.replace(/(\d) (%|лет|років|years|ans|años|anni|jaar|yıl)/g, '$1 $2');
  // id: длинные предлоги клеим к следующему слову, «ini» к предыдущему; tr: послелоги «için», «ile» к предыдущему
  if (l === 'id') s = s.replace(/(^|[\s>(])(yang|dari|untuk) (?=[\p{L}\d<])/giu, '$1$2\u00a0').replace(/ (ini)(?=[\s,.:;]|$)/g, '\u00a0$1');
  if (l === 'tr') s = s.replace(/ (için|ile)(?=[\s,.:;]|$)/g, '\u00a0$1');
  if (l === 'fr') s = s.replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« ');
  return s;
}
