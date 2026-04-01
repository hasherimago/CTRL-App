import { useState } from 'react';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';
import type { TripSitDrug } from './LibraryPage';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

export interface DrugDetailPageProps {
  drug: TripSitDrug;
  onBack: () => void;
  onTabChange: (tab: NavTab) => void;
  onSearchOpen?: () => void;
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M20 26L10 16L20 6" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
      <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5L16.5 15H1.5L9 1.5z" stroke="#FF5545" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7v3.5" stroke="#FF5545" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9" cy="13" r="0.75" fill="#FF5545" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="#FFD400" strokeWidth="1.3" />
      <path d="M9 8v5" stroke="#FFD400" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.75" fill="#FFD400" />
    </svg>
  );
}

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

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(241,241,241,0.08)', width: '100%' }} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DrugDetailPage({ drug, onBack, onTabChange, onSearchOpen }: DrugDetailPageProps) {
  const [saved, setSaved] = useState(false);

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

  // Build duration/onset rows from formatted fields
  const onsetRows = (() => {
    if (drug.formatted_onset) {
      const unit = drug.formatted_onset._unit === 'minutes' ? 'min' : drug.formatted_onset._unit;
      return [{ label: 'Onset', value: `${drug.formatted_onset.value} ${unit}` }];
    }
    return null;
  })();

  const durationRows = (() => {
    if (drug.formatted_duration) {
      const unit = drug.formatted_duration._unit === 'hours' ? 'h' : drug.formatted_duration._unit;
      return [{ label: 'Duration', value: `${drug.formatted_duration.value} ${unit}` }];
    }
    return null;
  })();

  const afterRows = (() => {
    if (drug.formatted_aftereffects) {
      const unit = drug.formatted_aftereffects._unit === 'hours' ? 'h' : drug.formatted_aftereffects._unit;
      return [{ label: 'After-effects', value: `${drug.formatted_aftereffects.value} ${unit}` }];
    }
    return null;
  })();

  // Dose tiers in order
  const TIER_ORDER = ['Threshold', 'Light', 'Common', 'Strong', 'Heavy'];

  const doseRoutes = drug.formatted_dose
    ? Object.entries(drug.formatted_dose)
    : null;

  const avoidText = drug.properties.avoid ?? null;
  const warningText = drug.properties.warning ?? null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0D0D0D', overflow: 'hidden' }}>

      {/* ── FIXED TOP MENU ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
        }} />
        <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <button
            onClick={onSearchOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Open search"
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        className="hide-scrollbar"
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}
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
                onClick={() => setSaved(s => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: saved ? 1 : 0.6 }}
                aria-label="Save"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={saved ? '#FFD400' : 'none'}>
                  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" stroke={saved ? '#FFD400' : '#F1F1F1'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.6 }}
                aria-label="Share"
              >
                <ShareIcon />
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
                  <div style={{ flexShrink: 0, marginTop: '2px' }}><AlertIcon /></div>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FF5545', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                    {avoidText}
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
                  <div style={{ flexShrink: 0, marginTop: '2px' }}><AlertIcon /></div>
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

                {/* Yellow info note */}
                {drug.properties.dose && (
                  <div style={{
                    background: 'rgba(255,212,0,0.1)',
                    border: '1px solid #FFD400',
                    borderRadius: '8px',
                    padding: '12px 10px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}><InfoIcon /></div>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FFD400', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>
                      {drug.properties.dose}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Durations */}
            {(onsetRows || durationRows || afterRows) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <SectionTitle>Durations</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {onsetRows && (
                    <>
                      <SubLabel>Onset</SubLabel>
                      {onsetRows.map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}
                    </>
                  )}
                  {durationRows && (
                    <>
                      <Divider />
                      <SubLabel>Duration</SubLabel>
                      {durationRows.map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}
                    </>
                  )}
                  {afterRows && (
                    <>
                      <Divider />
                      <SubLabel>After-effects</SubLabel>
                      {afterRows.map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}
                    </>
                  )}
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
        <div style={{ height: `${LAYOUT.CONTENT_BOTTOM_PADDING}px` }} />
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Library" onTabChange={onTabChange} />
    </div>
  );
}
