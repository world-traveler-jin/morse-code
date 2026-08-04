import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MORSE_CODE_MAP } from '../utils/morseCode';
import { playMorseLive } from '../utils/morseAudio';
import MorseVisual from '../components/MorseVisual';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');
const PUNCTUATION = ['.', ',', '?', "'", '!', '/', '(', ')', '&', ':', ';', '=', '+', '-', '_', '"', '$', '@'];

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
        <span className="w-6 shrink-0 text-lg font-bold text-amber-300">{char}</span>
        <MorseVisual morse={code} size="sm" />
      </span>
      <span className="shrink-0 text-[11px] text-amber-200/40 tracking-wide">{code}</span>
    </button>
  );
}

function CodeSection({ title, chars, onPlay, activeChar }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {chars.map((char) => (
          <CodeRow key={char} char={char} code={MORSE_CODE_MAP[char]} onPlay={onPlay} activeChar={activeChar} />
        ))}
      </div>
    </div>
  );
}

export default function Learn() {
  const [activeChar, setActiveChar] = useState(null);

  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const stopTimeoutRef = useRef(null);

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

  const handlePlay = (char) => {
    stopAll();

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const result = playMorseLive(ctx, char, { wpm: 16, frequency: 600 });
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
      <Head>
        <title>Learn Morse Code · MORSE</title>
      </Head>

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
            <span className="text-xs text-amber-200/50 tracking-wide">e.g. SOS</span>
            <MorseVisual morse="... --- ..." size="sm" />
          </div>
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-10">
          <CodeSection title="Letters" chars={LETTERS} onPlay={handlePlay} activeChar={activeChar} />
          <CodeSection title="Numbers" chars={NUMBERS} onPlay={handlePlay} activeChar={activeChar} />
          <CodeSection title="Punctuation" chars={PUNCTUATION} onPlay={handlePlay} activeChar={activeChar} />
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 text-[#0a0e14] font-semibold tracking-wide hover:bg-amber-300 transition-transform transform hover:scale-105"
        >
          Try the Converter →
        </Link>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-1 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <span>Morse Code Converter</span>
        <span>· - · · = SOS</span>
      </footer>
    </div>
  );
}
