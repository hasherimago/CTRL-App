import { useEffect } from 'react';

const PILL_VIDEO = 'https://res.cloudinary.com/dglrghiom/video/upload/v1773777444/pill_re1doa.mp4';

interface SuccessScreenProps {
  isFirst: boolean;
  onComplete: () => void;
}

export function SuccessScreen({ onComplete }: SuccessScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0D0D0D',
      zIndex: 83,
    }}>
      {/* Pill video — mix-blend-mode screen removes black background */}
      <video
        src={PILL_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '108px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '402px',
          height: '301px',
          objectFit: 'cover',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* ✓ Logged row */}
      <div style={{
        position: 'absolute',
        top: '421px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12.5px',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          width: '26px',
          height: '26px',
          transform: 'rotate(-0.26deg)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="13" fill="#8C5CFE" />
            <path d="M7 13L11 17L19 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{
          fontFamily: "'TT Travels Next Trial Variable', sans-serif",
          fontWeight: 700,
          fontSize: '26.8px',
          color: 'white',
          letterSpacing: '0.54px',
          lineHeight: 1.5,
          margin: 0,
        }}>
          Your moment is safe
        </p>
      </div>
    </div>
  );
}