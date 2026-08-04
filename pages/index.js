import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { textToMorse } from '../utils/morseCode';
import { playMorseLive, renderMorseWavBlob } from '../utils/morseAudio';

function MorseVisual({ morse }) {
  if (!morse) return null;
  const tokens = morse.split(' ');

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
      {tokens.map((token, i) =>
        token === '/' ? (
          <span key={i} className="w-3 sm:w-5" aria-hidden="true" />
        ) : (
          <span key={i} className="flex items-center gap-1.5">
            {[...token].map((symbol, j) => (
              <span
                key={j}
                className={
                  symbol === '.'
                    ? 'inline-block h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                    : 'inline-block h-3 w-8 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                }
              />
            ))}
          </span>
        )
      )}
    </div>
  );
}

export default function Home() {
  const [inputText, setInputText] = useState('SOS');
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const stopTimeoutRef = useRef(null);

  const morseOutput = textToMorse(inputText);

  useEffect(() => {
    return () => {
      stopPlayback();
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
    if (!morseOutput) return;
    stopPlayback();

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const result = playMorseLive(ctx, inputText, { wpm, frequency });
    if (!result) return;

    oscillatorsRef.current = result.oscillators;
    setIsPlaying(true);
    stopTimeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
      oscillatorsRef.current = [];
    }, result.durationMs);
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

  const handleDownload = async () => {
    if (!morseOutput || isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await renderMorseWavBlob(inputText, { wpm, frequency });
      if (!blob) return;

      const safeName =
        inputText.trim().slice(0, 24).replace(/[^a-zA-Z0-9가-힣]+/g, '_').replace(/^_+|_+$/g, '') || 'morse';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeName}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Head>
        <title>MORSE · 모스부호 변환기</title>
      </Head>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 w-full px-4 sm:px-6 py-5 flex items-center justify-between border-b border-amber-400/20">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.9)]' : 'bg-amber-400/30'}`}
            aria-hidden="true"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-amber-400">MORSE</h1>
            <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">텍스트 · 모스부호 · 오디오</p>
          </div>
        </div>
        <span className="text-[11px] sm:text-xs text-amber-200/40 tracking-widest uppercase">
          {isPlaying ? 'On Air' : 'Standby'}
        </span>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 gap-8">
        <div className="w-full max-w-2xl flex flex-col gap-2">
          <label htmlFor="morse-input" className="text-xs tracking-widest text-amber-200/60 uppercase">
            Message
          </label>
          <textarea
            id="morse-input"
            value={inputText}
            onChange={handleInputChange}
            rows={3}
            placeholder="예: HELLO WORLD"
            className="w-full p-4 rounded-lg bg-[#11161f] border border-amber-400/20 text-amber-50 placeholder:text-amber-100/20 focus:outline-none focus:ring-1 focus:ring-amber-400/60 focus:border-amber-400/60 resize-none tracking-wide"
          />
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-widest text-amber-200/60 uppercase">Signal</span>
            <button
              onClick={handleCopy}
              disabled={!morseOutput}
              className="text-[11px] tracking-wide px-2.5 py-1 rounded border border-amber-400/30 text-amber-200/80 hover:bg-amber-400/10 disabled:opacity-30 transition"
            >
              {copied ? '복사됨 ✓' : 'Copy'}
            </button>
          </div>

          <div className="rounded-lg bg-[#11161f] border border-amber-400/20 p-4 flex flex-col gap-4">
            <MorseVisual morse={morseOutput} />
            <div className="min-h-[1.5rem] font-mono text-sm sm:text-base text-amber-300/90 break-all border-t border-amber-400/10 pt-3">
              {morseOutput || <span className="text-amber-100/20">지원하는 문자를 입력하면 신호가 표시됩니다.</span>}
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-6 sm:gap-10 bg-[#11161f] border border-amber-400/20 rounded-lg p-5">
          <label className="flex-1 flex flex-col gap-2 text-xs text-amber-200/60 tracking-widest uppercase">
            Speed · {wpm} WPM
            <input
              type="range"
              min="5"
              max="40"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="accent-amber-400"
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
              className="accent-amber-400"
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={playMorse}
            disabled={!morseOutput || isPlaying}
            className="px-6 py-2.5 rounded-full bg-amber-400 text-[#0a0e14] font-semibold tracking-wide hover:bg-amber-300 disabled:opacity-30 disabled:hover:bg-amber-400 transition-transform transform hover:scale-105"
          >
            {isPlaying ? '● 송신 중' : '▶ 재생'}
          </button>
          <button
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="px-6 py-2.5 rounded-full border border-amber-400/40 text-amber-200 font-medium tracking-wide hover:bg-amber-400/10 disabled:opacity-30 transition-transform transform hover:scale-105"
          >
            ■ 정지
          </button>
          <button
            onClick={handleDownload}
            disabled={!morseOutput || isDownloading}
            className="px-6 py-2.5 rounded-full border border-amber-400/40 text-amber-200 font-medium tracking-wide hover:bg-amber-400/10 disabled:opacity-30 transition-transform transform hover:scale-105"
          >
            {isDownloading ? '변환 중...' : '⬇ WAV 다운로드'}
          </button>
        </div>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-1 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <span>Morse Code Converter</span>
        <span>· - · · = SOS</span>
      </footer>
    </div>
  );
}
