import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LANGUAGES } from '../utils/morseCode';
import { useMorseKey } from '../hooks/useMorseKey';
import MorseVisual from '../components/MorseVisual';
import Seo from '../components/Seo';
import FeatureNav from '../components/FeatureNav';

const PAGE_DESCRIPTION =
  'Practice sending Morse code yourself with a virtual telegraph key. Tap or hold the spacebar to send dots and dashes, decoded live into text.';

export default function Practice() {
  const [language, setLanguage] = useState('international');
  const [wpm, setWpm] = useState(15);
  const [frequency, setFrequency] = useState(600);

  const { isPressed, currentSymbols, buffer, pressStart, pressEnd, clearBuffer } = useMorseKey({
    language,
    wpm,
    frequency,
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        pressStart();
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        pressEnd();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [pressStart, pressEnd]);

  const handleLanguageChange = (e) => {
    clearBuffer();
    setLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo title="Practice Key · MORSE" description={PAGE_DESCRIPTION} path="/practice" />

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
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">PRACTICE KEY</p>
        </div>
      </header>

      <FeatureNav current="/practice" />

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 gap-8">
        <div className="w-full max-w-2xl flex flex-col gap-2 text-sm text-amber-100/70 leading-relaxed bg-[#11161f] border border-amber-400/20 rounded-lg p-5">
          <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">How to use</h2>
          <p>
            Press and hold the key (or the spacebar) to send a signal. A short tap sends a{' '}
            <strong className="text-amber-300">dot</strong>, holding it longer sends a{' '}
            <strong className="text-amber-300">dash</strong>. Pause briefly to finish a letter, pause longer to
            start a new word.
          </p>
        </div>

        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4">
          <label className="flex-1 flex flex-col gap-2 text-xs text-amber-200/60 tracking-widest uppercase">
            Language
            <select
              value={language}
              onChange={handleLanguageChange}
              className="p-3 rounded-lg bg-[#11161f] border border-amber-400/20 text-amber-50 normal-case tracking-wide focus:outline-none focus:ring-1 focus:ring-amber-400/60"
            >
              {Object.values(LANGUAGES).map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 flex flex-col gap-2 text-xs text-amber-200/60 tracking-widest uppercase">
            Speed · {wpm} WPM
            <input
              type="range"
              min="5"
              max="30"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="accent-amber-400 mt-3"
            />
          </label>
          <label className="flex-1 flex flex-col gap-2 text-xs text-amber-200/60 tracking-widest uppercase">
            Tone · {frequency} Hz
            <input
              type="range"
              min="300"
              max="1000"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="accent-amber-400 mt-3"
            />
          </label>
        </div>

        <button
          onMouseDown={pressStart}
          onMouseUp={pressEnd}
          onMouseLeave={pressEnd}
          onTouchStart={(e) => {
            e.preventDefault();
            pressStart();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            pressEnd();
          }}
          className={`w-full max-w-md h-32 rounded-2xl border-2 font-bold tracking-widest uppercase text-lg select-none transition-colors ${
            isPressed
              ? 'bg-amber-400 border-amber-300 text-[#0a0e14] shadow-[0_0_40px_rgba(251,191,36,0.6)]'
              : 'bg-[#11161f] border-amber-400/30 text-amber-300 hover:border-amber-400/60'
          }`}
        >
          {isPressed ? '● Sending' : 'Press & Hold (or Space)'}
        </button>

        <div className="w-full max-w-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-widest text-amber-200/60 uppercase">Current letter</span>
            <button
              onClick={clearBuffer}
              className="text-[11px] tracking-wide px-2.5 py-1 rounded border border-amber-400/30 text-amber-200/80 hover:bg-amber-400/10 transition"
            >
              Clear
            </button>
          </div>
          <div className="min-h-[3.5rem] rounded-lg bg-[#11161f] border border-amber-400/20 p-4 flex items-center">
            {currentSymbols ? (
              <MorseVisual morse={currentSymbols} />
            ) : (
              <span className="text-amber-100/20 text-sm">Waiting for input…</span>
            )}
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-3">
          <span className="text-xs tracking-widest text-amber-200/60 uppercase">Decoded text</span>
          <div className="min-h-[4rem] rounded-lg bg-[#11161f] border border-amber-400/20 p-4 text-lg tracking-wide break-all">
            {buffer || <span className="text-amber-100/20 text-sm">Your decoded message will appear here.</span>}
          </div>
          <p className="text-[11px] text-amber-200/40">
            A <span className="text-amber-300">□</span> means the pattern didn&apos;t match any character in this
            language.
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-2 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-amber-300 transition">
            Privacy Policy
          </Link>
        </div>
        <span>Morse Code Converter</span>
      </footer>
    </div>
  );
}
