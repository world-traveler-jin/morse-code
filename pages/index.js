import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { textToMorse, LANGUAGES } from '../utils/morseCode';
import { playMorseLive, renderMorseWavBlob } from '../utils/morseAudio';
import MorseVisual from '../components/MorseVisual';
import Seo, { SITE_URL } from '../components/Seo';
import FeatureNav from '../components/FeatureNav';

const PAGE_DESCRIPTION =
  'Convert text to Morse code instantly, hear it played back as audio, and download the signal as a WAV file. Free online Morse code translator supporting International, Russian, Greek, Hebrew, Japanese, and Korean.';

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Morse Code Converter',
  url: SITE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function Home() {
  const [language, setLanguage] = useState('international');
  const [inputText, setInputText] = useState('SOS');
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const stopTimeoutRef = useRef(null);

  const morseOutput = textToMorse(inputText, language);

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
        // already stopped, ignore
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

    const result = playMorseLive(ctx, inputText, { wpm, frequency, language });
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

  const handleLanguageChange = (e) => {
    const nextLanguage = e.target.value;
    setLanguage(nextLanguage);
    setInputText(LANGUAGES[nextLanguage].sample);
    if (isPlaying) stopPlayback();
  };

  const handleCopy = async () => {
    if (!morseOutput) return;
    try {
      await navigator.clipboard.writeText(morseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // clipboard access denied, ignore
    }
  };

  const handleDownload = async () => {
    if (!morseOutput || isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await renderMorseWavBlob(inputText, { wpm, frequency, language });
      if (!blob) return;

      const safeName =
        inputText.trim().slice(0, 24).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'morse';
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
      <Seo title="MORSE · Text to Morse Code Converter" description={PAGE_DESCRIPTION} path="/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

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
            <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">TEXT · MORSE CODE · AUDIO</p>
          </div>
        </div>
        <span className="text-[11px] sm:text-xs text-amber-200/40 tracking-widest uppercase">
          {isPlaying ? 'On Air' : 'Standby'}
        </span>
      </header>

      <FeatureNav current="/" />

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 gap-8">
        <div className="w-full max-w-2xl flex flex-col gap-2">
          <label htmlFor="morse-language" className="text-xs tracking-widest text-amber-200/60 uppercase">
            Language
          </label>
          <select
            id="morse-language"
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

        <div className="w-full max-w-2xl flex flex-col gap-2">
          <label htmlFor="morse-input" className="text-xs tracking-widest text-amber-200/60 uppercase">
            Message
          </label>
          <textarea
            id="morse-input"
            value={inputText}
            onChange={handleInputChange}
            rows={3}
            placeholder={`e.g. ${LANGUAGES[language].sample}`}
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
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="rounded-lg bg-[#11161f] border border-amber-400/20 p-4 flex flex-col gap-4">
            <MorseVisual morse={morseOutput} />
            <div className="min-h-[1.5rem] font-mono text-sm sm:text-base text-amber-300/90 break-all border-t border-amber-400/10 pt-3">
              {morseOutput || <span className="text-amber-100/20">Type a supported character to see the signal.</span>}
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
            {isPlaying ? '● Transmitting' : '▶ Play'}
          </button>
          <button
            onClick={stopPlayback}
            disabled={!isPlaying}
            className="px-6 py-2.5 rounded-full border border-amber-400/40 text-amber-200 font-medium tracking-wide hover:bg-amber-400/10 disabled:opacity-30 transition-transform transform hover:scale-105"
          >
            ■ Stop
          </button>
          <button
            onClick={handleDownload}
            disabled={!morseOutput || isDownloading}
            className="px-6 py-2.5 rounded-full border border-amber-400/40 text-amber-200 font-medium tracking-wide hover:bg-amber-400/10 disabled:opacity-30 transition-transform transform hover:scale-105"
          >
            {isDownloading ? 'Rendering...' : '⬇ Download WAV'}
          </button>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-2 text-sm text-amber-100/60 leading-relaxed border-t border-amber-400/10 pt-6">
          <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">About this tool</h2>
          <p>
            Morse code represents letters, numbers, and punctuation as sequences of dots and dashes, originally
            designed for telegraph transmission. This converter turns any text into Morse code in real time, plays
            it back as audio through your browser, and lets you download the signal as a WAV file. Besides
            International (Latin) Morse code, it also supports Russian, Greek, Hebrew, Japanese Wabun code, and
            Korean SKATS — pick a language above to switch. New to Morse code? Visit the{' '}
            <Link href="/learn" className="text-amber-300 underline hover:text-amber-200">
              Learn page
            </Link>{' '}
            for a full interactive reference, try the{' '}
            <Link href="/practice" className="text-amber-300 underline hover:text-amber-200">
              Practice Key
            </Link>{' '}
            to send Morse code yourself, or open{' '}
            <Link href="/chat" className="text-amber-300 underline hover:text-amber-200">
              Live Chat
            </Link>{' '}
            to talk to someone else entirely in Morse code.
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
        <span>· - · · = SOS</span>
      </footer>
    </div>
  );
}
