import { useState, useEffect } from 'react';
import ctrlLogo from '../../../assets/ctrl-logo.svg';

const STORAGE_KEY = 'ctrl_onboarding_seen';

interface OnboardingScreenProps {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Small delay so fade-in fires after first paint
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      onDone();
    }, 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '72px 24px 52px',
        opacity: visible && !exiting ? 1 : 0,
        transition: exiting
          ? 'opacity 0.4s cubic-bezier(0.55, 0, 1, 0.45)'
          : 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >

      {/* ── TOP: Logo + headline + body ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px', width: '100%' }}>

        {/* Logo */}
        <img
          src={ctrlLogo}
          alt="CTRL"
          style={{ height: '36px', width: 'auto' }}
        />

        {/* Text block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: '28px',
            color: '#F1F1F1',
            letterSpacing: '0.56px',
            lineHeight: 1.3,
            margin: 0,
            textAlign: 'center',
          }}>
            A concept that actually works.
          </p>

          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            color: '#F1F1F1',
            opacity: 0.6,
            letterSpacing: '0.32px',
            lineHeight: 1.6,
            margin: 0,
            textAlign: 'center',
          }}>
            CTRL is a harm reduction app for people who actually use substances — no lectures, no judgment. The drug library, combo checker, and journal are all yours to explore. The Shop and Drug Scan are concepts for now. This is a prototype we're genuinely excited about. <p> Dig in.</p>
          </p>
        </div>

      </div>

      {/* ── BOTTOM: CTA + disclaimer ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>

        {/* CTA button */}
        <button
          onClick={handleDismiss}
          style={{
            width: '100%',
            maxWidth: '320px',
            height: '60px',
            background: '#F1F1F1',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: '#0D0D0D',
            letterSpacing: '0.36px',
            lineHeight: 1.5,
            boxShadow: '0px 1px 2px 0px rgba(5,32,81,0.05)',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Got it, let's go
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#0D0D0D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        {/* Legal disclaimer */}
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '11px',
          color: '#F1F1F1',
          opacity: 0.25,
          letterSpacing: '0.22px',
          lineHeight: 1.6,
          margin: 0,
          textAlign: 'center',
          maxWidth: '300px',
        }}>
          CTRL is a design prototype for educational and harm reduction awareness purposes only. We do not condone illegal activity. The information provided does not constitute medical advice. Use of any substance is at your own risk — we accept no liability for decisions made based on this app.
        </p>

      </div>

    </div>
  );
}

// ── Helper: check if onboarding has been seen ────────────────────────────────
export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}
