// Renders a Morse string ("... .-.. .-.. / .-.-.-") as dot/dash bars
export default function MorseVisual({ morse, size = 'md' }) {
  if (!morse) return null;
  const tokens = morse.split(' ');

  const dot = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  const dash = size === 'sm' ? 'h-2.5 w-6' : 'h-3 w-8';

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
                className={`inline-block rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] ${
                  symbol === '.' ? dot : dash
                }`}
              />
            ))}
          </span>
        )
      )}
    </div>
  );
}
