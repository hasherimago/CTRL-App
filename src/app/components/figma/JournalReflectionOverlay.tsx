import { useState, useEffect } from 'react';
import type { TripLog } from '../../types/journal';
import svgPaths from '../../../imports/svg-0uazz9hzf3';

const MOOD_LABELS = ['Angry', 'Sad', 'Neutral', 'Happy', 'Euphoric'];
const MOOD_SUBS = ['Frustrated', 'Low', 'Mellow', 'Euforic', 'Transcendent'];

interface JournalReflectionOverlayProps {
  isOpen: boolean;
  draftLog: Partial<TripLog>;
  onDone: (log: TripLog) => void;
  onBack: () => void;
  onClose: () => void;
  /** When provided, switches to edit mode — fields are pre-filled and Save calls onUpdate */
  editLog?: TripLog;
  onUpdate?: (log: TripLog) => void;
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  height: '77px',
  background: 'transparent',
  border: '1px solid rgba(187,187,187,0.8)',
  borderRadius: '10px',
  color: '#F1F1F1',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px',
  lineHeight: '23px',
  padding: '8px 11px',
  resize: 'none',
  outline: 'none',
  boxSizing: 'border-box',
};

export function JournalReflectionOverlay({ isOpen, draftLog, onDone, onBack, onClose, editLog, onUpdate }: JournalReflectionOverlayProps) {
  const [feltGood, setFeltGood] = useState('');
  const [challenging, setChallenging] = useState('');
  const [learned, setLearned] = useState('');
  const [different, setDifferent] = useState('');

  useEffect(() => {
    if (editLog) {
      setFeltGood(editLog.feltGood ?? '');
      setChallenging(editLog.challenging ?? '');
      setLearned(editLog.learned ?? '');
      setDifferent(editLog.different ?? '');
    }
  }, [editLog]);

  const handleDone = () => {
    if (editLog && onUpdate) {
      onUpdate({ ...editLog, feltGood, challenging, learned, different });
      return;
    }
    const newLog: TripLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      mood: MOOD_LABELS[draftLog.moodIndex ?? 3],
      moodSub: MOOD_SUBS[draftLog.moodIndex ?? 3],
      moodIndex: draftLog.moodIndex ?? 3,
      substances: draftLog.substances ?? [],
      locations: draftLog.locations ?? [],
      reasons: draftLog.reasons ?? [],
      bodyFeelings: draftLog.bodyFeelings ?? [],
      feltGood,
      challenging,
      learned,
      different,
    };
    onDone(newLog);
  };

  return (
    <>
      <style>{`
        .ctrl-reflection-textarea::placeholder { color: rgba(235,235,235,0.4); }
      `}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 82,
        background: '#0D0D0D',
        display: isOpen ? 'block' : 'none',
      }}>
        {/* ── HEADER ── */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '83px', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <button onClick={onBack} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Back">
            <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
              <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
            </svg>
          </button>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, whiteSpace: 'nowrap', margin: 0 }}>
            Reflection
          </p>
          <button onClick={onClose} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '100px 16px 140px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>What felt good?</p>
              <textarea className="ctrl-reflection-textarea" style={textareaStyle} value={feltGood} onChange={e => setFeltGood(e.target.value)} placeholder="Share your thoughts here..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>What was challenging?</p>
              <textarea className="ctrl-reflection-textarea" style={textareaStyle} value={challenging} onChange={e => setChallenging(e.target.value)} placeholder="Share your thoughts here..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>What did you learn or take away?</p>
              <textarea className="ctrl-reflection-textarea" style={textareaStyle} value={learned} onChange={e => setLearned(e.target.value)} placeholder="Share your thoughts here..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>Would you do anything differently?</p>
              <textarea className="ctrl-reflection-textarea" style={textareaStyle} value={different} onChange={e => setDifferent(e.target.value)} placeholder="Share your thoughts here..." />
            </div>
          </div>
        </div>

        {/* ── DONE BUTTON ── */}
        <button
          onClick={handleDone}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '24px',
            right: '24px',
            width: 'auto',
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
            boxShadow: '0px 1px 2px 0px rgba(5,32,81,0.05)',
            zIndex: 10,
          }}
        >
          {editLog ? 'Save changes' : 'Save'}
        </button>
      </div>
    </>
  );
}