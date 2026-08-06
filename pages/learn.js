import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, getMorseMap, textToMorse } from '../utils/morseCode';
import { playMorseLive } from '../utils/morseAudio';
import MorseVisual from '../components/MorseVisual';
import Seo from '../components/Seo';

const PAGE_DESCRIPTION =
  'Learn Morse code with an interactive reference for every letter, number, and punctuation mark in International, Russian, Greek, Hebrew, Japanese, and Korean Morse code. Tap any character to hear its signal.';

const FAQ = [
  {
    question: 'What is Morse code?',
    answer:
      'Morse code encodes text as sequences of two signal durations — short "dots" and long "dashes" — one sequence per letter, number, and punctuation mark. It was developed in the 1830s–40s for the electrical telegraph.',
  },
  {
    question: 'Who invented Morse code?',
    answer:
      'It\'s named after Samuel Morse, who developed it with Alfred Vail in the 1830s for use with the electric telegraph.',
  },
  {
    question: 'What does SOS mean in Morse code?',
    answer:
      'SOS is three dots, three dashes, three dots (··· −−− ···). It doesn\'t stand for specific words — it was chosen as an international distress signal because the pattern is simple and hard to misread.',
  },
  {
    question: 'Is Morse code still used today?',
    answer:
      'Yes. Amateur (ham) radio operators still use it, aircraft navigation beacons identify themselves with it, and some maritime and emergency services keep it as a backup communication method.',
  },
  {
    question: 'Does Morse code work for languages other than English?',
    answer:
      'Yes. International Morse code covers the Latin alphabet, but Russian, Greek, Hebrew, Japanese (Wabun code), and Korean (SKATS) each have their own separate, standardized Morse code system for their own script — pick a language above to see its reference.',
  },
  {
    question: 'How long does it take to learn Morse code?',
    answer:
      'With regular practice, most people learn the full alphabet in a few weeks and build reading speed over a few months. Starting with the most common letters — E, T, A, O, I, N — makes it easier.',
  },
  {
    question: "What's the fastest way to learn Morse code?",
    answer:
      'Listen to it instead of just reading the dots and dashes — your ears pick up the rhythm faster than your eyes learn the pattern. Tap through each character on this page to hear it repeatedly.',
  },
];

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const LATIN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');
const PUNCTUATION = ['.', ',', '?', "'", '!', '/', '(', ')', '&', ':', ';', '=', '+', '-', '_', '"', '$', '@'];

function getSections(languageId) {
  if (languageId === 'international') {
    return [
      { title: 'Letters', chars: LATIN_LETTERS },
      { title: 'Numbers', chars: NUMBERS },
      { title: 'Punctuation', chars: PUNCTUATION },
    ];
  }
  return [
    { title: 'Characters', chars: Object.keys(LANGUAGES[languageId].letters) },
    { title: 'Numbers', chars: NUMBERS },
  ];
}

function CodeRow({ char, code, onPlay, activeChar }) {
  const isActive = activeChar === char;
  return (
    <button
      onClick={() => onPlay(char)}
      className={`flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-lg border text-left transition ${
        isActive
          ? 'border-emerald-400/60 bg-emerald-400/10'
          : 'border-amber-400/15 bg-[#11161f] hover:border-amber-400/40 hover:bg-amber-400/5'
      }`}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span className="w-8 shrink-0 text-lg font-bold text-amber-300">{char}</span>
        <MorseVisual morse={code} size="sm" />
      </span>
      <span className="shrink-0 text-[11px] text-amber-200/40 tracking-wide">{code}</span>
    </button>
  );
}

function CodeSection({ title, chars, codeMap, onPlay, activeChar }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {chars.map((char) => (
          <CodeRow key={char} char={char} code={codeMap[char]} onPlay={onPlay} activeChar={activeChar} />
        ))}
      </div>
    </div>
  );
}

