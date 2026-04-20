import { useState, useEffect } from 'react';

interface InstallPromptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallPromptOverlay({ isOpen, onClose }: InstallPromptOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        display: isOpen ? 'block' : 'none',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#171717',
          borderRadius: '20px 20px 0 0',
          padding: '20px 16px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Handle bar */}
        <div style={{
          width: '40px',
          height: '4px',
          background: 'rgba(241,241,241,0.3)',
          borderRadius: '100px',
          margin: '0 auto 24px',
          flexShrink: 0,
        }} />

        {/* Title */}
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          color: '#F1F1F1',
          letterSpacing: '0.36px',
          margin: 0,
        }}>
          Save CTRL to your home screen
        </p>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          color: 'rgba(241,241,241,0.4)',
          margin: '8px 0 24px',
        }}>
          Works like a native app — instant access, no browser
        </p>

        {/* Step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {[
            'In Safari, tap the Share icon at the bottom of the screen',
            "Scroll down and tap 'Add to Home Screen', then tap Add",
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '24px',
                height: '24px',
                background: 'rgba(140,92,254,0.15)',
                border: '1px solid #8C5CFE',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '12px',
                color: '#8C5CFE',
                fontWeight: 700,
                fontFamily: 'Roboto, sans-serif',
              }}>
                {i + 1}
              </div>
              <p style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '15px',
                color: '#F1F1F1',
                lineHeight: 1.4,
                margin: 0,
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(241,241,241,0.08)',
          width: '100%',
          marginBottom: '24px',
        }} />

        {/* Done button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              width: '244px',
              height: '60px',
              background: '#F1F1F1',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#0D0D0D',
              letterSpacing: '0.36px',
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
