# Build CTRL App

A harm reduction and wellness mobile web app for substance users. Provides a substance library, safety checklists, a shop for testing kits, and a private journaling feature to log and reflect on sessions.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 6 (dev server on port 5000)
- **Styling:** Tailwind CSS v4 + inline styles
- **UI Primitives:** Radix UI, Lucide React, Framer Motion (motion)
- **Charts:** Recharts
- **Package Manager:** npm

## Project Structure

```
src/
  app/
    App.tsx              # Root component, navigation state, journal flow
    components/
      figma/             # Page-level components (Library, Shop, Journal, Profile, etc.)
      ui/                # Shared UI components (BottomNav, SearchOverlay, MoodEmoji, etc.)
    constants/
      layout.ts          # Layout constants (NAV_HEIGHT, etc.)
    types/
      journal.ts         # TripLog and JournalStep types
  assets/                # Image assets (PNG files referenced by hash)
  imports/               # Auto-generated SVG path data and legacy Figma-exported components
```

## Key Features

- **Home Page:** Warning news block, party checklist, shop carousel, journal summary card
- **Substance Library:** Filterable list of substances with drug detail pages
- **Shop:** Pre-party, after-party, 2-in-1, and testing kits
- **Journal:** Multi-step flow (Context → Mood → Reflection) with a trip log history
- **Search:** Global substance search overlay
- **Profile:** User profile with sub-pages (edit, subscription, language, etc.)

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Production build
```

## Bug Fixes Applied

- Added a `figma:asset/` Vite plugin in `vite.config.ts` to resolve Figma-protocol image imports to local `src/assets/` files (images were failing to load, causing a blank screen)
- Added missing `JournalMainPageProps` type definition in `JournalMainPage.tsx`
- Replaced broken Figma API URL for the checkmark image in `SuccessScreen.tsx` with an inline SVG

## Notes

- Images are stored as hash-named PNGs in `src/assets/` and were originally imported using the `figma:asset/<hash>.png` protocol (Figma-specific). The custom Vite plugin handles this mapping.
- The `src/imports/` directory contains auto-generated Figma exports — edit with caution.
