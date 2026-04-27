import { useState } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';
import { DrugCardArt, DRUG_CATEGORY_COLOR } from '../ui/DrugCardArt';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TripSitDrug {
  key: string;
  pretty_name: string;
  aliases: string[];
  categories: string[];
  properties: {
    summary?: string;
    dose?: string;
    duration?: string;
    onset?: string;
    'after-effects'?: string;
    effects?: string;
    avoid?: string;
    detection?: string;
    warning?: string;
  };
  formatted_dose?: Record<string, Record<string, string>>;
  // formatted_duration/aftereffects are either { _unit, value } (single) or { _unit, RouteA: "x", RouteB: "y" } (per-route)
  formatted_duration?: Record<string, string>;
  formatted_onset?: Record<string, string>;
  formatted_aftereffects?: Record<string, string>;
  formatted_effects?: string[];
  dose_note?: string;
  links?: {
    experiences?: string;
    pihkal?: string;
    tihkal?: string;
  };
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'All',          color: '#8C5CFE' },
  { label: 'Saved',        color: '#FFD400' },
  { label: 'Stimulants',   color: '#FFADA5' },
  { label: 'Psychedelics', color: '#B2FFF1' },
  { label: 'Depressants',  color: '#B3C3D1' },
  { label: 'Opioids',      color: '#FFD0B4' },
  { label: 'Dissociatives',color: '#CCF1FF' },
  { label: 'Empathogens',  color: '#FFBEEA' },
  { label: 'NPS',          color: '#E9FF93' },
];

// TripSit tag → CTRL display category
const TRIPSIT_TO_CTRL: Record<string, string> = {
  stimulant:          'Stimulants',
  psychedelic:        'Psychedelics',
  depressant:         'Depressants',
  benzodiazepine:     'Depressants',
  opioid:             'Opioids',
  dissociative:       'Dissociatives',
  empathogen:         'Empathogens',
  'research-chemical':'NPS',
};

// Keys to exclude from the library
const EXCLUDE_KEYS = new Set([
  'aspirin','paracetamol','ibuprofen','naproxen',
  'l-theanine','5-htp','citalopram','promethazine',
  'melatonin','nicotine',
]);

// ─── Adapt TripSit raw data ───────────────────────────────────────────────────

export function adaptDrugs(raw: Record<string, unknown>): TripSitDrug[] {
  const drugs: TripSitDrug[] = [];
  for (const [key, val] of Object.entries(raw)) {
    if (EXCLUDE_KEYS.has(key)) continue;
    const d = val as Record<string, unknown>;
    const cats = (d.categories as string[] | undefined) ?? [];
    if (!cats.includes('common')) continue;
    const ctrlCats = [...new Set(
      cats.map(c => TRIPSIT_TO_CTRL[c]).filter(Boolean)
    )];
    if (ctrlCats.length === 0) continue;
    drugs.push({
      key,
      pretty_name: (d.pretty_name as string) || key,
      aliases: (d.aliases as string[]) ?? [],
      categories: ctrlCats,
      properties: (d.properties as TripSitDrug['properties']) ?? {},
      formatted_dose: d.formatted_dose as TripSitDrug['formatted_dose'],
      formatted_duration: d.formatted_duration as TripSitDrug['formatted_duration'],
      formatted_onset: d.formatted_onset as TripSitDrug['formatted_onset'],
      formatted_aftereffects: d.formatted_aftereffects as TripSitDrug['formatted_aftereffects'],
      formatted_effects: d.formatted_effects as string[] | undefined,
      dose_note: d.dose_note as string | undefined,
      links: d.links as TripSitDrug['links'],
    });
  }
  return drugs.sort((a, b) => a.pretty_name.localeCompare(b.pretty_name));
}

// ─── Drug Card ────────────────────────────────────────────────────────────────

function DrugCard({ drug, onClick }: { drug: TripSitDrug; onClick?: () => void }) {
  const aliasText = drug.aliases.slice(0, 3).join(', ') || '—';

  return (
    <div
      onClick={onClick}
      style={{
        background: '#171717',
        border: '0.2px solid rgba(241,241,241,0.2)',
        borderRadius: '16px',
        width: '100%',
        overflow: 'hidden',
        padding: '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
      }}
    >
      {/* Art area — fixed aspect ratio */}
      <div style={{ width: '100%', aspectRatio: '4 / 3', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <DrugCardArt drug={drug} />
      </div>

      {/* Info area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#FFFFFF',
            letterSpacing: '0.36px',
            lineHeight: 1.5,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {drug.pretty_name}
          </p>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            color: '#F1F1F1',
            letterSpacing: '0.24px',
            lineHeight: 1.3,
            margin: 0,
            opacity: 0.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {aliasText}
          </p>
        </div>

        {/* Category pills — up to 2 */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', overflow: 'hidden' }}>
          {drug.categories.slice(0, 2).map(cat => {
            const color = DRUG_CATEGORY_COLOR[cat] ?? '#F1F1F1';
            return (
              <div key={cat} style={{
                border: `0.63px solid ${color}`,
                borderRadius: '14px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '10px',
                  color,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}>
                  {cat}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface LibraryPageProps {
  onTabChange: (tab: NavTab) => void;
  onDrugClick?: (drugKey: string) => void;
  onSearchOpen?: () => void;
  onProfileOpen?: () => void;
  drugs: TripSitDrug[];
  savedKeys?: Set<string>;
}

export function LibraryPage({
  onTabChange,
  onDrugClick,
  onSearchOpen,
  onProfileOpen,
  drugs,
  savedKeys = new Set(),
}: LibraryPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All'
    ? drugs
    : activeCategory === 'Saved'
    ? drugs.filter(d => savedKeys.has(d.key))
    : drugs.filter(d => d.categories.includes(activeCategory));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0D0D0D', overflow: 'hidden' }}>

      {/* ── FIXED HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', height: '100%', zIndex: 10 }}>
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
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', margin: 0, lineHeight: 1.5 }}>
              Library
            </p>
            <button
              onClick={onSearchOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Open search"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
                <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        className="hide-scrollbar"
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>

        <div style={{ paddingTop: '56px' }}>
          {/* Category filter strip */}
          <div
            className="hide-scrollbar"
            style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '16px 8px 0' }}
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

          {/* Count label */}
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#F1F1F1', opacity: 0.3, margin: '12px 8px 4px', letterSpacing: '0.24px' }}>
            {filtered.length} {filtered.length === 1 ? 'substance' : 'substances'}
          </p>
        </div>

        {/* Card grid */}
        <div style={{ padding: '8px 8px 116px' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', color: '#F1F1F1', opacity: 0.5, fontFamily: 'Roboto, sans-serif', fontSize: '16px' }}>
              Nothing here yet
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {filtered.map(drug => (
                <DrugCard
                  key={drug.key}
                  drug={drug}
                  onClick={() => onDrugClick?.(drug.key)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab="Library" onTabChange={onTabChange} />
    </div>
  );
}
