import { useState, useMemo } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 'yellow' | 'red';

interface ComboResult {
  risk: RiskLevel;
  title: string;
  body: string;
}

// ─── Combination data ─────────────────────────────────────────────────────────

const COMBINATIONS: Record<string, ComboResult> = {
  'Ecstasy+Ketamine': {
    risk: 'yellow',
    title: 'You just combined MDMA + Ketamine',
    body: 'Mixing ecstasy (MDMA) and ketamine is called "kitty flipping." This combo can feel floaty and emotionally intense — MDMA lifts you up, while ketamine pulls you inward. The effects may cancel each other out or feel disorienting. Go slow, stay grounded, and avoid re-dosing too soon.',
  },
  'Ecstasy+GHB': {
    risk: 'red',
    title: 'You just combined Ecstasy + GHB',
    body: 'This combo is powerful and risky — MDMA boosts energy and emotion, while GHB slows the body down. Together they can cause confusion, blackouts, or dangerously slow breathing. Stay with trusted people, avoid re-dosing, and never mix GHB with alcohol.',
  },
  'Ecstasy+GHB+Ketamine': {
    risk: 'red',
    title: 'You just combined Ecstasy + Ketamine + GHB',
    body: 'This combo is powerful and risky — MDMA boosts energy and emotion, ketamine adds dissociation, and GHB slows the body down. Together, they can cause confusion, blackouts, or dangerously slow breathing. Stay with trusted people, avoid re-dosing, and never mix GHB with alcohol.',
  },
  'Alcohol+GHB': {
    risk: 'red',
    title: 'You just combined Alcohol + GHB',
    body: 'Both are CNS depressants. Combined they dramatically increase the risk of respiratory depression, unconsciousness, and overdose. This is one of the most dangerous combinations. Do not mix these.',
  },
  'Alcohol+Cocaine': {
    risk: 'yellow',
    title: 'You just combined Cocaine + Alcohol',
    body: 'These combine in the liver to form cocaethylene, which is more toxic than either substance alone. It increases cardiovascular strain and extends the effects of both. Avoid redosing and keep hydrated.',
  },
  'Cannabis+LSD': {
    risk: 'yellow',
    title: 'You just combined LSD + Cannabis',
    body: 'Cannabis can significantly intensify and prolong an LSD experience. This can tip into anxiety, paranoia, or an overwhelming trip for some people. Use cannabis cautiously and only in small amounts if at all.',
  },
  'Alcohol+Fentanyl': {
    risk: 'red',
    title: 'You just combined Fentanyl + Alcohol',
    body: 'Both suppress breathing. This combination is extremely dangerous and frequently fatal. If you suspect an overdose, call emergency services immediately and administer naloxone if available.',
  },
  'Cocaine+MDMA': {
    risk: 'yellow',
    title: 'You just combined MDMA + Cocaine',
    body: 'Both are stimulants and put significant strain on the heart. Combined they raise heart rate and blood pressure substantially. Overheating and cardiovascular risk increase. Stay cool, hydrated, and rest regularly.',
  },
  'Alcohol+Ketamine': {
    risk: 'red',
    title: 'You just combined Ketamine + Alcohol',
    body: 'Both are depressants. Combined they increase the risk of losing consciousness, vomiting while unconscious, and respiratory depression. Avoid this combination.',
  },
  'Cannabis+GHB': {
    risk: 'yellow',
    title: 'You just combined Cannabis + GHB',
    body: 'Cannabis can intensify the sedative and dissociative effects of GHB, increasing the risk of passing out. Keep doses low, stay seated, and have a sober person nearby.',
  },
  'Ecstasy+MDMA': {
    risk: 'yellow',
    title: 'You just combined MDMA + Ecstasy',
    body: 'Ecstasy tablets often contain MDMA — combining them stacks the dose unpredictably and dramatically raises the risk of overheating, serotonin syndrome, and cardiovascular strain. Avoid doubling up.',
  },
};

function comboKey(selected: string[]): string {
  return [...selected].sort().join('+');
}

function getCombinations<T>(arr: T[], size: number): T[][] {
  if (size === 1) return arr.map(x => [x]);
  return arr.flatMap((x, i) =>
    getCombinations(arr.slice(i + 1), size - 1).map(rest => [x, ...rest])
  );
}

function findCombo(selected: string[]): ComboResult | null {
  if (selected.length < 2) return null;
  const exact = COMBINATIONS[comboKey(selected)];
  if (exact) return exact;
  for (let size = Math.min(selected.length, 3); size >= 2; size--) {
    const subsets = getCombinations(selected, size);
    for (const subset of subsets) {
      const match = COMBINATIONS[comboKey(subset)];
      if (match) return match;
    }
  }
  return null;
}

// ─── Substance & category data ────────────────────────────────────────────────

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'All',           color: '#8C5CFE' },
  { label: 'Stimulants',    color: '#FFADA5' },
  { label: 'Dissociatives', color: '#CCF1FF' },
  { label: 'Cannabinoids',  color: '#CBFFC6' },
  { label: 'Psychedelics',  color: '#B2FFF1' },
  { label: 'Depressants',   color: '#B3C3D1' },
  { label: 'Opioids',       color: '#FFD0B4' },
  { label: 'Other',         color: '#EEEEEE' },
];

interface Substance {
  name: string;
  category: string;
  color: string;
}

