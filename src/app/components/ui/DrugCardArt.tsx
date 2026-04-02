import { useMemo } from 'react';
import type { TripSitDrug } from '../figma/LibraryPage';

// ─── Shared generative card art ───────────────────────────────────────────────
// Deterministic from drug.key — no randomness at render time.
// Used by LibraryPage (card grid) and SearchOverlay (result thumbnails).

export const DRUG_CATEGORY_COLOR: Record<string, string> = {
  Stimulants:    '#FFADA5',
  Psychedelics:  '#B2FFF1',
  Depressants:   '#B3C3D1',
  Opioids:       '#FFD0B4',
  Dissociatives: '#CCF1FF',
  Empathogens:   '#FFBEEA',
  NPS:           '#E9FF93',
};

export function seededHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function DrugCardArt({ drug }: { drug: TripSitDrug }) {
  const color = DRUG_CATEGORY_COLOR[drug.categories[0]] ?? '#F1F1F1';
  const h = seededHash(drug.key);

  const abbrev = useMemo(() => {
    const capsAlias = drug.aliases.find(a => /^[A-Z0-9\-]{2,5}$/.test(a));
    if (capsAlias) return capsAlias;
    if (/^[A-Z0-9\-]{2,6}$/.test(drug.pretty_name)) return drug.pretty_name;
    const words = drug.pretty_name.split(/[\s\-]+/);
    if (words.length >= 2) return words.map(w => w[0]).join('').toUpperCase().slice(0, 5);
    return drug.pretty_name.slice(0, 4).toUpperCase();
  }, [drug]);

  const w1 = 30 + (h % 20);
  const w2 = 20 + ((h >> 4) % 20);
  const w3 = 35 + ((h >> 8) % 15);
  const bx1 = 20 + (h % 40);
  const by1 = 10 + ((h >> 3) % 30);
  const br1 = 28 + ((h >> 6) % 18);
  const bx2 = 80 + ((h >> 9) % 50);
  const by2 = 50 + ((h >> 2) % 40);
  const br2 = 20 + ((h >> 5) % 16);

  const colorHex = color.replace('#', '');
  const r = parseInt(colorHex.slice(0, 2), 16);
  const g = parseInt(colorHex.slice(2, 4), 16);
  const b = parseInt(colorHex.slice(4, 6), 16);

  return (
    <svg
      viewBox="0 0 170 130"
      width="170"
      height="130"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden
    >
      <ellipse cx={bx1} cy={by1} rx={br1} ry={br1 * 0.85}
        fill={`rgba(${r},${g},${b},0.12)`} />
      <ellipse cx={bx2} cy={by2} rx={br2} ry={br2 * 1.1}
        fill={`rgba(${r},${g},${b},0.10)`} />
      <ellipse cx="85" cy="65" rx="32" ry="28"
        fill={`rgba(${r},${g},${b},0.08)`} />
      <path
        d={`M-10 ${w1} C20 ${w1 - 10}, 50 ${w1 + 14}, 90 ${w1 - 6} S140 ${w1 + 12}, 180 ${w1}`}
        stroke={`rgba(${r},${g},${b},0.35)`} strokeWidth="0.8" fill="none"
      />
      <path
        d={`M-10 ${w2 + 22} C25 ${w2 + 10}, 55 ${w2 + 32}, 90 ${w2 + 18} S145 ${w2 + 30}, 180 ${w2 + 14}`}
        stroke={`rgba(${r},${g},${b},0.25)`} strokeWidth="0.8" fill="none"
      />
      <path
        d={`M-10 ${w3 + 44} C30 ${w3 + 32}, 60 ${w3 + 55}, 95 ${w3 + 40} S150 ${w3 + 52}, 180 ${w3 + 38}`}
        stroke={`rgba(${r},${g},${b},0.18)`} strokeWidth="0.7" fill="none"
      />
      <path
        d={`M-10 ${w1 + 65} C15 ${w1 + 55}, 45 ${w1 + 75}, 85 ${w1 + 60} S140 ${w1 + 72}, 180 ${w1 + 58}`}
        stroke={`rgba(${r},${g},${b},0.13)`} strokeWidth="0.6" fill="none"
      />
      <text
        x="85"
        y="71"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Roboto, sans-serif"
        fontWeight="700"
        fontSize={abbrev.length <= 3 ? '28' : abbrev.length <= 4 ? '22' : '17'}
        fill={color}
        opacity="0.75"
        letterSpacing="1"
      >
        {abbrev}
      </text>
    </svg>
  );
}
