import { useState, useRef } from 'react';
import svgPaths from '../../../imports/svg-0uazz9hzf3';
import { MoodEmoji } from '../ui/MoodEmoji';
import type { EmojiProps } from '../ui/MoodEmoji';

const MOODS: { face: EmojiProps['face']; label: string; sub: string }[] = [
  { face: 'Angry',   label: 'Angry',    sub: 'Frustrated'   },
  { face: 'Sad',     label: 'Sad',      sub: 'Low'          },
  { face: 'Neutral', label: 'Neutral',  sub: 'Mellow'       },
  { face: 'Happy',   label: 'Happy',    sub: 'Euforic'      },
  { face: 'Super',   label: 'Euphoric', sub: 'Transcendent' },
];

const BODY_FEELINGS = ['Energetic', 'Tension', 'Nausea', 'Clenching', 'Sensual', 'Numbness'];

interface JournalMoodOverlayProps {
  isOpen: boolean;
  onNext: (data: { moodIndex: number; mood: string; moodSub: string; bodyFeelings: string[] }) => void;
  onBack: () => void;
  onClose: () => void;
}

function TagButton({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        border: '1px solid #F1F1F1',
        background: selected ? '#F1F1F1' : 'transparent',
        color: selected ? '#0D0D0D' : '#F1F1F1',
        borderRadius: '18px',
        padding: '8px 12px',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        lineHeight: 1.3,
        letterSpacing: '0.32px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export function JournalMoodOverlay({ isOpen, onNext, onBack, onClose }: JournalMoodOverlayProps) {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [bodyFeelings, setBodyFeelings] = useState<string[]>([]);
  const [extraBodyFeelings, setExtraBodyFeelings] = useState<string[]>([]);

  const [customTagOpen, setCustomTagOpen] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const customTagRef = useRef<HTMLInputElement>(null);

  const handleTap = (index: number) => {
    setSelectedMood(index);
  };

  const toggleFeeling = (f: string) => {
    setBodyFeelings(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleAddCustomTag = () => {
    const value = customTagInput.trim();
    if (!value) return;
    setExtraBodyFeelings(prev => [...prev, value]);
    setBodyFeelings(prev => [...prev, value]);
    setCustomTagInput('');
    setCustomTagOpen(false);
  };

  const handleNext = () => {
    onNext({
      moodIndex: selectedMood,
      mood: MOODS[selectedMood].label,
      moodSub: MOODS[selectedMood].sub,
      bodyFeelings,
    });
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 81,
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
            Mood &amp; Body
          </p>
          <button onClick={onClose} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '100px 16px 140px', display: 'flex', flexDirection: 'column', gap: '50px' }}>

            {/* Section 1 — Mood emoji */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '21px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>
                How did you feel during the experience?
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
                {MOODS.map((mood, index) => (
                  <button
                    key={index}
                    onClick={() => handleTap(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      opacity: 1,
                      transition: 'opacity 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MoodEmoji
                      face={mood.face}
                      selected={selectedMood === index}
                    />
                  </button>
                ))}
              </div>
              {/* Mood label below selected */}
              <p style={{ textAlign: 'center', fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: '#8C5CFE', margin: 0, letterSpacing: '0.32px' }}>
                {MOODS[selectedMood].label}
              </p>
            </div>

            {/* Section 2 — Body feelings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>
                  What did your body feel like?
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14px', lineHeight: 1.5, margin: 0 }}>
                  Any physical sensations or discomfort?
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {[...BODY_FEELINGS, ...extraBodyFeelings].map(f => (
                  <TagButton key={f} label={f} selected={bodyFeelings.includes(f)} onToggle={() => toggleFeeling(f)} />
                ))}
                <button
                  onClick={() => { setCustomTagInput(''); setCustomTagOpen(true); }}
                  style={{ border: '1px solid #F1F1F1', borderRadius: '30px', width: '35px', height: '35px', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1V13M1 7H13" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── NEXT BUTTON ── */}
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '244px',
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
            boxShadow: '0px 1px 2px 0px rgba(5,32,81,0.05)',
            zIndex: 10,
          }}
        >
          Next
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#0D0D0D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        {/* ── CUSTOM TAG MINI OVERLAY ── */}
        {customTagOpen && (
          <>
            {/* Dim backdrop */}
            <div
              onClick={() => setCustomTagOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 90,
              }}
            />

            {/* Mini overlay panel */}
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 91,
              background: '#171717',
              borderRadius: '20px 20px 0 0',
              padding: '24px 16px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {/* Handle bar */}
              <div style={{
                width: '40px',
                height: '4px',
                background: 'rgba(241,241,241,0.3)',
                borderRadius: '100px',
                margin: '0 auto 8px',
              }} />

              {/* Label */}
              <p style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#F1F1F1',
                margin: 0,
                letterSpacing: '0.36px',
              }}>
                Add custom tag
              </p>

              {/* Text input */}
              <input
                ref={customTagRef}
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="Type your tag..."
                autoFocus
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(241,241,241,0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '16px',
                  color: '#F1F1F1',
                  outline: 'none',
                  letterSpacing: '0.32px',
                  caretColor: '#8C5CFE',
                }}
              />

              {/* Add button */}
              <button
                onClick={handleAddCustomTag}
                style={{
                  background: customTagInput.trim() ? '#8C5CFE' : 'rgba(140,92,254,0.3)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '56px',
                  width: '100%',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#F1F1F1',
                  cursor: customTagInput.trim() ? 'pointer' : 'default',
                  letterSpacing: '0.36px',
                  transition: 'background 0.15s ease',
                }}
              >
                Add tag
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}