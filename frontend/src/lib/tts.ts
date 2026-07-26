/**
 * Text-to-Speech utility for German pronunciation using Web Speech API.
 */

export function speakGermanText(text: string, rate: number = 0.9): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Clean prompt text (strip Markdown or helper instructions if present)
  const cleanText = text
    .replace(/^Translate:?\s*/i, '')
    .replace(/^Fill in the blank:?\s*/i, '')
    .replace(/['"']/g, '')
    .replace(/___/g, '')
    .trim();

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'de-DE';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Try finding a native German voice if available
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(
    (v) => v.lang.startsWith('de') || v.name.toLowerCase().includes('german')
  );
  if (germanVoice) {
    utterance.voice = germanVoice;
  }

  window.speechSynthesis.speak(utterance);
}
