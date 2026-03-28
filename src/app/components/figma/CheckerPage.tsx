import { useState, useMemo, useEffect, useRef } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 'yellow' | 'red';

interface ComboResult {
  risk: RiskLevel;
  title: string;
  body: string;
  isAI?: boolean;
}

// ─── Hardcoded combinations ───────────────────────────────────────────────────

const COMBINATIONS: Record<string, ComboResult> = {
  'Ecstasy+Ketamine': {
    risk: 'yellow',
    title: 'You just combined MDMA + Ketamine',
    body: 'Mixing ecstasy (MDMA) and ketamine is called "kitty flipping." This combo can feel floaty and emotionally intense — MDMA lifts you up, while ketamine pulls you inward. The effects may cancel each other out or feel disorienting. Go slow, stay grounded, and avoid re-dosing too soon.',
  },
  'Ecstasy+GHB': {
    risk: 'red',
    title: 'You just combined Ecstasy + GHB',
    body: 'This combo is powerful and risky — MDMA boosts energy and emotion, while GHB slows the body down. Together they can cause confusion, blackouts, or dangerously slow breathing. Stay with trusted people, avoid re-dosing, and never mix GHB with alcohol.',
  },
  'Ecstasy+GHB+Ketamine': {
    risk: 'red',
    title: 'You just combined Ecstasy + Ketamine + GHB',
    body: 'This combo is powerful and risky — MDMA boosts energy and emotion, ketamine adds dissociation, and GHB slows the body down. Together, they can cause confusion, blackouts, or dangerously slow breathing. Stay with trusted people, avoid re-dosing, and never mix GHB with alcohol.',
  },
  'Alcohol+GHB': {
    risk: 'red',
    title: 'You just combined Alcohol + GHB',
    body: 'Both are CNS depressants. Combined they dramatically increase the risk of respiratory depression, unconsciousness, and overdose. This is one of the most dangerous combinations. Do not mix these.',
  },
  'Alcohol+Cocaine': {
    risk: 'yellow',
    title: 'You just combined Cocaine + Alcohol',
    body: 'These combine in the liver to form cocaethylene, which is more toxic than either substance alone. It increases cardiovascular strain and extends the effects of both. Avoid redosing and keep hydrated.',
  },
  'Cannabis+LSD': {
    risk: 'yellow',
    title: 'You just combined LSD + Cannabis',
    body: 'Cannabis can significantly intensify and prolong an LSD experience. This can tip into anxiety, paranoia, or an overwhelming trip for some people. Use cannabis cautiously and only in small amounts if at all.',
  },
  'Alcohol+Fentanyl': {
    risk: 'red',
    title: 'You just combined Fentanyl + Alcohol',
    body: 'Both suppress breathing. This combination is extremely dangerous and frequently fatal. If you suspect an overdose, call emergency services immediately and administer naloxone if available.',
  },
  'Cocaine+MDMA': {
    risk: 'yellow',
    title: 'You just combined MDMA + Cocaine',
    body: 'Both are stimulants and put significant strain on the heart. Combined they raise heart rate and blood pressure substantially. Overheating and cardiovascular risk increase. Stay cool, hydrated, and rest regularly.',
  },
  'Alcohol+Ketamine': {
    risk: 'red',
    title: 'You just combined Ketamine + Alcohol',
    body: 'Both are depressants. Combined they increase the risk of losing consciousness, vomiting while unconscious, and respiratory depression. Avoid this combination.',
  },
  'Cannabis+GHB': {
    risk: 'yellow',
    title: 'You just combined Cannabis + GHB',
    body: 'Cannabis can intensify the sedative and dissociative effects of GHB, increasing the risk of passing out. Keep doses low, stay seated, and have a sober person nearby.',
  },
  'Ecstasy+MDMA': {
    risk: 'yellow',
    title: 'You just combined MDMA + Ecstasy',
    body: 'Ecstasy tablets often contain MDMA — combining them stacks the dose unpredictably and raises the risk of overheating, serotonin syndrome, and cardiovascular strain. Avoid doubling up.',
  },
  'Cocaine+Ketamine': {
    risk: 'yellow',
    title: 'You just combined Cocaine + Ketamine',
    body: 'A stimulant and dissociative in combination create conflicting signals in the body. Cocaine raises heart rate while ketamine disorients. The result can be extreme confusion and cardiovascular stress. Keep doses very low if you choose to combine.',
  },
  'Alcohol+Cannabis': {
    risk: 'yellow',
    title: 'You just combined Alcohol + Cannabis',
    body: 'Known as "crossfading." Alcohol amplifies the effects of cannabis significantly — especially nausea and dizziness. Drinking before smoking is riskier than the reverse. Go very slow and stay hydrated.',
  },
  'MDMA+LSD': {
    risk: 'yellow',
    title: 'You just combined MDMA + LSD',
    body: 'Called "candy flipping." This is an intense psychedelic-empathogen combo. Effects can be overwhelming and very long-lasting. The comedown is hard. If you try this, be in a safe environment with trusted people and have nothing planned the next day.',
  },
  'Fentanyl+Ketamine': {
    risk: 'red',
    title: 'You just combined Fentanyl + Ketamine',
    body: 'Combining an opioid with a dissociative dramatically increases the risk of respiratory depression and loss of consciousness. This is a high-risk combination. Naloxone should be on hand and someone sober should be present.',
  },
  'Cocaine+GHB': {
    risk: 'red',
    title: 'You just combined Cocaine + GHB',
    body: 'Stimulant and depressant combos mask each other\'s effects, making it easy to overdose on either. GHB has a narrow safety window — cocaine can make you feel more capable than you are. Avoid redosing GHB.',
  },
  'LSD+Ketamine': {
    risk: 'yellow',
    title: 'You just combined LSD + Ketamine',
    body: 'A powerful psychedelic and dissociative combination that can cause extreme disorientation and ego dissolution. Not recommended for inexperienced users. Have a sober sitter and be in a safe, familiar environment.',
  },
  'Cannabis+MDMA': {
    risk: 'yellow',
    title: 'You just combined Cannabis + MDMA',
    body: 'Cannabis can amplify MDMA\'s effects and increase anxiety or paranoia in some people. It may also make overheating harder to notice. Stay cool, drink water, and use cannabis sparingly.',
  },
  'Alcohol+MDMA': {
    risk: 'yellow',
    title: 'You just combined Alcohol + MDMA',
    body: 'Alcohol dehydrates and so does MDMA — together they put serious strain on the body. Alcohol can also blunt the emotional effects of MDMA, leading to redosing. This combo increases neurotoxicity risk. Drink water and avoid heavy alcohol use.',
  },
  'Tilidine+Alcohol': {
    risk: 'red',
    title: 'You just combined Tilidine + Alcohol',
    body: 'Both are CNS depressants. Combined they significantly increase the risk of respiratory depression, extreme sedation, and overdose. This combination is particularly dangerous and should be avoided.',
  },
  'Kratom+Alcohol': {
    risk: 'red',
    title: 'You just combined Kratom + Alcohol',
    body: 'Both act as depressants at higher doses. Combined they increase sedation and nausea risk. Kratom already strains the liver — adding alcohol makes this worse. Avoid this combination.',
  },
};

