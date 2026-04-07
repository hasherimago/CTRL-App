import { useState, useRef } from 'react';
import { db } from '../../../db';

interface AuthBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function Spinner() {
  return (
    <div style={{
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.25)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'auth-sheet-spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

export function AuthBottomSheet({ isOpen, onClose, onSuccess }: AuthBottomSheetProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartY = useRef(0);

  const reset = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSendCode = async () => {
    const trimmed = email.trim();
    if (!trimmed) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      await db.auth.sendMagicCode({ email: trimmed });
      setStep('code');
    } catch (e: any) {
      setError(e?.body?.message || e?.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) { setError('Please enter the code.'); return; }
    setLoading(true);
    setError('');
    try {
      await db.auth.signInWithMagicCode({ email: email.trim(), code: trimmedCode });
      reset();
      onSuccess();
    } catch (e: any) {
      setError(e?.body?.message || e?.message || 'Invalid code. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await db.auth.sendMagicCode({ email: email.trim() });
    } catch (e: any) {
      setError(e?.body?.message || e?.message || 'Failed to resend.');
    } finally {
      setLoading(false);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setDragY(delta);
  };
  const onTouchEnd = () => {
    setDragging(false);
    if (dragY > 90) {
      setDragY(0);
      handleClose();
    } else {
      setDragY(0);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1E1E1E',
    border: `1px solid ${error ? '#FF5545' : '#2A2A2A'}`,
    borderRadius: '12px',
    padding: '14px 16px',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    color: '#F1F1F1',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const primaryBtn: React.CSSProperties = {
    width: '100%',
    height: '52px',
    background: loading ? 'rgba(140,92,254,0.55)' : '#8C5CFE',
    border: 'none',
    borderRadius: '12px',
    cursor: loading ? 'default' : 'pointer',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'background 0.2s ease',
  };

  return (
    <>
      <style>{`@keyframes auth-sheet-spin { to { transform: rotate(360deg); } } .auth-sheet-input::placeholder { color: rgba(241,241,241,0.4); }`}</style>

      {/* Dark overlay — tap to dismiss */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* Sheet */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 201,
          background: '#171717',
          borderRadius: '20px 20px 0 0',
          padding: '20px 16px 48px',
          transform: isOpen ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragging ? 'none' : 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: '36px', height: '4px', background: '#2D2D2D', borderRadius: '2px', margin: '0 auto 28px', cursor: 'grab' }} />

        {step === 'email' ? (
          <>
            <h2 style={{ fontFamily: 'Sora Variable, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#F1F1F1', margin: '0 0 8px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              Sign in to CTRL
            </h2>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: 'rgba(241,241,241,0.4)', margin: '0 0 24px', lineHeight: 1.5 }}>
              Enter your email. We'll send you a code — no password needed.
            </p>

            <input
              className="auth-sheet-input"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSendCode()}
              placeholder="your@email.com"
              style={{ ...inputStyle, marginBottom: error ? '8px' : '24px' }}
              autoFocus
            />
            {error && (
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#FF5545', margin: '0 0 16px', lineHeight: 1.4 }}>{error}</p>
            )}

            <button onClick={handleSendCode} disabled={loading} style={primaryBtn}>
              {loading ? <Spinner /> : 'Send Code'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Sora Variable, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#F1F1F1', margin: '0 0 8px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              Check your inbox
            </h2>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: 'rgba(241,241,241,0.4)', margin: '0 0 24px', lineHeight: 1.5 }}>
              We sent a 6-digit code to{' '}
              <span style={{ color: 'rgba(241,241,241,0.7)' }}>{email}</span>
            </p>

            <input
              className="auth-sheet-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && !loading && handleVerify()}
              placeholder="000000"
              style={{ ...inputStyle, letterSpacing: '0.3em', marginBottom: error ? '8px' : '24px' }}
              autoFocus
            />
            {error && (
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#FF5545', margin: '0 0 16px', lineHeight: 1.4 }}>{error}</p>
            )}

            <button onClick={handleVerify} disabled={loading} style={{ ...primaryBtn, marginBottom: '16px' }}>
              {loading ? <Spinner /> : 'Verify'}
            </button>

            <button
              onClick={handleResend}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: loading ? 'default' : 'pointer',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px',
                color: loading ? 'rgba(140,92,254,0.45)' : '#8C5CFE',
                display: 'block',
                margin: '0 auto',
                padding: '8px 16px',
              }}
            >
              Resend code
            </button>
          </>
        )}
      </div>
    </>
  );
}
