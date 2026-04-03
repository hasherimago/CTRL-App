import { useEffect, useRef, useState, useMemo } from 'react';
import type { TripSitDrug } from '../figma/LibraryPage';
import { DrugCardArt } from './DrugCardArt';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrug: (drugKey: string) => void;
  drugs?: TripSitDrug[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchOverlay({ isOpen, onClose, onSelectDrug, drugs }: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || !drugs?.length) return [];
    const q = query.toLowerCase();
    return drugs
      .filter(d =>
        d.pretty_name.toLowerCase().includes(q) ||
        d.aliases.some(a => a.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [query, drugs]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [closingInstantly, setClosingInstantly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setClosingInstantly(false);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  // ── FIX: accept string key, not number ──
  const handleSelect = (drugKey: string) => {
    setQuery('');
    setClosingInstantly(true);
    onSelectDrug(drugKey);
    requestAnimationFrame(() => setClosingInstantly(false));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#0D0D0D',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: closingInstantly ? 'none' : 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <style>{`
        [data-search-input]::placeholder {
          color: rgba(241, 241, 241, 0.4);
        }
        [data-search-input]::-webkit-search-cancel-button {
          display: none;
        }
        [data-search-input]::-webkit-search-decoration {
          display: none;
        }
      `}</style>

      {/* ── Row 1: Search bar + Cancel ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 8px 0',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        {/* Input pill */}
        <div
          style={{
            flex: 1,
            height: '40px',
            border: '1px solid #BBBBBB',
            borderRadius: '30px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxSizing: 'border-box',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="7" stroke="#BBBBBB" strokeWidth="1.67" />
            <path
              d="M14.5 14.5L18.5 18.5"
              stroke="#BBBBBB"
              strokeWidth="1.67"
              strokeLinecap="round"
            />
          </svg>

          <input
            ref={inputRef}
            data-search-input="true"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search substances..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              color: '#F1F1F1',
              letterSpacing: '0.32px',
              caretColor: '#F1F1F1',
              minWidth: 0,
              WebkitAppearance: 'none',
            }}
          />
        </div>

        {/* Cancel */}
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: "'SF Pro', -apple-system, sans-serif",
            fontWeight: 400,
            fontSize: '14px',
            color: '#EBEBEB',
            letterSpacing: '-0.44px',
            lineHeight: '23px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Cancel
        </button>
      </div>

      {/* ── Results list ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '16px' }}>
        {query.trim() !== '' && results.length === 0 ? (
          <p
            style={{
              color: '#F1F1F1',
              opacity: 0.4,
              textAlign: 'center',
              paddingTop: '40px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              margin: 0,
            }}
          >
            No results for &ldquo;{query}&rdquo;
          </p>
        ) : (
          results.map((drug) => (
            <button
              key={drug.key}
              // ── FIX: pass string key directly ──
              onClick={() => handleSelect(drug.key)}
              style={{
                width: '100%',
                padding: '0 8px',
                gap: '11px',
                display: 'flex',
                alignItems: 'center',
                height: '70px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                flexShrink: 0,
              }}
            >
              {/* ── Generative art thumbnail ── */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '8px',
                  background: '#2D2D2D',
                  flexShrink: 0,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <DrugCardArt drug={drug} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#F1F1F1',
                    letterSpacing: '0.32px',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {drug.pretty_name}
                </p>

                {drug.aliases.length > 0 && (
                  <p
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#BBBBBB',
                      letterSpacing: '0.28px',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {drug.aliases.slice(0, 4).join(' - ')}
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
