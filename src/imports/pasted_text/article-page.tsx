Let me pull the design first.Got the full page — two article cards, hero pill image behind the header, colored inline drug links. Here's the prompt:

---

> **Replace the existing `ArticlePage.tsx` with this updated design. File: `src/app/components/figma/ArticlePage.tsx`**
>
> **Wiring in `App.tsx`:**
> - `currentPage === 'article'` renders this page
> - "Read the article" button on Home Page warning card calls `setCurrentPage('article')`
> - Props: `onBack: () => void`, `onDrug: (drugId: number) => void`, `onSearchOpen: () => void`, `onTabChange: (tab) => void`
>
> ---
>
> **Header — same 3-layer blur pattern:**
> - Layer 1: `backdrop-filter: blur(20px)` masked `linear-gradient(to bottom, black 50%, transparent 100%)`
> - Layer 2: `background: linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)`
> - Layer 3: back arrow `←` (left, calls `onBack()`) | nothing center | search icon (right, calls `onSearchOpen()`)
> - Height: `56px`
>
> **Hero image — behind everything, bleeds under header:**
> - Pills photo (`imgPillsManyNews00851`) absolutely positioned: `width: 576px`, `height: 384px`, `top: -148px`, `left: -93px`, `object-fit: cover`, `pointer-events: none`, `z-index: 0`
> - All content sits above it at `z-index: 1`
>
> ---
>
> **Scrollable content — `top: 56px`, `bottom: 100px`, `padding: 0 8px 16px`, `gap: 16px` between cards:**
>
> **Card shared styles:** `background: #171717`, `border-radius: 20px`, `padding: 26px 16px`, `backdrop-filter: blur(20px)`, `display: flex`, `flex-direction: column`, `gap: 30px`, `width: 100%`
>
> ---
>
> **Card 1 — "Fake batch of Oxycodone":**
>
> Row 1 — title + share icon:
> - Title: TT Travels Next Trial Variable Bold 24px `#F1F1F1`, two lines: "Fake batch" / "of Oxycodone"
> - Share icon (right): 24×24px SVG share icon, `#F1F1F1`
>
> Row 2 — category tag:
> - "Opioids" pill tag: `border: 1px solid #FFD0B4`, `color: #FFD0B4`, `border-radius: 18px`, `padding: 12px`, Roboto Regular 16px
>
> Row 3 — article body with inline drug link:
> Roboto Regular 16px `#F1F1F1`, `line-height: 1.3`, `white-space: pre-wrap`:
> ```
> "A counterfeit batch of oxycodone containing fentanyl was detected in Berlin on 12.05.2025. "
> ```
> then the word **Fentanyl** as a tappable `<button>` or `<span>`:
> - `color: #FFD0B4`, `text-decoration: underline`, Roboto Regular 16px
> - `onClick: () => onDrug(1)` — navigates to Fentanyl detail page (drug id 1), no slide transition
> ```
> " is an extremely potent opioid linked to fatal overdoses, especially when taken unknowingly."
> ```
> then two line breaks, then:
> ```
> "If you or someone you know has sourced oxycodone recently, do not use it without testing. Start with a very small dose, never use alone, and keep naloxone nearby if possible."
> ```
> then two line breaks, then:
> ```
> "Stay safe — share this with your community."
> ```
>
> ---
>
> **Card 2 — "Dangerous "Pink Cocaine"":**
>
> Row 1 — title + share icon:
> - Title: TT Travels Next Trial Variable Bold 24px `#F1F1F1`, two lines: `Dangerous` / `"Pink Cocaine"`
> - Share icon same as Card 1
>
> Row 2 — category tag:
> - "Stimulants" pill tag: `border: 1px solid #FFADA5`, `color: #FFADA5`, same style as above
>
> Row 3 — article body with **three** inline drug links:
> ```
> `A batch of so-called "pink cocaine" tested in Hamburg on 09.06.2025 was found to contain a mix of `
> ```
> **MDMA** → `color: #B2FFF1`, underlined, `onClick: () => onDrug(5)` (drug id 5)
> ```
> `, `
> ```
> **Ketamine** → `color: #CCF1FF`, underlined, `onClick: () => onDrug(3)` (drug id 3)
> ```
> `, and `
> ```
> **2C-B** → `color: #B2FFF1`, underlined, `onClick: () => onDrug(5)` (closest match, MDMA/psychedelics page)
> ```
> ` — not cocaine at all. This unpredictable combo increases the risk of anxiety, disorientation, and dangerous overstimulation.`
> ```
> two line breaks, then:
> ```
> "Avoid using if unsure of the source. If you've already taken it, stay hydrated, avoid mixing with alcohol, and stick with trusted people. Test if possible, and seek medical help if symptoms feel intense or unfamiliar."
> ```
> two line breaks, then:
> ```
> "Spread the word — it could save someone's night."
> ```
>
> ---
>
> **Inline drug link component — reusable:**
> ```tsx
> function DrugLink({ name, color, onTap }: { name: string; color: string; onTap: () => void }) {
>   return (
>     <button
>       onClick={onTap}
>       style={{
>         background: 'none',
>         border: 'none',
>         padding: 0,
>         color,
>         textDecoration: 'underline',
>         fontFamily: 'Roboto, sans-serif',
>         fontSize: '16px',
>         fontWeight: 400,
>         letterSpacing: '0.32px',
>         lineHeight: 1.3,
>         cursor: 'pointer',
>         display: 'inline',
>       }}
>     >
>       {name}
>     </button>
>   );
> }
> ```
>
> **When a drug link is tapped:**
> - Set `skipTransition = true`
> - Call `onDrug(drugId)` which sets `currentPage` to the drug detail page
> - No slide animation — instant render (same pattern as search result tap)
>
> ---
>
> **Bottom nav:** `<BottomNav activeTab="Home" onTabChange={onTabChange} />` — Home tab active since this article is reached from the Home Page warning card.