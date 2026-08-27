import Link from 'next/link';
import Seo from '../components/Seo';
import FeatureNav from '../components/FeatureNav';

const LAST_UPDATED = 'August 6, 2026';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo
        title="Terms of Service · MORSE"
        description="Terms of Service for the Morse Code Converter: acceptable use, no warranty, and limitation of liability."
        path="/terms"
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
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">TERMS OF SERVICE</p>
        </div>
      </header>

      <FeatureNav current="/terms" />

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-6 text-sm text-amber-100/80 leading-relaxed">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wide">Terms of Service</h1>
          <p className="text-xs text-amber-200/50">Last updated: {LAST_UPDATED}</p>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Agreement</h2>
            <p>
              By using this site (the "Service"), you agree to these terms. If you don't agree, please don't use
              the Service.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">The Service</h2>
            <p>
              This site provides free tools for converting text to Morse code, playing and downloading it as
              audio, and learning and practicing Morse code. Features may be added, changed, or removed — including
              being temporarily or permanently disabled — at any time without notice.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Acceptable use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Send, transmit, or store anything illegal, threatening, harassing, or abusive</li>
              <li>Attempt to disrupt, overload, or gain unauthorized access to the Service or its infrastructure</li>
              <li>Scrape, resell, or misuse the Service in a way that harms other users or the Service itself</li>
            </ul>
            <p>We may suspend or block access for anyone who violates these terms.</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">No warranty</h2>
            <p>
              The Service is provided "as is," without warranties of any kind, express or implied. We don't
              guarantee it will be available, error-free, or fit for any particular purpose.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, we aren't liable for any indirect, incidental, or
              consequential damages arising from your use of, or inability to use, the Service.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Changes</h2>
            <p>
              We may update these terms from time to time. Continuing to use the Service after a change means you
              accept the updated terms.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Contact</h2>
            <p>
              Questions about these terms? Reach out at{' '}
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
          <Link href="/privacy" className="hover:text-amber-300 transition">
            Privacy Policy
          </Link>
        </div>
        <span>Morse Code Converter</span>
      </footer>
    </div>
  );
}
