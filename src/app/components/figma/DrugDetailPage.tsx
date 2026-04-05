import { BottomNav } from '../ui/BottomNav';
import type { TripSitDrug } from './LibraryPage';


// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

export interface DrugDetailPageProps {
  drug: TripSitDrug;
  onBack: () => void;
  onTabChange: (tab: NavTab) => void;
  onSearchOpen?: () => void;
  isSaved?: boolean;
  onSaveToggle?: (drugKey: string) => void;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  Stimulants:   '#FFADA5',
  Psychedelics: '#B2FFF1',
  Depressants:  '#B3C3D1',
  Opioids:      '#FFD0B4',
  Dissociatives:'#CCF1FF',
  Empathogens:  '#FFBEEA',
  NPS:          '#E9FF93',
};

// Dosage tier colors — green → yellow → orange (matching Figma exactly)
const DOSE_COLORS: Record<string, string> = {
  Threshold: '#99DD11',
  Light:     '#AAFF00',
  Common:    '#FFD400',
  Strong:    '#FF8C00',
  Heavy:     '#FF6A00',
};

const DOSE_DOT_COLORS: Record<string, string> = {
  Threshold: '#99DD11',
  Light:     '#AAFF00',
  Common:    '#FFD400',
  Strong:    '#FF8C00',
  Heavy:     '#FF6A00',
};

// ─── Icons — imported from shared icon system ─────────────────────────────────

import {
  IconBack,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconShare,
  IconAlert,
  IconInfo,
} from '../ui/icons/Icons';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 700,
      fontSize: '18px',
      color: '#FFFFFF',
      letterSpacing: '0.36px',
      lineHeight: 1.5,
      margin: 0,
    }}>
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0, flexShrink: 0 }}>
        {value}
      </p>
    </div>
  );
}

function DoseRow({ tier, value }: { tier: string; value: string }) {
  const color = DOSE_COLORS[tier] ?? '#F1F1F1';
  const dotColor = DOSE_DOT_COLORS[tier] ?? '#F1F1F1';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
          {tier}
        </p>
      </div>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color, letterSpacing: '0.32px', lineHeight: 1.3, margin: 0, flexShrink: 0 }}>
        {value}
      </p>
    </div>
  );
}

function SubLabel({ children }: { children: string }) {
  return (
    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.4, letterSpacing: '0.32px', lineHeight: 1.3, margin: 0, width: '100%' }}>
      {children}
    </p>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────

