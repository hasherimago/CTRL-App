import svgPaths from '../../../imports/svg-hke02eu6ox';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface ArticlePageProps {
  onBack: () => void;
  onDrug: (drugId: number) => void;
  onSearchOpen: () => void;
  onTabChange: (tab: NavTab) => void;
}

// ─── Reusable inline drug link ────────────────────────────────────────────────

function DrugLink({ name, color, onTap }: { name: string; color: string; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        color,
        textDecoration: 'underline',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        letterSpacing: '0.32px',
        lineHeight: 1.3,
        cursor: 'pointer',
        display: 'inline',
      }}
    >
      {name}
    </button>
  );
}

// ─── Share icon ───────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute left-[2px] size-[20px] top-[2px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19.9998">
          <path d={svgPaths.p1fbe6e80} fill="#F1F1F1" />
          <path d={svgPaths.p378ae500} fill="#F1F1F1" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ArticlePage({ onBack, onDrug, onSearchOpen, onTabChange }: ArticlePageProps) {
  return (
    <div className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">

      {/* ── FIXED HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 10,
          }}
        >
          {/* Back arrow */}
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
              <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
            </svg>
          </button>

          {/* Search */}
          <button
            onClick={onSearchOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Open search"
          >
          <div style={{ width: '32px', height: '32px', position: 'relative' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
              <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: `${LAYOUT.NAV_HEIGHT}px`,
          left: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="px-2 flex flex-col gap-4" style={{ paddingTop: '70px', paddingBottom: `${LAYOUT.CONTENT_BOTTOM_PADDING}px` }}>
          {/* ── CARD 1 — Fake batch of Oxycodone ── */}
          <div
            className="backdrop-blur-[20px] bg-[#171717] flex flex-col gap-[30px] items-start px-4 py-[26px] rounded-[20px] w-full"
          >
            {/* Title + share */}
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col font-['TT_Travels_Next_Trial_Variable:Bold',sans-serif] font-[704] leading-normal not-italic text-[#F1F1F1] text-[24px] flex-1 min-w-0">
                <p className="mb-0">Fake batch</p>
                <p className="mb-0">of Oxycodone</p>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: '2px' }}
                aria-label="Share"
              >
                <ShareIcon />
              </button>
            </div>

            {/* Opioids tag */}
            <div className="flex items-start">
              <button
                className="flex items-center justify-center relative cursor-pointer shrink-0"
                style={{ background: 'none', border: '1px solid #FFD0B4', padding: '8px 12px', borderRadius: '100px' }}
              >
                <span
                  className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] text-[#FFD0B4] text-[16px] tracking-[0.32px] whitespace-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  Opioids
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="flex items-center w-full">
              <div
                className="flex-1 font-['Roboto:Regular',sans-serif] font-normal text-[#F1F1F1] text-[16px] tracking-[0.32px]"
                style={{ fontVariationSettings: "'wdth' 100", lineHeight: 1.3 }}
              >
                <p className="mb-0">
                  <span>A counterfeit batch of oxycodone containing fentanyl was detected in Berlin on 12.05.2025.{' '}</span>
                  <DrugLink name="Fentanyl" color="#FFD0B4" onTap={() => onDrug(1)} />
                  <span>{' '}is an extremely potent opioid linked to fatal overdoses, especially when taken unknowingly.</span>
                </p>
                <p className="leading-[1.3] mb-0">&nbsp;</p>
                <p className="leading-[1.3] mb-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                  If you or someone you know has sourced oxycodone recently, do not use it without testing. Start with a very small dose, never use alone, and keep naloxone nearby if possible.
                </p>
                <p className="leading-[1.3] mb-0">&nbsp;</p>
                <p className="leading-[1.3] mb-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Stay safe — share this with your community.
                </p>
              </div>
            </div>
          </div>

          {/* ── CARD 2 — Dangerous "Pink Cocaine" ── */}
          <div
            className="backdrop-blur-[20px] bg-[#171717] flex flex-col gap-[30px] items-start px-4 py-[26px] rounded-[20px] w-full"
          >
            {/* Title + share */}
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col font-['TT_Travels_Next_Trial_Variable:Bold',sans-serif] font-[704] leading-normal not-italic text-[#F1F1F1] text-[24px] flex-1 min-w-0">
                <p className="mb-0">Dangerous</p>
                <p className="mb-0">&ldquo;Pink Cocaine&rdquo;</p>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: '2px' }}
                aria-label="Share"
              >
                <ShareIcon />
              </button>
            </div>

            {/* Stimulants tag */}
            <div className="flex items-start">
              <button
                className="flex items-center justify-center relative cursor-pointer shrink-0"
                style={{ background: 'none', border: '1px solid #FFADA5', padding: '8px 12px', borderRadius: '100px' }}
              >
                <span
                  className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] text-[#FFADA5] text-[16px] tracking-[0.32px] whitespace-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  Stimulants
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="flex items-center w-full">
              <div
                className="flex-1 font-['Roboto:Regular',sans-serif] font-normal text-[#F1F1F1] text-[16px] tracking-[0.32px]"
                style={{ fontVariationSettings: "'wdth' 100", lineHeight: 1.3 }}
              >
                <p className="mb-0">
                  <span>A batch of so-called &ldquo;pink cocaine&rdquo; tested in Hamburg on 09.06.2025 was found to contain a mix of{' '}</span>
                  <DrugLink name="MDMA" color="#B2FFF1" onTap={() => onDrug(5)} />
                  <span>,{' '}</span>
                  <DrugLink name="Ketamine" color="#CCF1FF" onTap={() => onDrug(3)} />
                  <span>, and{' '}</span>
                  <DrugLink name="2C-B" color="#B2FFF1" onTap={() => onDrug(5)} />
                  <span>{' '}— not cocaine at all. This unpredictable combo increases the risk of anxiety, disorientation, and dangerous overstimulation.</span>
                </p>
                <p className="leading-[1.3] mb-0">&nbsp;</p>
                <p className="leading-[1.3] mb-0">
                  Avoid using if unsure of the source. If you&apos;ve already taken it, stay hydrated, avoid mixing with alcohol, and stick with trusted people. Test if possible, and seek medical help if symptoms feel intense or unfamiliar.
                </p>
                <p className="leading-[1.3] mb-0">&nbsp;</p>
                <p className="leading-[1.3] mb-0">
                  Spread the word — it could save someone&apos;s night.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM NAV — Home tab active ── */}
      <BottomNav activeTab="Home" onTabChange={onTabChange} />
    </div>
  );
}