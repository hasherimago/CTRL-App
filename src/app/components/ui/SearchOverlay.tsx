import { useEffect, useRef, useState } from 'react';

import imgFentanyl    from 'figma:asset/a8cd061b84cc94e31b4480a72459d9451d40e201.png';
import imgTilidine    from 'figma:asset/265f35c7d228c312571fd9378e870d172ecf9ad7.png';
import imgKetamine    from 'figma:asset/f5502ba7f5b6db5c7eaea8904cdc58247616ce67.png';
import imgMephedrone  from 'figma:asset/37caa7cf43211d15ebdf3fdc7a002e0ae36c234b.png';
import imgMDMA        from 'figma:asset/b7f282cb0401597a3df9104ae60428dd05e2180a.png';
import imgCannabis    from 'figma:asset/5c43ab744872d94da08e20e185de8c7977fc9fdc.png';
import imgCocaine     from 'figma:asset/5b99b9d16ca4c921e699048e6414fe7d22af6ed3.png';
import imgPoppers     from 'figma:asset/bfc20b12edb8c711ad76ca54051c2443f5582e45.png';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEARCH_DATA = [
  { id: 1, name: 'Fentanyl',   aliases: 'Drop Dead - China White - Synthetic heroin', image: imgFentanyl },
  { id: 2, name: 'Tilidine',   aliases: 'Valoron - Valtran - Tilicer',                image: imgTilidine },
  { id: 3, name: 'Ketamine',   aliases: 'Special K - Kit Kat - Cat Valium',           image: imgKetamine },
  { id: 4, name: 'Mephedrone', aliases: '4MMC - Mephi - Meow',                        image: imgMephedrone },
  { id: 5, name: 'MDMA',       aliases: 'Molly - XTC - Mandy',                        image: imgMDMA },
  { id: 6, name: 'Cannabis',   aliases: 'Marijuana - Ganja - Weed',                   image: imgCannabis },
  { id: 7, name: 'Cocaine',    aliases: 'Coke - Candy - Flake',                       image: imgCocaine },
  { id: 8, name: 'Poppers',    aliases: 'Liquid Gold - Snappers - PP',                image: imgPoppers },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrug: (drugId: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchOverlay({ isOpen, onClose, onSelectDrug }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // When a drug is tapped we want the overlay to vanish with zero CSS transition
  // so the drug page appears instantly with no slide effect.
  const [closingInstantly, setClosingInstantly] = useState(false);

  // Reset instant-close flag whenever the overlay opens so the slide-in still works
  useEffect(() => {
    if (isOpen) setClosingInstantly(false);
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelect = (drugId: number) => {
    setQuery('');
    // Kill the CSS transition before isOpen flips to false
    setClosingInstantly(true);
    onSelectDrug(drugId);
    // Reset after one frame (overlay is already off-screen, so no visual change)
    requestAnimationFrame(() => setClosingInstantly(false));
  };

  // Filter logic
  const trimmed = query.toLowerCase().trim();
  const results =
    trimmed === ''
      ? []
      : SEARCH_DATA.filter(
          (d) =>
            d.name.toLowerCase().includes(trimmed) ||
            d.aliases.toLowerCase().includes(trimmed),
        );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#0D0D0D',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        // No transition when instant-closing so the overlay snaps away immediately
        transition: closingInstantly ? 'none' : 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Placeholder + cancel-button styles */}
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
          {/* Magnifying glass */}
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

          {/* Real controlled input — must be type="search" for mobile keyboards */}
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
              // Prevent iOS zoom on focus (font-size must be ≥16px)
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
        {trimmed !== '' && results.length === 0 ? (
          /* Empty state */
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
              key={drug.id}
              onClick={() => handleSelect(drug.id)}
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
              {/* Thumbnail */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '8px',
                  background: '#2D2D2D',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={drug.image}
                  alt={drug.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Text */}
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
                  {drug.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#BBBBBB',
                    letterSpacing: '0.28px',
                    margin: 0,
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {drug.aliases}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}