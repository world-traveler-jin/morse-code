import Link from 'next/link';
import Seo from '../components/Seo';
import FeatureNav from '../components/FeatureNav';

const PAGE_DESCRIPTION =
  'The history of Morse code: from Samuel Morse and the first telegraph line to SOS, two world wars, and why amateur radio operators still use it today.';

export default function History() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo title="The History of Morse Code · MORSE" description={PAGE_DESCRIPTION} path="/history" />

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
          <p className="text-[11px] sm:text-xs text-amber-200/50 tracking-wide">HISTORY</p>
        </div>
      </header>

      <FeatureNav current="/history" />

      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-10">
        <article className="w-full max-w-2xl flex flex-col gap-8 text-sm text-amber-100/80 leading-relaxed">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wide">The History of Morse Code</h1>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">The telegraph and Samuel Morse</h2>
            <p>
              In the 1830s, American inventor Samuel F. B. Morse began developing an electric telegraph — a way to
              send messages instantly over a wire using electrical pulses. Morse worked with Alfred Vail, who
              helped refine the system and is credited with much of the code itself: shorter combinations of dots
              and dashes for the most frequently used letters (like a single dot for E, the most common letter in
              English), and longer combinations for rarer ones. In 1844, Morse sent the first public long-distance
              telegraph message — "What hath God wrought" — from Washington, D.C. to Baltimore, and the technology
              spread quickly across the United States and the world.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">American Morse vs. International Morse</h2>
            <p>
              The code Morse and Vail originally developed — now called American Morse code — used a mix of dots,
              dashes, and even different-length pauses within a single letter, which made it tricky to send
              reliably over long-distance or noisy lines. European telegraph operators developed a cleaner variant
              in 1848, later standardized internationally, that removed the internal pauses and became known as
              International Morse code. It's the version still used today, and the one this site converts to and
              from.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">SOS and the wireless era</h2>
            <p>
              As radio replaced wired telegraph lines in the early 1900s, ships at sea adopted Morse code for
              wireless communication. International conferences settled on{' '}
              <strong className="text-amber-300">SOS</strong> (··· −−− ···) as a standard distress signal — not an
              acronym for anything, just a pattern simple enough to send and recognize even under pressure. It
              became famous worldwide after the RMS Titanic used it during its sinking in 1912.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Two world wars</h2>
            <p>
              Morse code became essential military infrastructure through both World Wars, used for everything
              from naval signaling to encrypted communications. Its simplicity — a single tone that could be sent
              by wire, radio, or even a flashing light — made it far more reliable than voice communication over
              the noisy, unreliable radio equipment of the era.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-amber-300 font-bold tracking-wide">Morse code today</h2>
            <p>
              Commercial shipping stopped requiring Morse code for distress calls by the late 1990s, replaced by
              satellite-based systems. But it never disappeared. Amateur ("ham") radio operators still use it
              regularly — a Morse signal (called "CW," for continuous wave) can often get through weak or noisy
              radio conditions where a voice transmission can't. Aircraft navigation beacons still identify
              themselves with a short Morse-coded call sign that pilots listen for to confirm they're tuned to the
              right station. And it remains a popular thing to simply learn for its own sake — a compact, elegant
              system for turning language into sound.
            </p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-full bg-amber-400 text-[#0a0e14] font-semibold tracking-wide hover:bg-amber-300 transition-transform transform hover:scale-105"
            >
              Learn the Code →
            </Link>
            <Link
              href="/practice"
              className="px-5 py-2.5 rounded-full border border-amber-400/40 text-amber-200 font-medium tracking-wide hover:bg-amber-400/10 transition-transform transform hover:scale-105"
            >
              Try the Practice Key →
            </Link>
          </div>
        </article>
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