const SUBSTANCES: Substance[] = [
  { name: 'Ecstasy',      category: 'Stimulants',    color: '#FFBEEA' },
  { name: 'Kratom',       category: 'Opioids',        color: '#FFD0B4' },
  { name: 'GHB',          category: 'Depressants',    color: '#A8E6CF' },
  { name: 'Fentanyl',     category: 'Opioids',        color: '#FFADA5' },
  { name: 'Ketamine',     category: 'Dissociatives',  color: '#CCF1FF' },
  { name: 'LSD',          category: 'Psychedelics',   color: '#B5EAD7' },
  { name: 'Alcohol',      category: 'Depressants',    color: '#F5D163' },
  { name: 'Cocaine',      category: 'Stimulants',     color: '#F1F1F1' },
  { name: 'Cannabis',     category: 'Cannabinoids',   color: '#CBFFC6' },
  { name: 'MDMA',         category: 'Stimulants',     color: '#FFBEEA' },
  { name: 'Poppers',      category: 'Other',          color: '#EEEEEE' },
  { name: 'Viagra',       category: 'Other',          color: '#EEEEEE' },
  { name: 'Tilidine',     category: 'Opioids',        color: '#FFD0B4' },
  { name: 'Nicotine',     category: 'Stimulants',     color: '#FFADA5' },
  { name: 'Mescaline',    category: 'Psychedelics',   color: '#B2FFF1' },
  { name: '2C-B (2C-x)',  category: 'Psychedelics',   color: '#FFB6A3' },
  { name: '3-CMC',        category: 'Stimulants',     color: '#FFADA5' },
  { name: '4-CMC',        category: 'Stimulants',     color: '#FFADA5' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CheckerPageProps {
  onTabChange: (tab: 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal') => void;
  onSearchOpen?: () => void;
  onProfileOpen?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckerPage({ onTabChange, onSearchOpen, onProfileOpen }: CheckerPageProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggle = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filtered = activeCategory === 'All'
    ? SUBSTANCES
    : SUBSTANCES.filter(s => s.category === activeCategory);

  const combo: ComboResult | null = useMemo(() => findCombo(selected), [selected]);

  const infoState: 'empty' | 'one' | 'result' =
    selected.length === 0 ? 'empty' :
    selected.length === 1 ? 'one' : 'result';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0D0D0D',
        overflow: 'hidden',
      }}
    >
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* ── FIXED HEADER — 3-layer blur (identical to LibraryPage) ── */}
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
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <button
              onClick={onProfileOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Open profile"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
                <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
              </svg>
            </button>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#F1F1F1',
                letterSpacing: '0.36px',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Checker
            </p>
            <button
              onClick={onSearchOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        className="hide-scrollbar"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div style={{ paddingTop: '56px' }}>

          {/* ── INFO PANEL ── */}
          <div style={{ padding: '16px 8px 0' }}>
            <div
              style={{
                borderRadius: '16px',
                border: '1px solid #1E1E1E',
                background: '#111111',
                minHeight: '240px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: infoState === 'result' ? 'flex-start' : 'center',
                alignItems: infoState === 'result' ? 'flex-start' : 'center',
              }}
            >
              {(infoState === 'empty' || infoState === 'one') && (
                <p
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#F1F1F1',
                    opacity: 0.3,
                    textAlign: 'center',
                    margin: 0,
                    letterSpacing: '0.32px',
                    lineHeight: 1.5,
                  }}
                >
                  {infoState === 'empty'
                    ? 'Choose at least two substances to see the results'
                    : 'Choose one more substance to see the results'}
                </p>
              )}

              {infoState === 'result' && combo && (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                    {combo.risk === 'red' ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M9.134 2.5a1 1 0 0 1 1.732 0l7.794 13.5A1 1 0 0 1 17.794 17.5H2.206a1 1 0 0 1-.866-1.5L9.134 2.5Z" fill="#FF6B6B" />
                        <path d="M10 8v3.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="14.5" r="0.8" fill="#111" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <circle cx="10" cy="10" r="9" fill="#FFD600" />
                        <path d="M10 6.5V11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="13.5" r="0.8" fill="#111" />
                      </svg>
                    )}
                    <p
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '16px',
                        color: combo.risk === 'red' ? '#FF8080' : '#FFD600',
                        margin: 0,
                        letterSpacing: '0.32px',
                        lineHeight: 1.4,
                      }}
                    >
                      {combo.title}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#F1F1F1',
                      opacity: 0.7,
                      margin: 0,
                      letterSpacing: '0.28px',
                      lineHeight: 1.65,
                    }}
                  >
                    {combo.body}
                  </p>
                </>
              )}

              {infoState === 'result' && !combo && (
                <p
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#F1F1F1',
                    opacity: 0.3,
                    textAlign: 'center',
                    margin: 0,
                    letterSpacing: '0.32px',
                    lineHeight: 1.5,
                  }}
                >
                  No data available for this combination yet.
                </p>
              )}
            </div>
          </div>

          {/* ── CATEGORY FILTER STRIP ── */}
          <div
            className="hide-scrollbar"
            style={{
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '16px 8px 0',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: 'max-content' }}>
              {CATEGORIES.map(({ label, color }) => {
                const isActive = activeCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveCategory(label)}
                    style={{
                      background: isActive ? color : 'transparent',
                      border: isActive ? 'none' : `1px solid ${color}`,
                      borderRadius: '44px',
                      padding: '8px 12px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: isActive ? '#0D0D0D' : color,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SUBSTANCE GRID ── */}
          <div style={{ padding: '12px 8px 116px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {filtered.map((sub) => {
                const isSelected = selected.includes(sub.name);
                return (
                  <button
                    key={sub.name}
                    onClick={() => toggle(sub.name)}
                    style={{
                      padding: '14px 8px',
                      borderRadius: '12px',
                      border: isSelected
                        ? `1.5px solid ${sub.color}`
                        : '1px solid #2A2A2A',
                      background: isSelected ? `${sub.color}1A` : '#171717',
                      color: isSelected ? sub.color : '#F1F1F1',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '14px',
                      letterSpacing: '0.28px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Checker" onTabChange={onTabChange} />
    </div>
  );
}
