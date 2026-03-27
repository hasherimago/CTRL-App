import { useState } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';

import imgFentanyl00013 from 'figma:asset/a8cd061b84cc94e31b4480a72459d9451d40e201.png';
import imgImage88      from 'figma:asset/265f35c7d228c312571fd9378e870d172ecf9ad7.png';
import imgFentanyl00011 from 'figma:asset/f5502ba7f5b6db5c7eaea8904cdc58247616ce67.png';
import imgImage30      from 'figma:asset/37caa7cf43211d15ebdf3fdc7a002e0ae36c234b.png';
import imgImage84      from 'figma:asset/b7f282cb0401597a3df9104ae60428dd05e2180a.png';
import imgImage85      from 'figma:asset/5c43ab744872d94da08e20e185de8c7977fc9fdc.png';
import imgImage86      from 'figma:asset/5b99b9d16ca4c921e699048e6414fe7d22af6ed3.png';
import imgImage87      from 'figma:asset/bfc20b12edb8c711ad76ca54051c2443f5582e45.png';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tag {
  label: string;
  color: string;
}

interface Drug {
  id: number;
  name: string;
  aliases: string;
  tags: Tag[];
  categories: string[]; // for filtering
}

// ─── Drug data ─────────────────────────────────────────────────────────────

const DRUGS: Drug[] = [
  {
    id: 1,
    name: 'Fentanyl',
    aliases: 'Drop Dead | China White',
    tags: [{ label: 'Opioids', color: '#FFD0B4' }],
    categories: ['Opioids'],
  },
  {
    id: 2,
    name: 'Tilidine',
    aliases: 'Valoron | Valtran | Tilicer',
    tags: [{ label: 'Opioids', color: '#FFD0B4' }],
    categories: ['Opioids'],
  },
  {
    id: 3,
    name: 'Ketamine',
    aliases: 'Special K | Kit Kat | Cat Valium',
    tags: [{ label: 'Dissociatives', color: '#CCF1FF' }],
    categories: ['Dissociatives'],
  },
  {
    id: 4,
    name: 'Mephedrone',
    aliases: '4MMC | Mephi | Meow',
    tags: [{ label: 'Stimulants', color: '#FFADA5' }],
    categories: ['Stimulants'],
  },
  {
    id: 5,
    name: 'MDMA',
    aliases: 'Molly | XTC | Mandy',
    tags: [{ label: 'Psychedelics', color: '#B2FFF1' }],
    categories: ['Psychedelics'],
  },
  {
    id: 6,
    name: 'Cannabis',
    aliases: 'Marijuana | Ganja | Weed',
    tags: [{ label: 'Cannabinoids', color: '#CBFFC6' }],
    categories: ['Cannabinoids'],
  },
  {
    id: 7,
    name: 'Cocaine',
    aliases: 'Coke | Candy | Flake',
    tags: [{ label: 'Stimulants', color: '#FFADA5' }],
    categories: ['Stimulants'],
  },
  {
    id: 8,
    name: 'Poppers',
    aliases: 'Liquid Gold | Snappers | PP',
    tags: [
      { label: 'Inhalants', color: '#EEEEEE' },
    ],
    categories: ['Inhalants'],
  },
];

// ─── Category tags ────────────────────────────────────────────────────────────

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'All',          color: '#8C5CFE' },
  { label: 'Depressants',  color: '#B3C3D1' },
  { label: 'Stimulants',   color: '#FFADA5' },
  { label: 'Psychedelics', color: '#B2FFF1' },
  { label: 'Opioids',      color: '#FFD0B4' },
  { label: 'Dissociatives',color: '#CCF1FF' },
  { label: 'Cannabinoids', color: '#CBFFC6' },
  { label: 'Empathogens',  color: '#FFBEEA' },
  { label: 'Inhalants',    color: '#EEEEEE' },
  { label: 'NPS',          color: '#E9FF93' },
];

// ─── Drug image renderer ──────────────────────────────────────────────────────

