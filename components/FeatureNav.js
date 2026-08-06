import Link from 'next/link';

const ITEMS = [
  { href: '/', label: 'Converter', icon: '📡', color: 'amber' },
  { href: '/learn', label: 'Learn', icon: '📖', color: 'emerald' },
  { href: '/practice', label: 'Practice Key', icon: '🔑', color: 'sky' },
  { href: '/chat', label: 'Live Chat', icon: '💬', color: 'rose' },
];

const COLOR_CLASSES = {
  amber:
    'bg-amber-400 hover:bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.5)] hover:shadow-[0_0_26px_rgba(251,191,36,0.7)]',
  emerald:
    'bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.5)] hover:shadow-[0_0_26px_rgba(52,211,153,0.7)]',
  sky: 'bg-sky-400 hover:bg-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.5)] hover:shadow-[0_0_26px_rgba(56,189,248,0.7)]',
  rose: 'bg-rose-400 hover:bg-rose-300 shadow-[0_0_18px_rgba(251,113,133,0.5)] hover:shadow-[0_0_26px_rgba(251,113,133,0.7)]',
};

// Prominent cross-page navigation: shown on every page, linking to the other
// three so Practice Key and Live Chat aren't buried where nobody looks.
export default function FeatureNav({ current }) {
  const items = ITEMS.filter((item) => item.href !== current);

  return (
    <div className="relative z-10 w-full flex flex-wrap justify-center gap-2.5 px-4 py-4 border-b border-amber-400/10 bg-black/10">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[#0a0e14] font-bold text-sm tracking-wide transition-all hover:scale-105 ${COLOR_CLASSES[item.color]}`}
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </div>
  );
}
