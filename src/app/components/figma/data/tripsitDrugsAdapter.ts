// src/app/components/figma/data/tripsitDrugsAdapter.ts
//
// Filters TripSit's drugs.json to "common" drugs only (~70 entries)
// and exposes all fields needed for the Library cards + Detail pages.

// ─── CTRL types ───────────────────────────────────────────────────────────────

export interface Tag {
  label: string;
  color: string;
}

export interface DoseLevel {
  Threshold?: string;
  Light?: string;
  Common?: string;
  Strong?: string;
  Heavy?: string;
  [key: string]: string | undefined;
}

export interface Drug {
  id: number;
  key: string;          // original TripSit key e.g. "mdma"
  name: string;         // pretty_name e.g. "MDMA"
  aliases: string[];    // street names array
  tags: Tag[];
  categories: string[]; // display label strings for filter
  // Detail page fields
  summary: string;
  effects: string[];    // pweffects list
  dose: Record<string, DoseLevel>;      // { Oral: { Light: '...', Common: '...' } }
  onset: Record<string, string>;        // { value: '20-70', _unit: 'minutes' } or by route
  duration: Record<string, string>;
  aftereffects: Record<string, string>;
  doseNote: string;
}

// ─── Category mapping (verified against actual drugs.json) ───────────────────

const CATEGORY_MAP: Record<string, [string, string]> = {
  stimulant:      ['Stimulants',    '#FFADA5'],
  psychedelic:    ['Psychedelics',  '#B2FFF1'],
  opioid:         ['Opioids',       '#FFD0B4'],
  dissociative:   ['Dissociatives', '#CCF1FF'],
  depressant:     ['Depressants',   '#B3C3D1'],
  empathogen:     ['Empathogens',   '#FFBEEA'],
  benzodiazepine: ['Depressants',   '#B3C3D1'],
  barbiturate:    ['Depressants',   '#B3C3D1'],
  nootropic:      ['Nootropics',    '#E9FF93'],
  deliriant:      ['Deliriants',    '#FFE5A0'],
  ssri:           ['Antidepressants','#D4B3FF'],
};

const IGNORED_CATS = new Set([
  'habit-forming', 'research-chemical', 'tentative',
  'common', 'inactive', 'supplement',
]);

// ─── TripSit raw shape ────────────────────────────────────────────────────────

interface TripSitEntry {
  pretty_name?: string;
  name?: string;
  aliases?: string[];
  categories?: string[];
  summary?: string;
  properties?: Record<string, unknown>;
  formatted_dose?: Record<string, Record<string, string>>;
  formatted_onset?: Record<string, string>;
  formatted_duration?: Record<string, string>;
  formatted_aftereffects?: Record<string, string>;
  pweffects?: string[];
  dose_note?: string;
  [key: string]: unknown;
}

// ─── Main adapter ─────────────────────────────────────────────────────────────

export function adaptDrugs(raw: Record<string, TripSitEntry>): Drug[] {
  let id = 1;
  const results: Drug[] = [];

  for (const key of Object.keys(raw)) {
    const entry = raw[key];
    const cats: string[] = entry.categories ?? [];

    // ── Only keep drugs marked "common" ──
    if (!cats.includes('common')) continue;
    if (cats.includes('inactive')) continue;

    // ── Build display tags ──
    const tags: Tag[] = [];
    const seenLabels = new Set<string>();
    for (const cat of cats) {
      if (IGNORED_CATS.has(cat)) continue;
      const mapping = CATEGORY_MAP[cat];
      if (!mapping) continue;
      const [label, color] = mapping;
      if (seenLabels.has(label)) continue;
      seenLabels.add(label);
      tags.push({ label, color });
    }

    // Skip if no displayable category
    if (tags.length === 0) continue;

    // ── Display name ──
    const name = entry.pretty_name ?? entry.name
      ?? key.charAt(0).toUpperCase() + key.slice(1);

    // ── Summary: fall back to effects text if no summary ──
    const props = (entry.properties ?? {}) as Record<string, string>;
    const summary = entry.summary?.trim()
      || props.effects?.trim()
      || '';

    results.push({
      id: id++,
      key,
      name,
      aliases: entry.aliases ?? [],
      tags,
      categories: [...seenLabels],
      summary,
      effects: entry.pweffects ?? [],
      dose: (entry.formatted_dose ?? {}) as Record<string, DoseLevel>,
      onset: (entry.formatted_onset ?? {}) as Record<string, string>,
      duration: (entry.formatted_duration ?? {}) as Record<string, string>,
      aftereffects: (entry.formatted_aftereffects ?? {}) as Record<string, string>,
      doseNote: entry.dose_note ?? '',
    });
  }

  // Alphabetical
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}