function DrugImage({ id }: { id: number }) {
  // Each card image matches exact Figma positioning
  if (id === 1) {
    // Fentanyl — full width, contained within the image area
    return (
      <img
        alt=""
        src={imgFentanyl00013}
        style={{
          position: 'absolute',
          width: '100%',
          height: '130%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          objectFit: 'contain',
        }}
      />
    );
  }
  if (id === 2) {
    // Tilidine — centered image
    return (
      <img
        alt=""
        src={imgImage88}
        style={{
          position: 'absolute',
          width: '179.062px',
          height: '98.667px',
          top: 'calc(50% - 8.78px)',
          left: 'calc(50% + 6.98px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          objectFit: 'cover',
        }}
      />
    );
  }
  if (id === 3) {
    // Ketamine — rotated 90°
    return (
      <div
        style={{
          position: 'absolute',
          width: '181.33px',
          height: '181.33px',
          top: '-18px',
          left: 'calc(50% - 2.33px)',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ flexShrink: 0, transform: 'rotate(90deg)', width: '181.33px', height: '181.33px', position: 'relative' }}>
          <img
            alt=""
            src={imgFentanyl00011}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
        </div>
      </div>
    );
  }
  if (id === 4) {
    // Mephedrone card 4 — rotated 180°
    return (
      <div
        style={{
          position: 'absolute',
          width: '109.704px',
          height: '110.54px',
          top: 'calc(50% - 9.73px)',
          left: 'calc(50% + 1.5px)',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ flexShrink: 0, transform: 'rotate(180deg)', width: '109.704px', height: '110.54px', position: 'relative', overflow: 'hidden' }}>
          <img
            alt=""
            src={imgImage30}
            style={{ position: 'absolute', height: '166.51%', left: '-62.32%', top: '-33.26%', width: '224.64%', maxWidth: 'none', pointerEvents: 'none' }}
          />
        </div>
      </div>
    );
  }
  if (id === 5) {
    // MDMA
    return (
      <img
        alt=""
        src={imgImage84}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          objectFit: 'contain',
          opacity: 1,
        }}
      />
    );
  }
  if (id === 6) {
    // Cannabis — simple top-left placement
    return (
      <img
        alt=""
        src={imgImage85}
        style={{
          position: 'absolute',
          width: '122.497px',
          height: '122.497px',
          top: 0,
          left: '25.25px',
          pointerEvents: 'none',
          objectFit: 'cover',
        }}
      />
    );
  }
  if (id === 7) {
    // Cocaine
    return (
      <img
        alt=""
        src={imgImage86}
        style={{
          position: 'absolute',
          width: '144.533px',
          height: '144.533px',
          top: '-4.47px',
          left: 'calc(50% + 1.5px)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          objectFit: 'cover',
        }}
      />
    );
  }
  // id === 8 — Poppers card
  return (
    <img
      alt=""
      src={imgImage87}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        objectFit: 'contain',
      }}
    />
  );
}

// ─── Drug Card ────────────────────────────────────────────────────────────────

function DrugCard({ drug, onClick }: { drug: Drug; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#171717',
        border: '0.2px solid rgba(241,241,241,0.2)',
        borderRadius: '16px',
        width: '100%',
        aspectRatio: '189 / 220',
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Image area — 59% of card height, fluid */}
      <div
        style={{
          flex: '0 0 59%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <DrugImage id={drug.id} />
      </div>

      {/* Text + tags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
        {/* Name + aliases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              // Fluid font: scales between 14px (tiny screen) and 18px (402px+)
              fontSize: 'clamp(14px, 4.5vw, 18px)',
              color: '#FFFFFF',
              letterSpacing: '0.36px',
              lineHeight: 1.2,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {drug.name}
          </p>
          <p
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(10px, 3vw, 12px)',
              color: '#F1F1F1',
              letterSpacing: '0.24px',
              lineHeight: 1.2,
              margin: 0,
              opacity: 0.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {drug.aliases}
          </p>
        </div>

        {/* Category tag(s) */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', overflow: 'hidden' }}>
          {drug.tags.map((tag) => (
            <div
              key={tag.label}
              style={{
                border: `0.63px solid ${tag.color}`,
                borderRadius: '100px',
                padding: '8px 6px',
                fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(8px, 2.5vw, 10px)',
                  color: tag.color,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                {tag.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface LibraryPageProps {
  onTabChange: (tab: 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal') => void;
  onDrugClick?: (drugId: number) => void;
  onSearchOpen?: () => void;
  onProfileOpen?: () => void;
}

export function LibraryPage({ onTabChange, onDrugClick, onSearchOpen, onProfileOpen }: LibraryPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? DRUGS
      : DRUGS.filter((d) => d.categories.includes(activeCategory));

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0D0D0D',
        overflow: 'hidden',
      }}
    >
      {/* ── FIXED HEADER — 3-layer blur ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        {/* Layer 1: blur with gradient mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          }}
        />
        {/* Layer 2: solid → transparent gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Layer 3: content */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          {/* Navigation row: profile | title | search */}
          <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            {/* Profile */}
            <button
              onClick={onProfileOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Open profile"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
                <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
              </svg>
            </button>
            {/* Title */}
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                color: '#F1F1F1',
                letterSpacing: '0.36px',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Library
            </p>
            {/* Search */}
            <button
              onClick={onSearchOpen}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Open search"
            >
            <div style={{ width: '32px', height: '32px', position: 'relative' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
                <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CARD GRID — tags scroll with content ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Category tag strip — scrolls with page */}
        <div style={{ paddingTop: '56px' }}>
          <div
            style={{
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '16px 8px 0',
            }}
            className="hide-scrollbar"
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '8px',
                width: 'max-content',
              }}
            >
              {CATEGORIES.map(({ label, color }) => {
                const isActive = activeCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveCategory(label)}
                    style={{
                      background: isActive ? '#8C5CFE' : 'transparent',
                      border: isActive ? 'none' : `1px solid ${color}`,
                      borderRadius: '44px',
                      padding: '8px 12px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: isActive ? '#F1F1F1' : color,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '16px', paddingBottom: '116px', paddingLeft: '8px', paddingRight: '8px' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '60px',
                color: '#F1F1F1',
                opacity: 0.5,
                fontFamily: 'Roboto, sans-serif',
                fontSize: '16px',
              }}
            >
              Nothing here yet
            </div>
          ) : (
            // CSS grid: always 2 equal columns, gap scales with screen
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {filtered.map((drug) => (
                <DrugCard key={drug.id} drug={drug} onClick={() => onDrugClick?.(drug.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Library" onTabChange={onTabChange} />
    </div>
  );
}