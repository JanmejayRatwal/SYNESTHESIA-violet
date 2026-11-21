# SYNESTHESIA — Violet Edition

A mobile-first, interactive cosmic birthday surprise.

## Experience flow
1. **Gather the stars:** drag each of the five violet stars into the glowing centre.
2. **Find the cake:** once all five stars are collected, a violet stardust cake appears.
3. **Cut the cake:** swipe across the cake to make the cut.
4. **Birthday reveal:** the personal birthday message appears, followed by screen fireworks and floating balloons.
5. **The final 27:** a giant glowing `27` bursts out from the centre, then shrinks and settles in the upper-right corner.

Sound is synthesized in-browser and starts after the first interaction (mobile browsers require a user gesture before audio can play).

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000/synesthesia`.

## Add to an existing Next.js App Router portfolio
Copy `app/synesthesia/page.tsx` into your app and merge the styles from `app/globals.css` into your existing global stylesheet. Keep your existing `layout.tsx`, `package.json`, and homepage. The project uses Next.js 15 and React 19.

## Personalize
Edit the message in `app/synesthesia/page.tsx`. The displayed date and the final `27` are easy to change in the same file.
