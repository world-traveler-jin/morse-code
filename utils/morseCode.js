// Digits and punctuation are shared across all Morse code variants (ITU standard)
const DIGITS = {
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
};

const PUNCTUATION = {
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.',
};

const SHARED = { ...DIGITS, ...PUNCTUATION };

const LATIN_LETTERS = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
};

const RUSSIAN_LETTERS = {
  А: '.-', Б: '-...', В: '.--', Г: '--.', Д: '-..', Е: '.',
  Ж: '...-', З: '--..', И: '..', Й: '.---', К: '-.-', Л: '.-..',
  М: '--', Н: '-.', О: '---', П: '.--.', Р: '.-.', С: '...',
  Т: '-', У: '..-', Ф: '..-.', Х: '....', Ц: '-.-.', Ч: '---.',
  Ш: '----', Щ: '--.-', Ъ: '--.--', Ы: '-.--', Ь: '-..-',
  Э: '..-..', Ю: '..--', Я: '.-.-',
};

const GREEK_LETTERS = {
  Α: '.-', Β: '-...', Γ: '--.', Δ: '-..', Ε: '.', Ζ: '--..',
  Η: '....', Θ: '-.-.', Ι: '..', Κ: '-.-', Λ: '.-..', Μ: '--',
  Ν: '-.', Ξ: '-..-', Ο: '---', Π: '.--.', Ρ: '.-.', Σ: '...',
  Τ: '-', Υ: '-.--', Φ: '..-.', Χ: '----', Ψ: '--.-', Ω: '.--',
};

const HEBREW_LETTERS = {
  א: '.-', ב: '-...', ג: '--.', ד: '-..', ה: '---', ו: '.',
  ז: '--..', ח: '....', ט: '..-', י: '..', כ: '-.-', ל: '.-..',
  מ: '--', נ: '-.', ס: '-.-.', ע: '.---', פ: '.--.', צ: '.--',
  ק: '--.-', ר: '.-.', ש: '...', ת: '-',
  // Final (sofit) forms are typographic variants of the same letter/phoneme,
  // so they share their base letter's code.
  ך: '-.-', ם: '--', ן: '-.', ף: '.--.', ץ: '.--',
};

// Japanese Wabun code (katakana). Includes dakuten/handakuten marks and a few
// punctuation marks unique to Wabun (distinct from the shared ITU punctuation above).
const JAPANESE_KANA = {
  ア: '--.--', イ: '.-', ウ: '..-', エ: '-.---', オ: '.-...',
  カ: '.-..', キ: '-.-..', ク: '...-', ケ: '-.--', コ: '----',
  サ: '-.-.-', シ: '--.-.', ス: '---.-', セ: '.---.', ソ: '---.',
  タ: '-.', チ: '..-.', ツ: '.--.', テ: '.-.--', ト: '..-..',
  ナ: '.-.', ニ: '-.-.', ヌ: '....', ネ: '--.-', ノ: '..--',
  ハ: '-...', ヒ: '--..-', フ: '--..', ヘ: '.', ホ: '-..',
  マ: '-..-', ミ: '..-.-', ム: '-', メ: '-...-', モ: '-..-.',
  ヤ: '.--', ユ: '-..--', ヨ: '--',
  ラ: '...', リ: '--.', ル: '-.--.', レ: '---', ロ: '.-.-',
  ワ: '-.-', ヰ: '.-..-', ヱ: '.--..', ヲ: '.---',
  ン: '.-.-.',
  '゛': '..', '゜': '..--.',
  '。': '.-.-..', 'ー': '.--.-', '、': '.-.-.-', '（': '-.--.-', '）': '.-..-.',
};

