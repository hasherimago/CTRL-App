import { useEffect, useRef, useState } from 'react';
import svgPaths from '../../../imports/svg-0uazz9hzf3';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistOverlayProps {
  isOpen: boolean;
  items: ChecklistItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ChecklistOverlay({ isOpen, items, onAdd, onToggle, onDelete, onClose }: ChecklistOverlayProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftText, setDraftText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsAdding(false);
      setDraftText('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const commitDraft = () => {
    const trimmed = draftText.trim();
    if (trimmed) onAdd(trimmed);
    setIsAdding(false);
    setDraftText('');
  };

  const startAdding = () => {
    setIsAdding(true);
    setDraftText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = draftText.trim();
      if (trimmed) onAdd(trimmed);
      setDraftText('');
      // keep isAdding true so user can keep typing more
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setDraftText('');
    }
  };

  const showEmpty = items.length === 0 && !isAdding;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: '#0D0D0D',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* ── HEADER ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '83px',
        zIndex: 20, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
      }}>
        <button
          onClick={onClose}
          style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          aria-label="Close"
        >
          <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
            <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
          </svg>
        </button>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: 'white', letterSpacing: '0.36px', lineHeight: 1.5, whiteSpace: 'nowrap', margin: 0 }}>
          Party Checklist
        </p>
        <button
          onClick={onClose}
          style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          aria-label="Save and close"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M26.6666 8L11.9999 22.6667L5.33325 16" stroke="#F1F1F1" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}
        onClick={() => { if (!isAdding) startAdding(); }}
      >
        <div style={{ padding: '100px 24px 140px' }}>

          {showEmpty && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                Nothing here yet
              </p>
            </div>
          )}

          {!showEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid #1E1E1E' }}
                >
                  <button
                    onClick={() => onToggle(item.id)}
                    style={{
                      width: '24px', height: '24px', flexShrink: 0,
                      borderRadius: '4px', border: `2px solid ${item.checked ? '#8C5CFE' : '#555'}`,
                      background: item.checked ? '#8C5CFE' : 'transparent',
                      cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {item.checked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  <p style={{
                    flex: 1, margin: 0,
                    fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px',
                    color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.5,
                    opacity: item.checked ? 0.4 : 1,
                    textDecoration: item.checked ? 'line-through' : 'none',
                  }}>
                    {item.text}
                  </p>

                  <button
                    onClick={() => onDelete(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.4, flexShrink: 0 }}
                    aria-label="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3L13 13M13 3L3 13" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}

              {isAdding && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid #1E1E1E' }}
                >
                  <div style={{ width: '24px', height: '24px', flexShrink: 0, borderRadius: '4px', border: '2px solid #555' }} />
                  <input
                    ref={inputRef}
                    value={draftText}
                    onChange={e => setDraftText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={commitDraft}
                    placeholder="New reminder…"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px',
                      color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.5,
                      caretColor: '#F1F1F1',
                    }}
                  />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── FAB ── */}
      <button
        onClick={e => {
          e.stopPropagation();
          if (isAdding) {
            commitDraft();
          }
          startAdding();
        }}
        style={{
          position: 'fixed', bottom: '40px', right: '24px', zIndex: 81,
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#8C5CFE', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(140, 92, 254, 0.4)',
        }}
        aria-label="Add reminder"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 4V20M4 12H20" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