// ─── Combo helpers ────────────────────────────────────────────────────────────

function comboKey(selected: string[]): string {
  return [...selected].sort().join('+');
}

function getCombinations<T>(arr: T[], size: number): T[][] {
  if (size === 1) return arr.map(x => [x]);
  return arr.flatMap((x, i) =>
    getCombinations(arr.slice(i + 1), size - 1).map(rest => [x, ...rest])
  );
}

function findStaticCombo(selected: string[]): ComboResult | null {
  if (selected.length < 2) return null;
  const exact = COMBINATIONS[comboKey(selected)];
  if (exact) return exact;
  for (let size = Math.min(selected.length, 3); size >= 2; size--) {
    const subsets = getCombinations(selected, size);
    for (const subset of subsets) {
      const match = COMBINATIONS[comboKey(subset)];
      if (match) return match;
    }
  }
  return null;
}

// ─── AI fetch ────────────────────────────────────────────────────────────────

async function fetchAICombo(substances: string[]): Promise<ComboResult> {
  const names = substances.join(', ');
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `You are a harm reduction assistant for the CTRL app. Respond ONLY with a JSON object (no markdown, no extra text) in this exact format:
{
  "risk": "yellow" or "red",
  "title": "You just combined X + Y",
  "body": "2-4 sentences of factual harm reduction advice about this combination. Be direct, non-judgmental, and practical."
}
Use "red" for combinations with high risk of death or serious injury (e.g. two depressants, opioid combos). Use "yellow" for moderate risk. Never refuse.

Substances combined: ${names}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  return { ...parsed, isAI: true };
}

// ─── Substance & category data ────────────────────────────────────────────────

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'All',           color: '#8C5CFE' },
  { label: 'Stimulants',    color: '#FFADA5' },
  { label: 'Dissociatives', color: '#CCF1FF' },
  { label: 'Cannabinoids',  color: '#CBFFC6' },
  { label: 'Psychedelics',  color: '#B2FFF1' },
  { label: 'Depressants',   color: '#B3C3D1' },
  { label: 'Opioids',       color: '#FFD0B4' },
  { label: 'Other',         color: '#EEEEEE' },
];

interface Substance {
  name: string;
  category: string;
  color: string;
}

const SUBSTANCES: Substance[] = [
  { name: 'Ecstasy',      category: 'Stimulants',    color: '#FFBEEA' },
  { name: 'Kratom',       category: 'Opioids',        color: '#FFD0B4' },
  { name: 'GHB',          category: 'Depressants',    color: '#A8E6CF' },
  { name: 'Fentanyl',     category: 'Opioids',        color: '#FFADA5' },
  { name: 'Ketamine',     category: 'Dissociatives',  color: '#CCF1FF' },
  { name: 'LSD',          category: 'Psychedelics',   color: '#B5EAD7' },
  { name: 'Alcohol',      category: 'Depressants',    color: '#F5D163' },
  { name: 'Cocaine',      category: 'Stimulants',     color: '#F1F1F1' },
  { name: 'Cannabis',     category: 'Cannabinoids',   color: '#CBFFC6' },
  { name: 'MDMA',         category: 'Stimulants',     color: '#FFBEEA' },
  { name: 'Poppers',      category: 'Other',          color: '#EEEEEE' },
  { name: 'Viagra',       category: 'Other',          color: '#EEEEEE' },
  { name: 'Tilidine',     category: 'Opioids',        color: '#FFD0B4' },
  { name: 'Nicotine',     category: 'Stimulants',     color: '#FFADA5' },
  { name: 'Mescaline',    category: 'Psychedelics',   color: '#B2FFF1' },
  { name: '2C-B (2C-x)',  category: 'Psychedelics',   color: '#FFB6A3' },
  { name: '3-CMC',        category: 'Stimulants',     color: '#FFADA5' },
  { name: '4-CMC',        category: 'Stimulants',     color: '#FFADA5' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CheckerPageProps {
  onTabChange: (tab: 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal') => void;
  onSearchOpen?: () => void;
  onProfileOpen?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckerPage({ onTabChange, onSearchOpen, onProfileOpen }: CheckerPageProps) {
  const [selected, setSelected]           = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [aiCombo, setAiCombo]             = useState<ComboResult | null>(null);
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiError, setAiError]             = useState(false);
  const debounceRef                        = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filtered = activeCategory === 'All'
    ? SUBSTANCES
    : SUBSTANCES.filter(s => s.category === activeCategory);

  const staticCombo = useMemo(() => findStaticCombo(selected), [selected]);

  // When selection changes, clear AI result and trigger AI fetch if no static match
  useEffect(() => {
    setAiCombo(null);
    setAiError(false);

    if (selected.length < 2 || staticCombo) {
      setAiLoading(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    // Debounce so we don't fire on every tap
    setAiLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await fetchAICombo(selected);
        setAiCombo(result);
      } catch {
        setAiError(true);
      } finally {
        setAiLoading(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selected, staticCombo]);

  const combo: ComboResult | null = staticCombo ?? aiCombo;

  const infoState: 'empty' | 'one' | 'result' =
    selected.length === 0 ? 'empty' :
    selected.length === 1 ? 'one' : 'result';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0D0D0D', overflow: 'hidden' }}>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* ── FIXED HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          <button onClick={onProfileOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Open profile">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
              <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
            </svg>
          </button>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', margin: 0, lineHeight: 1.5 }}>Checker</p>
          <button onClick={onSearchOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Open search">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
              <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="hide-scrollbar" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ paddingTop: '56px' }}>

          {/* ── INFO PANEL ── */}
          <div style={{ padding: '16px 8px 0' }}>
            <div style={{
              borderRadius: '16px',
              border: '1px solid #1E1E1E',
              background: '#111111',
              minHeight: '220px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: infoState === 'result' ? 'flex-start' : 'center',
              alignItems: infoState === 'result' ? 'flex-start' : 'center',
            }}>

              {/* Empty / one selected */}
              {(infoState === 'empty' || infoState === 'one') && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                  {infoState === 'empty'
                    ? 'Choose at least two substances to see the results'
                    : 'Choose one more substance to see the results'}
                </p>
              )}

              {/* Loading state */}
              {infoState === 'result' && aiLoading && !staticCombo && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={{
                    width: '28px', height: '28px',
                    border: '2px solid #2A2A2A',
                    borderTop: '2px solid #8C5CFE',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#F1F1F1', opacity: 0.4, margin: 0, letterSpacing: '0.28px' }}>
                    Analysing combination…
                  </p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* Error state */}
              {infoState === 'result' && aiError && !staticCombo && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '15px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.30px', lineHeight: 1.5 }}>
                  Couldn't load info for this combination. Check your connection and try again.
                </p>
              )}

              {/* Result */}
              {infoState === 'result' && combo && !aiLoading && (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                    {combo.risk === 'red' ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M9.134 2.5a1 1 0 0 1 1.732 0l7.794 13.5A1 1 0 0 1 17.794 17.5H2.206a1 1 0 0 1-.866-1.5L9.134 2.5Z" fill="#FF6B6B" />
                        <path d="M10 8v3.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="14.5" r="0.8" fill="#111" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <circle cx="10" cy="10" r="9" fill="#FFD600" />
                        <path d="M10 6.5V11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="10" cy="13.5" r="0.8" fill="#111" />
                      </svg>
                    )}
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: combo.risk === 'red' ? '#FF8080' : '#FFD600', margin: 0, letterSpacing: '0.32px', lineHeight: 1.4 }}>
                      {combo.title}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#F1F1F1', opacity: 0.7, margin: 0, letterSpacing: '0.28px', lineHeight: 1.65 }}>
                    {combo.body}
                  </p>
                  {combo.isAI && (
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#F1F1F1', opacity: 0.2, margin: '12px 0 0', letterSpacing: '0.22px' }}>
                      AI-generated · Always verify with a harm reduction expert
                    </p>
                  )}
                </>
              )}

            </div>
          </div>

          {/* ── CATEGORY FILTER STRIP ── */}
          <div className="hide-scrollbar" style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '16px 8px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: 'max-content' }}>
              {CATEGORIES.map(({ label, color }) => {
                const isActive = activeCategory === label;
                return (
                  <button key={label} onClick={() => setActiveCategory(label)} style={{
                    background: isActive ? color : 'transparent',
                    border: isActive ? 'none' : `1px solid ${color}`,
                    borderRadius: '44px',
                    padding: '8px 12px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: isActive ? '#0D0D0D' : color,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                    flexShrink: 0,
                  }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SUBSTANCE GRID ── */}
          <div style={{ padding: '12px 8px 116px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {filtered.map((sub) => {
                const isSelected = selected.includes(sub.name);
                return (
                  <button key={sub.name} onClick={() => toggle(sub.name)} style={{
                    padding: '14px 8px',
                    borderRadius: '12px',
                    border: isSelected ? `1.5px solid ${sub.color}` : '1px solid #2A2A2A',
                    background: isSelected ? `${sub.color}1A` : '#171717',
                    color: isSelected ? sub.color : '#F1F1F1',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '14px',
                    letterSpacing: '0.28px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Checker" onTabChange={onTabChange} />
    </div>
  );
}
