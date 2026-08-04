# Morse Code

A [Next.js](https://nextjs.org) site that converts text to Morse code, plays it back as audio, and lets you download the signal as a WAV file. Includes a Learn page with a tappable reference for the full alphabet, digits, and punctuation.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the converter. The Learn page is at `/learn`.

## Build

```bash
npm run build
```

This is a static export (`output: 'export'` in `next.config.mjs`), so the build produces a plain static site in `./out` — no server required.

## Deploy

This repo deploys to [Cloudflare Workers](https://developers.cloudflare.com/workers/) as static assets, configured in `wrangler.jsonc`. Connect the repo under Cloudflare's Workers Builds with:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