export default function Learn() {
  const [language, setLanguage] = useState('international');
  const [activeChar, setActiveChar] = useState(null);

  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const stopTimeoutRef = useRef(null);

  const codeMap = getMorseMap(language);
  const sections = getSections(language);
  const sample = LANGUAGES[language].sample;
  const sampleMorse = textToMorse(sample, language);

  useEffect(() => {
    return () => {
      stopAll();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  };

  const stopAll = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // already stopped, ignore
      }
    });
    oscillatorsRef.current = [];
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    setActiveChar(null);
  };

  const handleLanguageChange = (e) => {
    stopAll();
    setLanguage(e.target.value);
  };

  const handlePlay = (char) => {
    stopAll();

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const result = playMorseLive(ctx, char, { wpm: 16, frequency: 600, language });
    if (!result) return;

    oscillatorsRef.current = result.oscillators;
    setActiveChar(char);
    stopTimeoutRef.current = setTimeout(() => {
      setActiveChar(null);
      oscillatorsRef.current = [];
    }, result.durationMs);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo title="Learn Morse Code · MORSE" description={PAGE_DESCRIPTION} path="/learn" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_STRUCTURED_DATA) }}
      />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 w-full px-4 sm:px-6 py-5 flex items-center justify-between border-b border-amber-400/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-amber-400">MORSE</h1>
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">LEARN THE CODE</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-full border border-amber-400/40 text-amber-200 text-sm font-medium tracking-wide hover:bg-amber-400/10 transition-transform transform hover:scale-105"
        >
          ← Back to Converter
        </Link>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 gap-10">
        <div className="w-full max-w-3xl flex flex-col gap-3 bg-[#11161f] border border-amber-400/20 rounded-lg p-5">
          <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">How it works</h2>
          <p className="text-sm text-amber-100/80 leading-relaxed">
            Morse code represents each character as a sequence of short and long signals — a{' '}
            <strong className="text-amber-300">dot</strong> and a <strong className="text-amber-300">dash</strong>.
            A dash lasts three times as long as a dot. Tap any character below to hear it.
          </p>
          <ul className="text-sm text-amber-100/70 leading-relaxed list-disc list-inside space-y-1">
            <li>Gap between dots/dashes in the same letter: 1 unit</li>
            <li>Gap between letters: 3 units</li>
            <li>Gap between words: 7 units</li>
            <li>The most common letters (E, T) get the shortest codes — a single dot or dash</li>
          </ul>
          <div className="flex items-center gap-3 pt-2 border-t border-amber-400/10">
            <span className="text-xs text-amber-200/50 tracking-wide">e.g. {sample}</span>
            <MorseVisual morse={sampleMorse} size="sm" />
          </div>
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-2">
          <label htmlFor="learn-language" className="text-xs tracking-widest text-amber-200/60 uppercase">
            Language
          </label>
          <select
            id="learn-language"
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-3 rounded-lg bg-[#11161f] border border-amber-400/20 text-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-400/60 focus:border-amber-400/60 tracking-wide"
          >
            {Object.values(LANGUAGES).map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-10">
          {sections.map((section) => (
            <CodeSection
              key={section.title}
              title={section.title}
              chars={section.chars}
              codeMap={codeMap}
              onPlay={handlePlay}
              activeChar={activeChar}
            />
          ))}
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">Frequently asked questions</h2>
          <div className="flex flex-col gap-2">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg bg-[#11161f] border border-amber-400/15 px-4 py-3 open:border-amber-400/40"
              >
                <summary className="cursor-pointer text-sm font-medium text-amber-200 list-none flex items-center justify-between gap-3">
                  {item.question}
                  <span className="text-amber-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-amber-100/70 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 text-[#0a0e14] font-semibold tracking-wide hover:bg-amber-300 transition-transform transform hover:scale-105"
        >
          Try the Converter →
        </Link>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-2 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-amber-300 transition">
            Converter
          </Link>
          <Link href="/practice" className="hover:text-amber-300 transition">
            Practice Key
          </Link>
          <Link href="/privacy" className="hover:text-amber-300 transition">
            Privacy Policy
          </Link>
        </div>
        <span>Morse Code Converter</span>
        <span>· - · · = SOS</span>
      </footer>
    </div>
  );
}
