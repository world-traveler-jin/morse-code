import Link from 'next/link';
import Seo from '../components/Seo';

const LAST_UPDATED = 'August 4, 2026';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo
        title="Privacy Policy · MORSE"
        description="Privacy policy for the Morse Code Converter, covering cookies, advertising, and data collection."
        path="/privacy"
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
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">PRIVACY POLICY</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-full border border-amber-400/40 text-amber-200 text-sm font-medium tracking-wide hover:bg-amber-400/10 transition-transform transform hover:scale-105"
        >
          ← Back to Converter
        </Link>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-6 text-sm text-amber-100/80 leading-relaxed">
          <p className="text-xs text-amber-200/50">Last updated: {LAST_UPDATED}</p>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Overview</h2>
            <p>
              Morse Code Converter ("this site") is a free tool for converting text to Morse code, playing it as
              audio, and downloading it as a WAV file. All conversion and audio processing happens locally in your
              browser — we don't collect, store, or transmit the text you type.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Cookies and advertising</h2>
            <p>
              This site may display ads served by Google AdSense. Google and its partners use cookies and similar
              technologies to serve ads based on your prior visits to this and other websites. You can opt out of
              personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline hover:text-amber-200"
              >
                Google Ads Settings
              </a>
              , or by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline hover:text-amber-200"
              >
                aboutads.info
              </a>
              . Third-party vendors, including Google, use cookies to serve ads based on your visits to this site
              and other sites on the internet.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Server logs</h2>
            <p>
              Our hosting provider (Cloudflare) may automatically log standard technical information for every
              request, such as IP address, browser type, and request time, for security and performance purposes.
              This is standard web hosting behavior and isn't used to identify individual visitors.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Your choices</h2>
            <p>
              You can disable cookies in your browser settings at any time. Doing so may affect ad personalization
              but won't affect the site's core functionality — the converter works entirely without cookies.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Contact</h2>
            <p>
              Questions about this policy? Reach out at{' '}
              <a href="mailto:mansj98@gmail.com" className="text-amber-300 underline hover:text-amber-200">
                mansj98@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-2 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-amber-300 transition">
            Converter
          </Link>
          <Link href="/learn" className="hover:text-amber-300 transition">
            Learn Morse Code
          </Link>
        </div>
        <span>Morse Code Converter</span>
      </footer>
    </div>
  );
}
