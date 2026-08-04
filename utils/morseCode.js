// International Morse Code lookup table
export const MORSE_CODE_MAP = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.',
};

// Converts text to a displayable Morse string ("word / word" form, unsupported characters are skipped)
export function textToMorse(text) {
  const words = text.trim().toUpperCase().split(/\s+/).filter(Boolean);
  return words
    .map((word) =>
      [...word]
        .map((char) => MORSE_CODE_MAP[char])
        .filter(Boolean)
        .join(' ')
    )
    .filter(Boolean)
    .join(' / ');
}

// Builds a list of audio segments for playback.
// tone: true means sound (dot/dash), false means silence (gap). units is a multiple of one time unit.
export function textToMorseSegments(text) {
  const words = text.trim().toUpperCase().split(/\s+/).filter(Boolean);
  const segments = [];

  words.forEach((word, wordIndex) => {
    const letters = [...word].filter((char) => MORSE_CODE_MAP[char]);

    letters.forEach((char, letterIndex) => {
      const code = MORSE_CODE_MAP[char];
      [...code].forEach((symbol, symbolIndex) => {
        segments.push({ tone: true, units: symbol === '.' ? 1 : 3 });
        if (symbolIndex < code.length - 1) {
          segments.push({ tone: false, units: 1 }); // gap between symbols within a letter
        }
      });
      if (letterIndex < letters.length - 1) {
        segments.push({ tone: false, units: 3 }); // gap between letters
      }
    });

    if (wordIndex < words.length - 1 && letters.length > 0) {
      segments.push({ tone: false, units: 7 }); // gap between words
    }
  });

  return segments;
}
