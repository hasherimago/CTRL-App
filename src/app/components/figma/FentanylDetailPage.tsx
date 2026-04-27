import { useState } from 'react';
import svgPaths from '../../../imports/svg-0uazz9hzf3';
import imgFentanyl from 'figma:asset/bfd3e76b46a5ec5958e672af5172169bc80bc800.png';
import { BottomNav } from '../ui/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface FentanylDetailPageProps {
  onBack: () => void;
  onTabChange: (tab: NavTab) => void;
  onSearchOpen?: () => void;
}

// ─── Section data ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'effect',
    title: 'Effect',
    content:
      'Fentanyl produces intense euphoria, pain relief, sedation, and a sense of deep relaxation. It activates opioid receptors in the brain, releasing dopamine and creating feelings of warmth and pleasure. Effects include drowsiness, confusion, nausea, and critically — slowed breathing. Onset depends heavily on the route of administration: intravenous use produces near-instant effects, while patches release the drug slowly over 72 hours.',
  },
  {
    id: 'dosage',
    title: 'Dosage',
    content:
      'Fentanyl is extremely potent — therapeutic doses are measured in micrograms (μg), not milligrams. Medical doses range from 25–200 μg depending on the form and patient tolerance. Street fentanyl has no consistent dosage — even a tiny amount (2 μg) can be lethal for a non-tolerant person. Never use alone, and always test your supply with a fentanyl test strip before use.',
  },
  {
    id: 'risks',
    title: 'Risks',
    content:
      'The primary risk is fatal respiratory depression — breathing slows to a stop. Overdose can occur even with a single dose in non-tolerant users. Other risks include physical dependence forming within days, severe withdrawal symptoms, and contamination of other street drugs with fentanyl. Analogs like carfentanil are up to 100× more potent and increasingly common in the supply.',
  },
  {
    id: 'safer-use',
    title: 'Safer Use',
    content:
      "Always carry naloxone (Narcan) and ensure someone nearby knows how to administer it. Never use alone — have a trusted person present. Test your supply using fentanyl test strips before every use. Start with an extremely small amount. Avoid mixing with alcohol, benzodiazepines, or other depressants. If an overdose occurs, administer naloxone immediately, place the person in the recovery position, and call emergency services.",
  },
  {
    id: 'mixed-use',
    title: 'Mixed use',
    content:
      'Combining fentanyl with any other central nervous system depressant dramatically increases overdose risk. Alcohol, benzodiazepines (Xanax, Valium), gabapentin, and other opioids all amplify respiratory depression — this combination is responsible for the majority of opioid overdose deaths. Stimulants may mask sedation, leading to dangerous redosing. Even cannabis can impair judgment around dose management.',
  },
  {
    id: 'extender',
    title: 'Extender',
    content:
      'Fentanyl is frequently used as an adulterant in other street drugs including heroin, cocaine, MDMA, and counterfeit pills (fake Xanax, Adderall). Because it is so potent, microscopic traces can cause overdose in users who are not opioid-tolerant. Always test any street drug with a fentanyl test strip before use — this is a critical harm reduction practice that saves lives.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function FentanylDetailPage({ onBack, onTabChange, onSearchOpen }: FentanylDetailPageProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

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
      {/* ── FIXED HEADER — 3-layer blur ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        {/* Layer 1: blur with gradient mask */}
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
        {/* Layer 2: solid → transparent gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Layer 3: content */}
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
          bottom: 0,
          left: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Hero image area */}
        <div
          style={{
            paddingTop: '56px',
            height: '320px',
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src={imgFentanyl}
            alt="Fentanyl"
            style={{
              width: '284px',
              height: '284px',
              objectFit: 'cover',
              pointerEvents: 'none',
              position: 'absolute',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* Info card */}
        <div
          style={{
            position: 'relative',
            background: '#171717',
            borderRadius: '20px',
            margin: '0 8px 32px',
            padding: '16px',
          }}
        >
          {/* Share icon */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d={svgPaths.p1fbe6e80} fill="#F1F1F1" />
                <path d={svgPaths.p378ae500} fill="#F1F1F1" />
              </svg>
            </button>
          </div>

          {/* Title + aliases */}
          <div style={{ marginBottom: '16px' }}>
            <h1
              style={{
                fontFamily: "'TT Travels Next Trial Variable', sans-serif",
                fontWeight: 700,
                fontSize: '32px',
                color: '#F1F1F1',
                letterSpacing: '0.64px',
                lineHeight: 1.5,
                margin: '0 0 8px 0',
              }}
            >
              Fentanyl
            </h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {['Drop Dead', 'China White', 'Synthetic heroin'].map((alias) => (
                <p
                  key={alias}
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#F1F1F1',
                    opacity: 0.4,
                    margin: 0,
                    letterSpacing: '0.32px',
                    lineHeight: 1.3,
                  }}
                >
                  {alias}
                </p>
              ))}
            </div>
          </div>

          {/* Opioids tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              border: '1px solid #FFD0B4',
              borderRadius: '100px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#FFD0B4',
                letterSpacing: '0.32px',
                lineHeight: 1.3,
              }}
            >
              Opioids
            </span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#F1F1F1',
                letterSpacing: '0.32px',
                lineHeight: 1.3,
                margin: '0 0 12px 0',
              }}
            >
              Fentanyl is an analgesic used to treat very severe and chronic pain and belongs to the
              group of opioid analgesics. Opioids are chemically synthesized substances that have the
              same mechanism of action as natural opiates (morphine and codeine).
            </p>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#F1F1F1',
                letterSpacing: '0.32px',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Fentanyl has an effect up to 100 times stronger than morphine and is one of the
              strongest painkillers available.
            </p>
          </div>

          {/* Expandable sections */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SECTIONS.map((section, idx) => (
              <div key={section.id}>
                {idx > 0 && (
                  <div
                    style={{
                      height: '1px',
                      background: 'rgba(241,241,241,0.1)',
                    }}
                  />
                )}
                <div style={{ padding: '16px 0' }}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#FFFFFF',
                        letterSpacing: '0.36px',
                        lineHeight: 1.5,
                        margin: 0,
                        textAlign: 'left',
                      }}
                    >
                      {section.title}
                    </p>

                    {/* Plus icon — rotates 45° to become × when open */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.2s ease',
                        transform: openSection === section.id ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d={svgPaths.p2f92f800} fill="#F1F1F1" />
                        <path
                          clipRule="evenodd"
                          d={svgPaths.p1acbbd80}
                          fill="#F1F1F1"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {openSection === section.id && (
                    <div style={{ paddingTop: '12px' }}>
                      <p
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 400,
                          fontSize: '15px',
                          color: '#F1F1F1',
                          letterSpacing: '0.3px',
                          lineHeight: 1.6,
                          margin: 0,
                          opacity: 0.8,
                        }}
                      >
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacing so content clears the nav bar */}
        <div style={{ height: '32px' }} />
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Library" onTabChange={onTabChange} />
    </div>
  );
}