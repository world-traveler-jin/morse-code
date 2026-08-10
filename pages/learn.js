import Link from 'next/link';
import LearnContent, { FAQ_STRUCTURED_DATA } from '../components/LearnContent';
import Seo from '../components/Seo';
import FeatureNav from '../components/FeatureNav';

const PAGE_DESCRIPTION =
  'Learn Morse code with an interactive reference for every letter, number, and punctuation mark in International, Russian, Greek, Hebrew, Japanese, and Korean Morse code. Tap any character to hear its signal.';

export default function Learn() {
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
          <p className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-amber-400">MORSE</p>
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">LEARN THE CODE</p>
        </div>
      </header>

      <FeatureNav current="/learn" />

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 gap-10">
        <LearnContent language="international" heading="Learn Morse Code" />
        <div className="w-full max-w-3xl flex flex-col gap-2 text-sm text-amber-100/60">
          <span className="text-xs tracking-widest text-amber-200/60 uppercase">Dedicated language pages</span>
          <p className="flex flex-wrap gap-x-2 gap-y-1">
            {[
              ['russian', 'Russian'],
              ['greek', 'Greek'],
              ['hebrew', 'Hebrew'],
              ['japanese', 'Japanese (Wabun)'],
              ['korean', 'Korean (SKATS)'],
            ].map(([slug, label], i, arr) => (
              <span key={slug}>
                <Link href={`/learn/${slug}`} className="text-amber-300 underline hover:text-amber-200">
                  {label}
                </Link>
                {i < arr.length - 1 ? ',' : ''}
              </span>
            ))}
          </p>
          <p>
            Curious about where Morse code came from?{' '}
            <Link href="/history" className="text-amber-300 underline hover:text-amber-200">
              Read its history
            </Link>
            .
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-2 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <div className="flex items-center gap-4">
          <Link href="/history" className="hover:text-amber-300 transition">
            History
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