export function DrugDetailPage({ drug, onBack, onTabChange, onSearchOpen, isSaved = false, onSaveToggle }: DrugDetailPageProps) {



  const primaryCat = drug.categories[0];
  const primaryColor = CATEGORY_COLOR[primaryCat] ?? '#F1F1F1';

  // Build detection rows from properties.detection string
  const detectionRows = (() => {
    const raw = drug.properties.detection;
    if (!raw) return null;
    // Try to parse "Blood: 12h, Saliva: 6-12h, Urine: 6-24h" style strings
    const rows: { label: string; value: string }[] = [];
    const parts = raw.split(/[,;]\s*/);
    for (const part of parts) {
      const m = part.match(/^([^:]+):\s*(.+)$/);
      if (m) rows.push({ label: m[1].trim(), value: m[2].trim() });
    }
    return rows.length > 0 ? rows : null;
  })();

  // Parse a formatted timing field into per-route rows.
  // Handles both { _unit, value } (single, no route) and { _unit, Oral: "x", Insufflated: "y" } (per-route).
  function parseTiming(field: Record<string, string> | undefined): { route: string | null; value: string }[] | null {
    if (!field) return null;
    const unit = field._unit === 'hours' ? 'h' : field._unit === 'minutes' ? 'min' : field._unit;
    if (field.value) {
      return [{ route: null, value: `${field.value} ${unit}` }];
    }
    const routes = Object.keys(field).filter(k => k !== '_unit');
    if (routes.length === 0) return null;
    return routes.map(r => ({ route: r, value: `${field[r]} ${unit}` }));
  }

  const onsetData    = parseTiming(drug.formatted_onset);
  const durationData = parseTiming(drug.formatted_duration);
  const afterData    = parseTiming(drug.formatted_aftereffects);

  // Collect all unique routes across all three timing fields (null = no specific route)
  const timingRoutes = (() => {
    const routes = new Set<string | null>();
    for (const data of [onsetData, durationData, afterData]) {
      data?.forEach(r => routes.add(r.route));
    }
    return [...routes];
  })();

  // Dose tiers in order
  const TIER_ORDER = ['Threshold', 'Light', 'Common', 'Strong', 'Heavy'];

  const doseRoutes = drug.formatted_dose
    ? Object.entries(drug.formatted_dose)
    : null;

  const avoidText = drug.properties.avoid ?? null;
  const warningText = drug.properties.warning ?? null;

  // Use the dedicated dose_note field from TripSit data
  const doseNote = drug.dose_note ?? null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0D0D0D', overflow: 'hidden' }}>

      {/* ── FIXED TOP MENU ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        {/* Layer 1: blur with gradient mask — fades out downward */}
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }} />
        {/* Layer 2: solid background fading to transparent */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Go back"
          >
            <IconBack />
          </button>
          <button
            onClick={onSearchOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Open search"
          >
            <IconSearch />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        className="hide-scrollbar"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '83px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>

        {/* Main card */}
        <div style={{
          margin: '56px 8px 0',
          background: '#171717',
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}>

          {/* ── HEADER ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Save + Share */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
            <button
            onClick={() => onSaveToggle?.(drug.key)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label={isSaved ? 'Unsave' : 'Save'}
            >
          {isSaved ? <IconStarFilled /> : <IconStar />}
          </button>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.6 }}
                aria-label="Share"
              >
                <IconShare />
              </button>
            </div>

            {/* Name block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{
                fontFamily: "'TT Travels Next Trial Variable', 'Roboto', sans-serif",
                fontWeight: 700,
                fontSize: '32px',
                color: '#F1F1F1',
                letterSpacing: '0.64px',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {drug.pretty_name}
              </p>
              {drug.aliases.length > 0 && (
                <p style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#F1F1F1',
                  opacity: 0.4,
                  letterSpacing: '0.32px',
                  lineHeight: 1.3,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {drug.aliases.slice(0, 5).join(', ')}
                </p>
              )}
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {drug.categories.map(cat => {
                const color = CATEGORY_COLOR[cat] ?? '#F1F1F1';
                return (
                  <div key={cat} style={{
                    border: `1px solid ${color}`,
                    borderRadius: '18px',
                    padding: '10px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color, letterSpacing: '0.24px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                      {cat}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '42px' }}>

            {/* Summary section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {drug.properties.summary && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                  {drug.properties.summary}
                </p>
              )}

              {/* Red alert: avoid */}
              {avoidText && (
                <div style={{
                  background: 'rgba(255,85,69,0.1)',
                  border: '1px solid #FF5545',
                  borderRadius: '8px',
                  padding: '12px 10px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}><IconAlert /></div>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FF5545', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                    <span style={{ fontWeight: 700 }}>Avoid: </span>{avoidText}
                  </p>
                </div>
              )}

              {/* Red alert: warning */}
              {warningText && !avoidText && (
                <div style={{
                  background: 'rgba(255,85,69,0.1)',
                  border: '1px solid #FF5545',
                  borderRadius: '8px',
                  padding: '12px 10px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}><IconAlert /></div>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FF5545', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                    {warningText}
                  </p>
                </div>
              )}
            </div>

            {/* Detection */}
            {detectionRows && detectionRows.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <SectionTitle>Detection</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {detectionRows.map(row => (
                    <InfoRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>
              </div>
            )}

            {/* Dosages */}
            {doseRoutes && doseRoutes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <SectionTitle>Dosages</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {doseRoutes.map(([route, tiers]) => {
                    const orderedTiers = TIER_ORDER.filter(t => tiers[t]);
                    if (orderedTiers.length === 0) return null;
                    return (
                      <div key={route} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        <SubLabel>{route}</SubLabel>
                        {orderedTiers.map(tier => (
                          <DoseRow key={tier} tier={tier} value={tiers[tier]} />
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Yellow info note — only the NOTE portion, not the tier list */}
                {doseNote && (
                  <div style={{
                    background: 'rgba(255,212,0,0.1)',
                    border: '1px solid #FFD400',
                    borderRadius: '8px',
                    padding: '12px 10px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}><IconInfo /></div>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FFD400', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                      {doseNote}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Durations */}
            {(onsetData || durationData || afterData) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <SectionTitle>Durations</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {timingRoutes.map(route => (
                    <div key={route ?? 'default'} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                      {route && <SubLabel>{route}</SubLabel>}
                      {onsetData?.filter(r => r.route === route).map(r => (
                        <InfoRow key="onset" label="Onset" value={r.value} />
                      ))}
                      {durationData?.filter(r => r.route === route).map(r => (
                        <InfoRow key="duration" label="Duration" value={r.value} />
                      ))}
                      {afterData?.filter(r => r.route === route).map(r => (
                        <InfoRow key="after" label="After-effects" value={r.value} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Effects */}
            {drug.properties.effects && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <SectionTitle>Effects</SectionTitle>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.8, letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                  {drug.properties.effects}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: '32px' }} />
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Library" onTabChange={onTabChange} />
    </div>
  );
}
