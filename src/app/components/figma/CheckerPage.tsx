import { useState } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';
import combosRaw from './data/combos.json';
import { adaptCombos, findCombo } from './data/tripsitCombosAdapter';
import type { RiskLevel, ComboResult, TripSitCombos } from './data/tripsitCombosAdapter';

const COMBINATIONS: Record<string, ComboResult> = adaptCombos(combosRaw as TripSitCombos);

// ─── Category filter pills ────────────────────────────────────────────────────

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'All',           color: '#8C5CFE' },
  { label: 'Stimulants',    color: '#FFADA5' },
  { label: 'Psychedelics',  color: '#B2FFF1' },
  { label: 'Depressants',   color: '#B3C3D1' },
  { label: 'Dissociatives', color: '#CCF1FF' },
  { label: 'Cannabinoids',  color: '#CBFFC6' },
  { label: 'Opioids',       color: '#FFD0B4' },
  { label: 'Other',         color: '#EEEEEE' },
];

// ─── Substances ───────────────────────────────────────────────────────────────
// comboKey MUST exactly match a top-level key in combos.json.
// Verified keys: alcohol, amphetamines, amt, benzodiazepines, caffeine,
//   cannabis, cocaine, dextromethorphan, diphenhydramine, dmt, dox,
//   ghb/gbl, ketamine, lithium, lsd, maois, mdma, mephedrone, mescaline,
//   mushrooms, mxe, nbomes, nitrous, opioids, pcp, pregabalin, ssris,
//   tramadol, 2c-x, 2c-t-x, 5-meo-xxt

interface Substance {
  name: string;     // display name in UI
  comboKey: string; // exact key from combos.json
  category: string;
  color: string;
}