const KOREAN_JAMO = {
  ㄱ: '.-..', ㄴ: '..-.', ㄷ: '-...', ㄹ: '...-', ㅁ: '--',
  ㅂ: '.--', ㅅ: '--.', ㅇ: '-.-', ㅈ: '.--.', ㅊ: '-.-.',
  ㅋ: '-..-', ㅌ: '--..', ㅍ: '---', ㅎ: '.---',
  ㅏ: '.', ㅑ: '..', ㅓ: '-', ㅕ: '...', ㅗ: '.-',
  ㅛ: '-.', ㅜ: '....', ㅠ: '.-.', ㅡ: '-..', ㅣ: '..-',
  ㅐ: '--.-', ㅔ: '-.--',
};

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const HANGUL_INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const HANGUL_MEDIALS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const HANGUL_FINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// Decomposes precomposed Hangul syllable blocks (e.g. "안") into individual jamo
// (e.g. "ㅇㅏㄴ") so each can be looked up in the SKATS table. Compound jamo not
// in KOREAN_JAMO (tense consonants, diphthong vowels, batchim clusters) are left
// as-is and simply won't match any code, same as any other unsupported character.
function decomposeHangul(text) {
  let result = '';
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
      const offset = code - HANGUL_BASE;
      const initial = HANGUL_INITIALS[Math.floor(offset / (21 * 28))];
      const medial = HANGUL_MEDIALS[Math.floor((offset % (21 * 28)) / 28)];
      const final = HANGUL_FINALS[offset % 28];
      result += initial + medial + final;
    } else {
      result += char;
    }
  }
  return result;
}

// Strips combining diacritical marks (U+0300-U+036F) after NFD decomposition,
// so accented Greek vowels (e.g. ά) match their unaccented Morse entry (Α).
function stripGreekDiacritics(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}

// Hiragana (U+3041-U+3096) to Katakana (U+30A1-U+30F6) is a fixed +0x60 offset.
function hiraganaToKatakana(text) {
  return text.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

export const LANGUAGES = {
  international: {
    id: 'international',
    label: 'International (Latin)',
    sample: 'HELLO WORLD',
    letters: LATIN_LETTERS,
    preprocess: (text) => text.toUpperCase(),
  },
  korean: {
    id: 'korean',
    label: '한국어 (SKATS)',
    sample: '모스부호',
    letters: KOREAN_JAMO,
    preprocess: (text) => decomposeHangul(text),
  },
  russian: {
    id: 'russian',
    label: 'Русский',
    sample: 'ПРИВЕТ',
    letters: RUSSIAN_LETTERS,
    preprocess: (text) => text.toUpperCase(),
  },
  greek: {
    id: 'greek',
    label: 'Ελληνικά',
    sample: 'ΓΕΙΑ ΣΑΣ',
    letters: GREEK_LETTERS,
    preprocess: (text) => stripGreekDiacritics(text.toUpperCase()),
  },
  hebrew: {
    id: 'hebrew',
    label: 'עברית',
    sample: 'שלום',
    letters: HEBREW_LETTERS,
    preprocess: (text) => text,
  },
  japanese: {
    id: 'japanese',
    label: '日本語 (和文)',
    sample: 'モールス',
    letters: JAPANESE_KANA,
    preprocess: (text) => hiraganaToKatakana(text),
  },
};

export function getLanguage(languageId) {
  return LANGUAGES[languageId] || LANGUAGES.international;
}

export function getMorseMap(languageId) {
  return { ...SHARED, ...getLanguage(languageId).letters };
}

// Inverse lookup (code -> character) for decoding, e.g. a tapped-out key.
export function getReverseMorseMap(languageId) {
  const map = getMorseMap(languageId);
  const reverse = {};
  for (const [char, code] of Object.entries(map)) {
    reverse[code] = char;
  }
  return reverse;
}

// Backward-compatible alias: the full International (Latin) lookup table.
export const MORSE_CODE_MAP = getMorseMap('international');

// Converts text to a displayable Morse string ("word / word" form, unsupported characters are skipped)
export function textToMorse(text, languageId = 'international') {
  const lang = getLanguage(languageId);
  const map = getMorseMap(languageId);
  const processed = lang.preprocess(text);
  const words = processed.trim().split(/\s+/).filter(Boolean);

  return words
    .map((word) =>
      [...word]
        .map((char) => map[char])
        .filter(Boolean)
        .join(' ')
    )
    .filter(Boolean)
    .join(' / ');
}

// Builds a list of audio segments for playback.
// tone: true means sound (dot/dash), false means silence (gap). units is a multiple of one time unit.
export function textToMorseSegments(text, languageId = 'international') {
  const lang = getLanguage(languageId);
  const map = getMorseMap(languageId);
  const processed = lang.preprocess(text);
  const words = processed.trim().split(/\s+/).filter(Boolean);
  const segments = [];

  words.forEach((word, wordIndex) => {
    const letters = [...word].filter((char) => map[char]);

    letters.forEach((char, letterIndex) => {
      const code = map[char];
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
