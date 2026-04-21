import { useState, useRef } from 'react';
import { id } from '@instantdb/react';
import svgPaths from '../../../imports/svg-0uazz9hzf3';
import { db } from '../../../db';

interface JournalContextOverlayProps {
  isOpen: boolean;
  onNext: (data: { substances: string[]; locations: string[]; reasons: string[] }) => void;
  onBack: () => void;
  onClose: () => void;
}

const SUBSTANCES = ['MDMA', 'GHB', 'LSD', 'Cocaine', '2C-B', 'Alcohol', 'Ketamine', 'Cannabis'];
const LOCATIONS = ['Club', 'Home', 'Nature', 'Solo', 'Date', 'Sex', 'Festival', 'Office'];
const REASONS = ['Curiosity', 'Fun', 'Connection', 'Healing', 'Escape', 'Creativity'];

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

function PlusButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: '1px solid #F1F1F1',
        borderRadius: '30px',
        width: '35px',
        height: '35px',
        background: 'transparent',
        color: '#F1F1F1',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
      }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1V13M1 7H13" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function TagSection({
  title,
  tags,
  selected,
  onToggle,
  showPlus = true,
  onPlusClick,
}: {
  title: string;
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  showPlus?: boolean;
  onPlusClick?: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', lineHeight: 1.5, margin: 0 }}>{title}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {tags.map(tag => (
          <TagButton key={tag} label={tag} selected={selected.includes(tag)} onToggle={() => onToggle(tag)} />
        ))}
        {showPlus && <PlusButton onClick={onPlusClick ?? (() => {})} />}
      </div>
    </div>
  );
}

export function JournalContextOverlay({ isOpen, onNext, onBack, onClose }: JournalContextOverlayProps) {
  const [substances, setSubstances] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);

  // Custom tags persisted in DB
  const { user } = db.useAuth();
  const { data: ctData } = db.useQuery(
    user
      ? { customTags: { $: { where: { 'owner.id': user.id } } } }
      : { customTags: {} }
  );
  const allCustomTags = (ctData?.customTags ?? []) as { value: string; section: string }[];
  const extraSubstances = allCustomTags.filter(t => t.section === 'substances').map(t => t.value);
  const extraLocations  = allCustomTags.filter(t => t.section === 'locations').map(t => t.value);
  const extraReasons    = allCustomTags.filter(t => t.section === 'reasons').map(t => t.value);

  // Drag-down-to-close for the custom tag panel
  const panelRef = useRef<HTMLDivElement>(null);
  const panelDragStartY = useRef(0);
  const panelDragging = useRef(false);

  const onPanelTouchStart = (e: React.TouchEvent) => {
    panelDragStartY.current = e.touches[0].clientY;
    panelDragging.current = true;
    if (panelRef.current) panelRef.current.style.transition = 'none';
  };

  const onPanelTouchMove = (e: React.TouchEvent) => {
    if (!panelDragging.current) return;
    const dy = e.touches[0].clientY - panelDragStartY.current;
    if (dy > 0 && panelRef.current) panelRef.current.style.transform = `translateY(${dy}px)`;
  };

  const onPanelTouchEnd = () => {
    if (!panelDragging.current) return;
    panelDragging.current = false;
    const el = panelRef.current;
    if (!el) return;
    const rawY = el.style.transform.match(/translateY\((\d+(?:\.\d+)?)px\)/)?.[1];
    const currentY = rawY ? parseFloat(rawY) : 0;
    if (currentY > 80) {
      el.style.transition = 'transform 0.25s ease';
      el.style.transform = 'translateY(110%)';
      setTimeout(() => setCustomTagOverlay({ open: false, section: null }), 250);
    } else {
      el.style.transition = 'transform 0.25s ease';
      el.style.transform = 'translateY(0)';
    }
  };

  const [customTagOverlay, setCustomTagOverlay] = useState<{
    open: boolean;
    section: 'substances' | 'locations' | 'reasons' | null;
  }>({ open: false, section: null });
  const [customTagInput, setCustomTagInput] = useState('');
  const customTagRef = useRef<HTMLInputElement>(null);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (tag: string) => {
    setter(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
  };

  const handleAddCustomTag = () => {
    const value = customTagInput.trim();
    if (!value || !customTagOverlay.section) return;

    const section = customTagOverlay.section;
    const tagId = id();
    if (user) {
      db.transact(db.tx.customTags[tagId].update({ value, section }).link({ owner: user.id }));
    } else {
      db.transact(db.tx.customTags[tagId].update({ value, section }));
    }

    if (section === 'substances') setSubstances(prev => [...prev, value]);
    else if (section === 'locations') setLocations(prev => [...prev, value]);
    else if (section === 'reasons') setReasons(prev => [...prev, value]);

    setCustomTagInput('');
    setCustomTagOverlay({ open: false, section: null });
  };

  const handleNext = () => {
    onNext({ substances, locations, reasons });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      background: '#0D0D0D',
      transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: isOpen ? 'auto' : 'none',
    }}>
      {/* ── HEADER ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '83px', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <button onClick={onBack} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Back">
          <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
            <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
          </svg>
        </button>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, whiteSpace: 'nowrap', margin: 0 }}>
          Substance &amp; Context
        </p>
        <button onClick={onClose} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '100px 16px 140px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <TagSection
            title="What substance(s) did you use?"
            tags={[...SUBSTANCES, ...extraSubstances]}
            selected={substances}
            onToggle={toggle(setSubstances)}
            onPlusClick={() => { setCustomTagInput(''); setCustomTagOverlay({ open: true, section: 'substances' }); }}
          />
          <TagSection
            title="Where were you?"
            tags={[...LOCATIONS, ...extraLocations]}
            selected={locations}
            onToggle={toggle(setLocations)}
            onPlusClick={() => { setCustomTagInput(''); setCustomTagOverlay({ open: true, section: 'locations' }); }}
          />
          <TagSection
            title="Why did you decide to take it?"
            tags={[...REASONS, ...extraReasons]}
            selected={reasons}
            onToggle={toggle(setReasons)}
            onPlusClick={() => { setCustomTagInput(''); setCustomTagOverlay({ open: true, section: 'reasons' }); }}
          />
        </div>
      </div>

      {/* ── NEXT BUTTON ── */}
      <button
        onClick={handleNext}
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
      {customTagOverlay.open && (
        <>
          {/* Dim backdrop */}
          <div
            onClick={() => setCustomTagOverlay({ open: false, section: null })}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 90,
            }}
          />

          {/* Mini overlay panel */}
          <div
            ref={panelRef}
            onTouchStart={onPanelTouchStart}
            onTouchMove={onPanelTouchMove}
            onTouchEnd={onPanelTouchEnd}
            style={{
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
  );
}