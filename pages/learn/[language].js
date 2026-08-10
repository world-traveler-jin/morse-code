import Link from 'next/link';
import LearnContent, { FAQ_STRUCTURED_DATA } from '../../components/LearnContent';
import Seo from '../../components/Seo';
import FeatureNav from '../../components/FeatureNav';

const LANGUAGE_META = {
  russian: {
    title: 'Russian Morse Code Chart & Translator · MORSE',
    description:
      'Complete Russian (Cyrillic) Morse code reference — every letter, number, and punctuation mark, each tappable to hear its signal. Free interactive chart and translator.',
    heading: 'Russian Morse Code Chart',
    intro:
      'Russian Morse code (Русская азбука Морзе) was standardized in 1856 for the Imperial Russian telegraph network. Most Cyrillic letters reuse the same dot-dash pattern as the Latin letter they sound closest to — Cyrillic А uses the same code as Latin A, for example — which makes it easier to pick up if you already know International Morse code.',
  },
  greek: {
    title: 'Greek Morse Code Chart & Translator · MORSE',
    description:
      'Complete Greek Morse code reference — every letter of the Greek alphabet, each tappable to hear its signal. Free interactive chart and translator.',
    heading: 'Greek Morse Code Chart',
    intro:
      'Greek Morse code assigns each of the 24 letters of the Greek alphabet the same dot-dash pattern as the Latin letter it most resembles in shape or sound — Α shares its code with Latin A, Β with B, and so on through Ω.',
  },
  hebrew: {
    title: 'Hebrew Morse Code Chart & Translator · MORSE',
    description:
      'Complete Hebrew Morse code reference — every letter of the Hebrew alphabet, including final (sofit) forms, each tappable to hear its signal.',
    heading: 'Hebrew Morse Code Chart',
    intro:
      'Hebrew Morse code covers all 22 letters of the Hebrew alphabet, written right-to-left. The five letters with special final (sofit) forms — ך ם ן ף ץ — share their base letter\'s code, since Morse doesn\'t distinguish the typographic variant used at the end of a word.',
  },
  japanese: {
    title: 'Japanese Morse Code (Wabun) Chart & Translator · MORSE',
    description:
      'Complete Japanese Wabun code reference — every katakana character, plus dakuten and handakuten marks, each tappable to hear its signal.',
    heading: 'Japanese Morse Code (Wabun) Chart',
    intro:
      'Japanese Wabun code (和文モールス符号) encodes katakana rather than the Latin alphabet, and was historically used by Japanese telegraph and amateur radio operators. It has its own codes for the dakuten (゛) and handakuten (゜) marks that modify a kana\'s sound, plus a few punctuation marks unique to Wabun.',
  },
  korean: {
    title: 'Korean Morse Code (SKATS) Chart & Translator · MORSE',
    description:
      'Complete Korean SKATS Morse code reference — every Hangul jamo, each tappable to hear its signal. Type a full Korean word and it decomposes automatically.',
    heading: 'Korean Morse Code (SKATS) Chart',
    intro:
      'Korean Morse code, known as SKATS (Special Korean Alphabet Transliteration System), maps individual Hangul jamo — consonants and vowels — to dot-dash patterns rather than whole syllables. Type a complete word like 모스부호 and this page automatically breaks it into its jamo before converting.',
  },
};

export function getStaticPaths() {
  return {
    paths: Object.keys(LANGUAGE_META).map((language) => ({ params: { language } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: { language: params.language } };
}

export default function LearnLanguage({ language }) {
  const meta = LANGUAGE_META[language];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-amber-50 font-mono selection:bg-amber-400 selection:text-[#0a0e14]">
      <Seo title={meta.title} description={meta.description} path={`/learn/${language}`} />
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
        <LearnContent language={language} heading={meta.heading} intro={meta.intro} />
      </main>

      <footer className="relative z-10 w-full px-4 py-5 flex flex-col items-center gap-2 border-t border-amber-400/20 text-amber-200/40 text-[11px] tracking-wide">
        <div className="flex items-center gap-4">
          <Link href="/learn" className="hover:text-amber-300 transition">
            All Languages
          </Link>
          <Link href="/history" className="hover:text-amber-300 transition">
            History
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
