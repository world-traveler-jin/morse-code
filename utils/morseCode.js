// 국제 모스부호(International Morse Code) 매핑 테이블
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

// 화면에 보여줄 모스부호 문자열로 변환 ("단어 / 단어" 형태, 지원하지 않는 문자는 무시)
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

// 오디오 재생을 위한 신호 구간(segment) 목록 생성
// tone: true면 소리(점/선), false면 무음(간격). units는 1 unit 길이의 배수.
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
          segments.push({ tone: false, units: 1 }); // 부호 내 점/선 간격
        }
      });
      if (letterIndex < letters.length - 1) {
        segments.push({ tone: false, units: 3 }); // 글자 간 간격
      }
    });

    if (wordIndex < words.length - 1 && letters.length > 0) {
      segments.push({ tone: false, units: 7 }); // 단어 간 간격
    }
  });

  return segments;
}
