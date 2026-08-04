import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { textToMorse, textToMorseSegments } from '../utils/morseCode';

export default function MorsePage() {
  const [inputText, setInputText] = useState('SOS');
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const stopTimeoutRef = useRef(null);

  const morseOutput = textToMorse(inputText);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
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

  const stopPlayback = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // 이미 정지된 오실레이터는 무시
      }
    });
    oscillatorsRef.current = [];
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    setIsPlaying(false);
  };

  const playMorse = () => {
    const segments = textToMorseSegments(inputText);
    if (segments.length === 0) return;

    stopPlayback();

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const unit = 1.2 / wpm; // 초 단위 (dit 길이 = 1200ms / WPM)
    const startPadding = 0.05;
    let cursor = ctx.currentTime + startPadding;
    const newOscillators = [];

    segments.forEach((segment) => {
      const duration = segment.units * unit;
      if (segment.tone) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const rampTime = Math.min(0.005, duration / 4);

        osc.type = 'sine';
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(0, cursor);
        gain.gain.linearRampToValueAtTime(0.3, cursor + rampTime);
        gain.gain.setValueAtTime(0.3, cursor + duration - rampTime);
        gain.gain.linearRampToValueAtTime(0, cursor + duration);

        osc.connect(gain).connect(ctx.destination);
        osc.start(cursor);
        osc.stop(cursor + duration);
        newOscillators.push(osc);
      }
      cursor += duration;
    });

    oscillatorsRef.current = newOscillators;
    setIsPlaying(true);

    const totalMs = (cursor - ctx.currentTime) * 1000;
    stopTimeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
      oscillatorsRef.current = [];
    }, totalMs);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (isPlaying) stopPlayback();
  };

  const handleCopy = async () => {
    if (!morseOutput) return;
    try {
      await navigator.clipboard.writeText(morseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // 클립보드 접근 실패 시 무시
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-yellow-50 to-white dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-500">
      <Head>
        <title>모스부호 변환기 | Traveler Map</title>
      </Head>

      <header className="w-full px-4 py-3 flex justify-between items-center shadow-md bg-white/80 dark:bg-blue-950 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:scale-105">
            ← Traveler Map
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-300 tracking-tight">모스부호 변환기</h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:scale-105"
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center px-4 py-8 gap-6">
        <div className="w-full max-w-2xl flex flex-col gap-2">
          <label htmlFor="morse-input" className="text-sm font-medium text-gray-600 dark:text-gray-300">
            변환할 텍스트를 입력하세요
          </label>
          <textarea
            id="morse-input"
            value={inputText}
            onChange={handleInputChange}
            rows={3}
            placeholder="예: HELLO WORLD"
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">모스부호 결과</span>
            <button
              onClick={handleCopy}
              disabled={!morseOutput}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 transition"
            >
              {copied ? '복사됨! ✅' : '복사'}
            </button>
          </div>
          <div className="min-h-[4rem] w-full p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-mono text-lg break-all">
            {morseOutput || <span className="text-gray-400 dark:text-gray-500">지원하는 문자를 입력하면 여기에 모스부호가 표시됩니다.</span>}
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 sm:gap-8 items-stretch sm:items-center bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <label className="flex-1 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
            속도 (WPM: {wpm})
            <input
              type="range"
              min="5"
              max="40"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="accent-blue-500"
            />
          </label>
          <label className="flex-1 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
            음 높이 ({frequency} Hz)
            <input
              type="range"
              min="300"
              max="1000"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="accent-blue-500"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={playMorse}
            disabled={!morseOutput || isPlaying}
            className="px-6 py-2.5 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-blue-500 transition-transform transform hover:scale-105"
          >
            {isPlaying ? '🔊 재생 중...' : '▶️ 재생'}
          </button>
          <button
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="px-6 py-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 transition-transform transform hover:scale-105"
          >
            ⏹️ 정지
          </button>
        </div>
      </main>

      <footer className="w-full px-4 py-4 text-center text-xs bg-sky-100 dark:bg-blue-950 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © 2025 Traveler Map. Morse Code Converter.
      </footer>
    </div>
  );
}
