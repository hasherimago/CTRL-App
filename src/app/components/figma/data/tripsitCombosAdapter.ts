// src/data/tripsitCombosAdapter.ts
//
// Converts TripSit's combos.json → CTRL's COMBINATIONS record.
// Verified against actual combos.json (31 top-level keys).
//
// Actual top-level keys in combos.json:
//   2c-t-x, 2c-x, 5-meo-xxt, alcohol, amphetamines, amt,
//   benzodiazepines, caffeine, cannabis, cocaine, dextromethorphan,
//   diphenhydramine, dmt, dox, ghb/gbl, ketamine, lithium, lsd,
//   maois, mdma, mephedrone, mescaline, mushrooms, mxe, nbomes,
//   nitrous, opioids, pcp, pregabalin, ssris, tramadol
//
// Actual status values found in the file:
//   "Low Risk & Synergy", "Low Risk & No Synergy", "Caution",
//   "Unsafe", "Dangerous"

// ─── CTRL types ───────────────────────────────────────────────────────────────

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface ComboResult {
  risk: RiskLevel;
  title: string;
  body: string;
}

// ─── TripSit raw shape ────────────────────────────────────────────────────────

interface TripSitComboEntry {
  status: string;
  note?: string;
}

export type TripSitCombos = Record<string, Record<string, TripSitComboEntry>>;

// ─── Status → risk (verified against actual status strings) ──────────────────

function mapRisk(status: string): RiskLevel {
  const s = status.toLowerCase();
  if (s.includes('low risk')) return 'green';
  if (s === 'caution')        return 'yellow';
  if (s === 'unsafe')         return 'red';
  if (s === 'dangerous')      return 'red';
  return 'yellow'; // fallback for any unexpected value
}

// ─── Body text — use TripSit's note if present, else generate ────────────────

function buildBody(nameA: string, nameB: string, status: string, note?: string): string {
  if (note && note.trim().length > 15) return note.trim();

  const pair = `${nameA} and ${nameB}`;
  const s = status.toLowerCase();

  if (s.includes('low risk') && s.includes('synergy')) {
    return `${pair} have a low-risk interaction with reported synergy. Effects may enhance each other — start with lower doses of both.`;
  }
  if (s.includes('low risk')) {
    return `${pair} are generally considered low risk to combine. No major interaction is expected, but individual responses vary.`;
  }
  if (s === 'caution') {
    return `Use caution when combining ${pair}. The interaction carries moderate risks or is not fully understood. Keep doses low and have a sober person nearby.`;
  }
  if (s === 'unsafe') {
    return `Combining ${pair} is considered unsafe. This interaction carries significant health risks — avoid if possible.`;
  }
  if (s === 'dangerous') {
    return `Combining ${pair} is dangerous. This interaction can cause serious harm or death. Do not combine these substances.`;
  }
  return `Exercise caution when combining ${pair}. Limited information is available.`;
}

// ─── Pretty-print a TripSit key ───────────────────────────────────────────────

function displayName(key: string): string {
  // Handle known special cases
  const overrides: Record<string, string> = {
    'ghb/gbl':         'GHB/GBL',
    'mdma':            'MDMA',
    'lsd':             'LSD',
    'dmt':             'DMT',
    'mxe':             'MXE',
    'pcp':             'PCP',
    'dox':             'DOx',
    'amt':             'aMT',
    '2c-x':            '2C-x',
    '2c-t-x':          '2C-T-x',
    '5-meo-xxt':       '5-MeO-xxT',
    'nbomes':          'NBOMe',
    'maois':           'MAOIs',
    'ssris':           'SSRIs',
    'dextromethorphan':'DXM',
    'diphenhydramine': 'DPH',
    'amphetamines':    'Amphetamines',
    'benzodiazepines': 'Benzodiazepines',
    'opioids':         'Opioids',
    'tramadol':        'Tramadol',
    'pregabalin':      'Pregabalin',
    'mephedrone':      'Mephedrone',
    'mushrooms':       'Mushrooms',
    'nitrous':         'Nitrous Oxide',
    'caffeine':        'Caffeine',
    'lithium':         'Lithium',
  };
  if (overrides[key]) return overrides[key];
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// ─── Main adapter ─────────────────────────────────────────────────────────────

export function adaptCombos(raw: TripSitCombos): Record<string, ComboResult> {
  const result: Record<string, ComboResult> = {};

  for (const keyA of Object.keys(raw)) {
    const interactions = raw[keyA];
    for (const keyB of Object.keys(interactions)) {
      const entry = interactions[keyB];

      // Sorted key = canonical lookup regardless of selection order
      const comboKey = [keyA, keyB].sort().join('+');

      // TripSit stores both directions — only write once
      if (result[comboKey]) continue;

      result[comboKey] = {
        risk: mapRisk(entry.status),
        title: `${displayName(keyA)} + ${displayName(keyB)}`,
        body: buildBody(displayName(keyA), displayName(keyB), entry.status, entry.note),
      };
    }
  }

  return result;
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function comboKey(selected: string[]): string {
  return [...selected].sort().join('+');
}

export function getCombinations<T>(arr: T[], size: number): T[][] {
  if (size === 1) return arr.map(x => [x]);
  return arr.flatMap((x, i) =>
    getCombinations(arr.slice(i + 1), size - 1).map(rest => [x, ...rest])
  );
}

export function findCombo(
  selected: string[],
  combinations: Record<string, ComboResult>
): ComboResult | null {
  if (selected.length < 2) return null;
  const exact = combinations[comboKey(selected)];
  if (exact) return exact;
  for (let size = Math.min(selected.length, 3); size >= 2; size--) {
    const subsets = getCombinations(selected, size);
    for (const subset of subsets) {
      const match = combinations[comboKey(subset)];
      if (match) return match;
    }
  }
  return null;
}
