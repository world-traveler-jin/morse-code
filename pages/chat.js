import Link from 'next/link';
import Seo from '../components/Seo';
import FeatureNav from '../components/FeatureNav';

const PAGE_DESCRIPTION = 'Live Chat is temporarily unavailable.';

export default function ChatUnavailable() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo title="Live Chat Unavailable · MORSE" description={PAGE_DESCRIPTION} path="/chat" />

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
          <p className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-amber-400">MORSE</p>
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">LIVE CHAT</p>
        </div>
      </header>

      <FeatureNav current="/chat" />

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-10 gap-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wide">Live Chat is currently unavailable</h1>
        <p className="max-w-md text-sm text-amber-100/70 leading-relaxed">
          This feature is temporarily turned off while we review it. In the meantime, try the{' '}
          <Link href="/practice" className="text-amber-300 underline hover:text-amber-200">
            Practice Key
          </Link>{' '}
          to send Morse code yourself, or the{' '}
          <Link href="/" className="text-amber-300 underline hover:text-amber-200">
            converter
          </Link>
          .
        </p>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-2 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <div className="flex items-center gap-4">
          <Link href="/history" className="hover:text-amber-300 transition">
            History
          </Link>
          <Link href="/terms" className="hover:text-amber-300 transition">
            Terms of Service
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
