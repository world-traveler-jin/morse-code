import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LANGUAGES, textToMorse } from '../utils/morseCode';
import { playMorseLive } from '../utils/morseAudio';
import MorseVisual from '../components/MorseVisual';
import Seo from '../components/Seo';

const PAGE_DESCRIPTION =
  'Chat live with another person entirely in Morse code. Share a room link, type a message, and hear it played back as Morse code the moment it arrives.';

const ROOM_CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789'; // no 0/1/l/i/o, avoids visual ambiguity

function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function getWebSocketUrl(roomCode) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/${roomCode}`;
}

export default function Chat() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [language, setLanguage] = useState('international');
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | connecting | waiting | connected | closed | error

  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);

  const roomCode = typeof router.query.room === 'string' ? router.query.room : null;

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  };

  const playMessage = useCallback((text, msgLanguage) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    playMorseLive(ctx, text, { wpm, frequency, language: msgLanguage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpm, frequency]);

  useEffect(() => {
    if (!router.isReady || !roomCode) return;

    setStatus('connecting');
    const ws = new WebSocket(getWebSocketUrl(roomCode));
    wsRef.current = ws;

    ws.addEventListener('open', () => setStatus('waiting'));

    ws.addEventListener('message', (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        return;
      }

      if (data.type === 'presence') {
        setStatus(data.count >= 2 ? 'connected' : 'waiting');
      } else if (data.type === 'text') {
        setMessages((prev) => [...prev, { from: 'peer', text: data.text, language: data.language }]);
        playMessage(data.text, data.language);
      }
    });

    ws.addEventListener('close', () => setStatus('closed'));
    ws.addEventListener('error', () => setStatus('error'));

    return () => {
      ws.close();
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, roomCode]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const handleCreateRoom = () => {
    router.push(`/chat?room=${generateRoomCode()}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const code = joinCode.trim().toLowerCase();
    if (code) router.push(`/chat?room=${code}`);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: 'text', text, language }));
    setMessages((prev) => [...prev, { from: 'me', text, language }]);
    playMessage(text, language);
    setInputText('');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {
      // clipboard access denied, ignore
    }
  };

  const statusLabel = {
    idle: '',
    connecting: 'Connecting…',
    waiting: 'Waiting for the other person to join…',
    connected: '● Connected',
    closed: 'Disconnected',
    error: 'Connection error',
  }[status];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo title="Live Chat · MORSE" description={PAGE_DESCRIPTION} path="/chat" />

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
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">LIVE CHAT</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-full border border-amber-400/40 text-amber-200 text-sm font-medium tracking-wide hover:bg-amber-400/10 transition-transform transform hover:scale-105"
        >
          ← Back to Converter
        </Link>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 gap-6">
        {!roomCode ? (
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-[#11161f] border border-amber-400/20 rounded-lg p-5">
              <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">Start a conversation</h2>
              <p className="text-sm text-amber-100/70 leading-relaxed">
                Create a room and share the link with someone. Whatever either of you types is played and shown as
                Morse code the moment it arrives — nothing else.
              </p>
              <button
                onClick={handleCreateRoom}
                className="px-6 py-2.5 rounded-full bg-amber-400 text-[#0a0e14] font-semibold tracking-wide hover:bg-amber-300 transition-transform transform hover:scale-105"
              >
                Create Room
              </button>
            </div>

            <form onSubmit={handleJoinRoom} className="flex flex-col gap-3 bg-[#11161f] border border-amber-400/20 rounded-lg p-5">
              <h2 className="text-xs tracking-widest text-amber-200/60 uppercase">Have a room code?</h2>
              <div className="flex gap-2">
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. a7k92m"
                  className="flex-1 p-3 rounded-lg bg-[#0a0e14] border border-amber-400/20 text-amber-50 placeholder:text-amber-100/20 focus:outline-none focus:ring-1 focus:ring-amber-400/60"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full border border-amber-400/40 text-amber-200 font-medium tracking-wide hover:bg-amber-400/10 transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-2xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#11161f] border border-amber-400/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    status === 'connected' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]' : 'bg-amber-400/40'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-sm text-amber-200/80">{statusLabel}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="text-[11px] tracking-wide px-2.5 py-1 rounded border border-amber-400/30 text-amber-200/80 hover:bg-amber-400/10 transition"
              >
                Copy Room Link
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 p-2.5 rounded-lg bg-[#11161f] border border-amber-400/20 text-amber-50 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/60"
              >
                {Object.values(LANGUAGES).map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <label className="flex-1 flex items-center gap-2 text-xs text-amber-200/60">
                <span className="whitespace-nowrap">{wpm} WPM</span>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={wpm}
                  onChange={(e) => setWpm(Number(e.target.value))}
                  className="accent-amber-400 w-full"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 min-h-[16rem] max-h-[24rem] overflow-y-auto bg-[#11161f] border border-amber-400/20 rounded-lg p-4">
              {messages.length === 0 ? (
                <span className="text-amber-100/20 text-sm">Messages will appear here.</span>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-amber-200/40 uppercase tracking-wide">
                      {msg.from === 'me' ? 'You' : 'Them'}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 flex flex-col gap-1.5 ${
                        msg.from === 'me' ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-[#0a0e14] border border-amber-400/15'
                      }`}
                    >
                      <MorseVisual morse={textToMorse(msg.text, msg.language)} size="sm" />
                      <span className="text-sm text-amber-100/80">{msg.text}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Type a message…"
                disabled={status !== 'connected' && status !== 'waiting'}
                className="flex-1 p-3 rounded-lg bg-[#11161f] border border-amber-400/20 text-amber-50 placeholder:text-amber-100/20 focus:outline-none focus:ring-1 focus:ring-amber-400/60 disabled:opacity-40"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || (status !== 'connected' && status !== 'waiting')}
                className="px-6 py-2.5 rounded-full bg-amber-400 text-[#0a0e14] font-semibold tracking-wide hover:bg-amber-300 disabled:opacity-30 transition-transform transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>
        )}
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
      </footer>
    </div>
  );
}