const SUBSTANCES: Substance[] = [
  // Depressants
  { name: 'Alcohol',        comboKey: 'alcohol',          category: 'Depressants',   color: '#F5D163' },
  { name: 'GHB / GBL',      comboKey: 'ghb/gbl',          category: 'Depressants',   color: '#A8E6CF' },
  { name: 'Benzos',         comboKey: 'benzodiazepines',  category: 'Depressants',   color: '#B3C3D1' },
  { name: 'Pregabalin',     comboKey: 'pregabalin',       category: 'Depressants',   color: '#B3C3D1' },
  // Opioids
  { name: 'Opioids',        comboKey: 'opioids',          category: 'Opioids',       color: '#FFD0B4' },
  { name: 'Tramadol',       comboKey: 'tramadol',         category: 'Opioids',       color: '#FFD0B4' },
  // Stimulants
  { name: 'Amphetamines',   comboKey: 'amphetamines',     category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Cocaine',        comboKey: 'cocaine',          category: 'Stimulants',    color: '#F1F1F1' },
  { name: 'MDMA',           comboKey: 'mdma',             category: 'Stimulants',    color: '#FFBEEA' },
  { name: 'Mephedrone',     comboKey: 'mephedrone',       category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Caffeine',       comboKey: 'caffeine',         category: 'Stimulants',    color: '#FFADA5' },
  // Psychedelics
  { name: 'LSD',            comboKey: 'lsd',              category: 'Psychedelics',  color: '#B5EAD7' },
  { name: 'Mushrooms',      comboKey: 'mushrooms',        category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'DMT',            comboKey: 'dmt',              category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'Mescaline',      comboKey: 'mescaline',        category: 'Psychedelics',  color: '#B2FFF1' },
  { name: '2C-x',           comboKey: '2c-x',             category: 'Psychedelics',  color: '#FFB6A3' },
  { name: 'NBOMe',          comboKey: 'nbomes',           category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'DOx',            comboKey: 'dox',              category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'aMT',            comboKey: 'amt',              category: 'Psychedelics',  color: '#B2FFF1' },
  { name: '5-MeO-xxT',      comboKey: '5-meo-xxt',       category: 'Psychedelics',  color: '#B2FFF1' },
  { name: '2C-T-x',         comboKey: '2c-t-x',          category: 'Psychedelics',  color: '#B2FFF1' },
  // Dissociatives
  { name: 'Ketamine',       comboKey: 'ketamine',         category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'DXM',            comboKey: 'dextromethorphan', category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'MXE',            comboKey: 'mxe',              category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'PCP',            comboKey: 'pcp',              category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'Nitrous',        comboKey: 'nitrous',          category: 'Dissociatives', color: '#CCF1FF' },
  // Cannabinoids
  { name: 'Cannabis',       comboKey: 'cannabis',         category: 'Cannabinoids',  color: '#CBFFC6' },
  // Other
  { name: 'MAOIs',          comboKey: 'maois',            category: 'Other',         color: '#D4B3FF' },
  { name: 'SSRIs',          comboKey: 'ssris',            category: 'Other',         color: '#D4B3FF' },
  { name: 'DPH',            comboKey: 'diphenhydramine',  category: 'Other',         color: '#EEEEEE' },
  { name: 'Lithium',        comboKey: 'lithium',          category: 'Other',         color: '#EEEEEE' },
];

// ─── Risk icons & colours ─────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, { color: string; icon: JSX.Element }> = {
  green: {
    color: '#4ADE80',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="10" cy="10" r="9" fill="#4ADE80" />
        <path d="M6 10l3 3 5-5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  yellow: {
    color: '#FFD600',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="10" cy="10" r="9" fill="#FFD600" />
        <path d="M10 6.5V11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13.5" r="0.8" fill="#111" />
      </svg>
    ),
  },
  red: {
    color: '#FF8080',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <path d="M9.134 2.5a1 1 0 0 1 1.732 0l7.794 13.5A1 1 0 0 1 17.794 17.5H2.206a1 1 0 0 1-.866-1.5L9.134 2.5Z" fill="#FF6B6B" />
        <path d="M10 8v3.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="0.8" fill="#111" />
      </svg>
    ),
  },
};

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

  const toggle = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const filtered = activeCategory === 'All'
    ? SUBSTANCES
    : SUBSTANCES.filter(s => s.category === activeCategory);

  const combo = selected.length >= 2 ? findCombo(selected, COMBINATIONS) : null;
  const infoState = selected.length === 0 ? 'empty' : selected.length === 1 ? 'one' : 'result';
  const riskConfig = combo?.risk ? RISK_CONFIG[combo.risk] : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0D0D0D', overflow: 'hidden' }}>

      {/* ── FIXED HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          <button onClick={onProfileOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Open profile">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
              <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
            </svg>
          </button>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', margin: 0, lineHeight: 1.5 }}>
            Combo Checker
          </p>
          <button onClick={onSearchOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Open search">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
              <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="hide-scrollbar" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
        <div style={{ paddingTop: '56px' }}>

          {/* ── RESULT PANEL ── */}
          <div style={{ padding: '16px 8px 0' }}>
            <div style={{
              borderRadius: '16px', border: '1px solid #1E1E1E', background: '#111111',
              minHeight: '220px', padding: '20px', display: 'flex', flexDirection: 'column',
              justifyContent: infoState === 'result' ? 'flex-start' : 'center',
              alignItems: infoState === 'result' ? 'flex-start' : 'center',
            }}>
              {(infoState === 'empty' || infoState === 'one') && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                  {infoState === 'empty'
                    ? 'Choose at least two substances to see the results'
                    : 'Choose one more substance to see the results'}
                </p>
              )}

              {infoState === 'result' && combo && riskConfig && (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                    {riskConfig.icon}
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: riskConfig.color, margin: 0, letterSpacing: '0.32px', lineHeight: 1.4 }}>
                      {combo.title}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#F1F1F1', opacity: 0.7, margin: 0, letterSpacing: '0.28px', lineHeight: 1.65 }}>
                    {combo.body}
                  </p>
                </>
              )}

              {infoState === 'result' && !combo && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                  No interaction data available for this combination.
                </p>
              )}
            </div>
          </div>

          {/* ── SELECTED SUBSTANCE PILLS ── */}
          {selected.length > 0 && (
            <div className="hide-scrollbar" style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '12px 8px 0' }}>
              <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
                {selected.map(key => {
                  const sub = SUBSTANCES.find(s => s.comboKey === key);
                  if (!sub) return null;
                  return (
                    <button key={key} onClick={() => toggle(key)} style={{
                      background: `${sub.color}1A`, border: `1.5px solid ${sub.color}`,
                      borderRadius: '44px', padding: '6px 12px',
                      fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px',
                      color: sub.color, cursor: 'pointer', whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      {sub.name}
                      <span style={{ opacity: 0.6, fontSize: '12px' }}>✕</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CATEGORY FILTER STRIP ── */}
          <div className="hide-scrollbar" style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '16px 8px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: 'max-content' }}>
              {CATEGORIES.map(({ label, color }) => {
                const isActive = activeCategory === label;
                return (
                  <button key={label} onClick={() => setActiveCategory(label)} style={{
                    background: isActive ? color : 'transparent',
                    border: isActive ? 'none' : `1px solid ${color}`,
                    borderRadius: '44px', padding: '8px 12px',
                    fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px',
                    color: isActive ? '#0D0D0D' : color,
                    cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1.3, flexShrink: 0,
                  }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SUBSTANCE GRID ── */}
          <div style={{ padding: '12px 8px 116px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {filtered.map((sub) => {
                const isSelected = selected.includes(sub.comboKey);
                return (
                  <button key={sub.comboKey} onClick={() => toggle(sub.comboKey)} style={{
                    padding: '14px 8px', borderRadius: '12px',
                    border: isSelected ? `1.5px solid ${sub.color}` : '1px solid #2A2A2A',
                    background: isSelected ? `${sub.color}1A` : '#171717',
                    color: isSelected ? sub.color : '#F1F1F1',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '14px', letterSpacing: '0.28px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <BottomNav activeTab="Checker" onTabChange={onTabChange} />
    </div>
  );
}
