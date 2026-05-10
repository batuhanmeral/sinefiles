// Çok basit küfür/argo filtresi. Üretim için harici bir liste/servisle değiştirilebilir.
const BANNED = [
  'orospu', 'piç', 'amk', 'sik', 'siktir', 'göt', 'oç',
  'fuck', 'shit', 'bitch', 'asshole', 'cunt',
];

const pattern = new RegExp(`\\b(${BANNED.join('|')})\\b`, 'i');

export function containsProfanity(text: string | null | undefined): boolean {
  if (!text) return false;
  return pattern.test(text);
}
