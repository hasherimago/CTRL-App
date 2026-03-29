import { useState } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 'yellow' | 'red';

interface ComboResult {
  risk: RiskLevel;
  title: string;
  body: string;
}

// ─── Hardcoded combinations (~50 realistic pairs) ─────────────────────────────

const COMBINATIONS: Record<string, ComboResult> = {

  // ── Alcohol combos ──
  'Alcohol+GHB': { risk: 'red', title: 'Alcohol + GHB', body: 'Both are CNS depressants. This is one of the most dangerous combinations — combined they dramatically increase the risk of respiratory depression, unconsciousness, and fatal overdose. Do not mix these.' },
  'Alcohol+Ketamine': { risk: 'red', title: 'Alcohol + Ketamine', body: 'Both are depressants. Combined they increase the risk of losing consciousness, vomiting while unconscious, and respiratory depression. Avoid this combination entirely.' },
  'Alcohol+Fentanyl': { risk: 'red', title: 'Alcohol + Fentanyl', body: 'Both suppress breathing. This combination is extremely dangerous and frequently fatal. If you suspect an overdose, call emergency services immediately and administer naloxone if available.' },
  'Alcohol+Tilidine': { risk: 'red', title: 'Alcohol + Tilidine', body: 'Both are CNS depressants. Combined they significantly increase the risk of respiratory depression, extreme sedation, and overdose. This combination is particularly dangerous and should be avoided.' },
  'Alcohol+Kratom': { risk: 'red', title: 'Alcohol + Kratom', body: 'Both act as depressants at higher doses. Combined they increase sedation and nausea risk considerably. Kratom already strains the liver — adding alcohol makes this significantly worse.' },
  'Alcohol+MDMA': { risk: 'yellow', title: 'Alcohol + MDMA', body: 'Both dehydrate — together they put serious strain on the body. Alcohol can blunt MDMA\'s effects leading to redosing, and increases neurotoxicity risk. Drink water regularly and avoid heavy alcohol use.' },
  'Alcohol+Ecstasy': { risk: 'yellow', title: 'Alcohol + Ecstasy', body: 'Both dehydrate — together they put serious strain on the body. Alcohol can blunt the effects of ecstasy leading to redosing, and increases neurotoxicity risk. Drink water regularly and avoid heavy alcohol use.' },
  'Alcohol+Cocaine': { risk: 'yellow', title: 'Alcohol + Cocaine', body: 'These combine in the liver to form cocaethylene, which is more toxic than either substance alone. It increases cardiovascular strain and extends the effects of both. Avoid redosing and keep hydrated.' },
  'Alcohol+Cannabis': { risk: 'yellow', title: 'Alcohol + Cannabis', body: 'Known as "crossfading." Alcohol amplifies cannabis effects significantly — especially nausea and dizziness. Drinking before smoking is riskier than the reverse. Go very slow and stay hydrated.' },
  'Alcohol+LSD': { risk: 'yellow', title: 'Alcohol + LSD', body: 'Alcohol can dull the psychedelic experience and increase nausea. It also impairs judgment when you\'re already in an altered state. Keep alcohol intake very low and stay with trusted people.' },
  'Alcohol+GHB+Ketamine': { risk: 'red', title: 'Alcohol + Ketamine + GHB', body: 'Three depressants combined. This is an extremely dangerous combination that massively increases the risk of respiratory failure and death. Avoid entirely.' },
  'Alcohol+Nicotine': { risk: 'yellow', title: 'Alcohol + Nicotine', body: 'A very common combination. Alcohol increases nicotine cravings and the combination puts added strain on the cardiovascular system. Be mindful of how much you\'re smoking when drinking.' },
  'Alcohol+Mescaline': { risk: 'yellow', title: 'Alcohol + Mescaline', body: 'Alcohol significantly increases nausea with mescaline and can make the experience unpredictable and overwhelming. Avoid alcohol during a mescaline experience.' },
  '2C-B (2C-x)+Alcohol': { risk: 'yellow', title: 'Alcohol + 2C-B', body: 'Alcohol can intensify 2C-B unpredictably and increase nausea and anxiety. It impairs your ability to navigate the psychedelic experience safely. Keep intake minimal.' },

  // ── MDMA / Ecstasy combos ──
  'Ecstasy+MDMA': { risk: 'yellow', title: 'MDMA + Ecstasy', body: 'Ecstasy tablets often contain MDMA — combining them stacks the dose unpredictably and raises the risk of overheating, serotonin syndrome, and cardiovascular strain. Avoid doubling up.' },
  'Cocaine+MDMA': { risk: 'yellow', title: 'MDMA + Cocaine', body: 'Both stimulants put significant strain on the heart. Combined they raise heart rate and blood pressure substantially. Overheating and cardiovascular risk increase. Stay cool, hydrated, and rest regularly.' },
  'Ketamine+MDMA': { risk: 'yellow', title: 'MDMA + Ketamine', body: 'Called "kitty flipping." This combo can feel floaty and emotionally intense — MDMA lifts you up while ketamine pulls you inward. Effects may feel disorienting. Go slow and avoid re-dosing too soon.' },
  'LSD+MDMA': { risk: 'yellow', title: 'MDMA + LSD', body: 'Called "candy flipping." An intense and very long-lasting psychedelic-empathogen combo. Effects can be overwhelming. Be in a safe environment with trusted people and have nothing planned the next day.' },
  'Cannabis+MDMA': { risk: 'yellow', title: 'MDMA + Cannabis', body: 'Cannabis can amplify MDMA\'s effects and increase anxiety or paranoia in some people. It may also make overheating harder to notice. Stay cool, drink water, and use cannabis sparingly.' },
  'GHB+MDMA': { risk: 'red', title: 'MDMA + GHB', body: 'MDMA raises your heart rate while GHB slows the body down. Together they can cause confusion, blackouts, or dangerously slow breathing. Stay with trusted people and never mix GHB with alcohol.' },
  '2C-B (2C-x)+MDMA': { risk: 'yellow', title: 'MDMA + 2C-B', body: 'Called "nexus flipping." A powerful empathogen-psychedelic combination. Very intense and can be overwhelming. Start with low doses of both, have a sober person present, and be in a safe environment.' },
  'MDMA+Mescaline': { risk: 'yellow', title: 'MDMA + Mescaline', body: 'A powerful combination of empathogen and psychedelic. Mescaline is long-lasting, so the timeline becomes very extended. Both increase serotonin — serotonin syndrome is a risk. Keep doses low.' },

  // ── Ecstasy-specific ──
  'Ecstasy+GHB': { risk: 'red', title: 'Ecstasy + GHB', body: 'Ecstasy boosts energy and emotion while GHB slows the body down. Together they can cause confusion, blackouts, or dangerously slow breathing. Stay with trusted people and never mix GHB with alcohol.' },
  'Ecstasy+GHB+Ketamine': { risk: 'red', title: 'Ecstasy + GHB + Ketamine', body: 'Three substances with conflicting effects — stimulant, depressant, and dissociative. This combination dramatically increases the risk of blackout, respiratory depression, and overdose. Avoid entirely.' },
  'Ecstasy+Ketamine': { risk: 'yellow', title: 'Ecstasy + Ketamine', body: 'Called "kitty flipping." This combo can feel floaty and emotionally intense — ecstasy lifts you up while ketamine pulls you inward. Effects may feel disorienting. Go slow and avoid re-dosing.' },
  'Cocaine+Ecstasy': { risk: 'yellow', title: 'Ecstasy + Cocaine', body: 'Both stimulants — combined they raise heart rate and blood pressure significantly. Overheating risk increases. Stay cool, rest regularly, and drink water.' },
  'Ecstasy+LSD': { risk: 'yellow', title: 'Ecstasy + LSD', body: 'Called "candy flipping." Intense and very long-lasting. Can be overwhelming even for experienced users. Be in a safe, familiar environment with trusted people and nothing planned the next day.' },

  // ── Ketamine combos ──
  'GHB+Ketamine': { risk: 'red', title: 'Ketamine + GHB', body: 'Two depressants combined. This significantly increases the risk of losing consciousness and respiratory depression. One or both substances can cause someone to stop breathing. Avoid this combination.' },
  'Cocaine+Ketamine': { risk: 'yellow', title: 'Ketamine + Cocaine', body: 'A stimulant and dissociative in conflict. Cocaine raises heart rate while ketamine disorients. The result can be extreme confusion and cardiovascular stress. Keep doses very low if combining.' },
  'Ketamine+LSD': { risk: 'yellow', title: 'Ketamine + LSD', body: 'A powerful psychedelic-dissociative combination that can cause extreme disorientation and ego dissolution. Not recommended for inexperienced users. Have a sober sitter in a safe, familiar environment.' },
  'Cannabis+Ketamine': { risk: 'yellow', title: 'Ketamine + Cannabis', body: 'Cannabis can intensify ketamine\'s dissociative effects significantly. The combination can feel overwhelming and cause paranoia. Use cannabis sparingly and only in a safe, comfortable setting.' },
  'Fentanyl+Ketamine': { risk: 'red', title: 'Ketamine + Fentanyl', body: 'Combining a dissociative with an opioid dramatically increases the risk of respiratory depression and loss of consciousness. High-risk combination — naloxone should be on hand and a sober person present.' },
  'Ketamine+Tilidine': { risk: 'red', title: 'Ketamine + Tilidine', body: 'A dissociative and opioid combination that increases the risk of respiratory depression and loss of consciousness. Avoid this combination. Naloxone should be on hand if used.' },
  '2C-B (2C-x)+Ketamine': { risk: 'yellow', title: 'Ketamine + 2C-B', body: 'A dissociative and psychedelic that together can cause extreme disorientation and a very intense experience. Not for inexperienced users. Have a sober sitter and be in a safe environment.' },
  'Ketamine+Mescaline': { risk: 'yellow', title: 'Ketamine + Mescaline', body: 'A very intense psychedelic-dissociative combination. Mescaline is long-lasting so the experience extends for many hours. Have a trusted sober sitter and be in a safe environment.' },

  // ── GHB combos ──
  'Cocaine+GHB': { risk: 'red', title: 'GHB + Cocaine', body: 'Stimulant and depressant combo that masks each other\'s effects, making it easy to overdose on either. GHB has a very narrow safety window — cocaine can make you feel more capable than you are. Avoid redosing GHB.' },
  'Cannabis+GHB': { risk: 'yellow', title: 'GHB + Cannabis', body: 'Cannabis can intensify the sedative effects of GHB and increase the risk of passing out. Keep doses very low, stay seated, and have a sober person nearby.' },
  'GHB+LSD': { risk: 'yellow', title: 'GHB + LSD', body: 'GHB can unpredictably intensify or suppress a psychedelic experience. The narrow dosing window of GHB becomes harder to manage during an LSD trip. Have a sober sitter present.' },
  'Fentanyl+GHB': { risk: 'red', title: 'GHB + Fentanyl', body: 'Two CNS depressants with very narrow safety windows. This combination is extremely high risk for respiratory failure and death. Avoid entirely — this is one of the most dangerous combinations possible.' },
  'GHB+Tilidine': { risk: 'red', title: 'GHB + Tilidine', body: 'Both are depressants. Combined they dramatically increase the risk of respiratory depression, unconsciousness and overdose. Do not mix these substances.' },
  'GHB+Kratom': { risk: 'red', title: 'GHB + Kratom', body: 'Kratom acts as a depressant at higher doses. Combined with GHB the sedative effects stack dangerously. Risk of losing consciousness and respiratory depression increases significantly.' },
  '2C-B (2C-x)+GHB': { risk: 'yellow', title: 'GHB + 2C-B', body: 'GHB can unpredictably amplify or suppress a 2C-B experience. The depressant effects of GHB combined with psychedelic disorientation make dosing very difficult. Have a sober person present.' },

  // ── Cocaine combos ──
  'Cocaine+LSD': { risk: 'yellow', title: 'Cocaine + LSD', body: 'Cocaine can temporarily ground a difficult LSD experience but also increases cardiovascular strain. The comedown of cocaine mid-trip can cause anxiety and paranoia to spike. Use sparingly.' },
  'Cannabis+Cocaine': { risk: 'yellow', title: 'Cocaine + Cannabis', body: 'Cannabis can increase heart rate which stacks with cocaine\'s stimulant effect. Some people use cannabis to take the edge off cocaine but it can also intensify anxiety and paranoia in others.' },
  'Cocaine+Fentanyl': { risk: 'red', title: 'Cocaine + Fentanyl', body: 'Street cocaine is frequently contaminated with fentanyl. Even if you didn\'t intend to combine these, always test your cocaine. Naloxone should always be nearby. This combination can be fatal.' },
  'Cocaine+Kratom': { risk: 'yellow', title: 'Cocaine + Kratom', body: 'A stimulant and substance with opioid-like effects. The combination increases cardiovascular strain and makes it harder to gauge how impaired you are. Keep doses low and avoid redosing.' },
  '2C-B (2C-x)+Cocaine': { risk: 'yellow', title: 'Cocaine + 2C-B', body: 'Both increase heart rate and blood pressure. The stimulant and psychedelic effects combined can cause significant anxiety and cardiovascular strain. Keep cocaine use minimal.' },
  'Cocaine+Nicotine': { risk: 'yellow', title: 'Cocaine + Nicotine', body: 'Both are stimulants that raise heart rate and blood pressure. Combined cardiovascular strain increases. A very common but underestimated combination — be mindful of how much you\'re smoking.' },

  // ── Cannabis combos ──
  'Cannabis+LSD': { risk: 'yellow', title: 'Cannabis + LSD', body: 'Cannabis can significantly intensify and prolong an LSD experience. This can tip into anxiety, paranoia, or an overwhelming trip. Use cannabis very cautiously and only in small amounts if at all.' },
  '2C-B (2C-x)+Cannabis': { risk: 'yellow', title: 'Cannabis + 2C-B', body: 'Cannabis can intensify 2C-B\'s psychedelic effects significantly and increase anxiety or paranoia. Use cannabis sparingly and only in a safe and comfortable environment.' },
  'Cannabis+Mescaline': { risk: 'yellow', title: 'Cannabis + Mescaline', body: 'Cannabis can amplify and unpredictably intensify a mescaline experience. Given mescaline\'s long duration, this can become overwhelming. Use cannabis minimally if at all.' },
  'Cannabis+Kratom': { risk: 'yellow', title: 'Cannabis + Kratom', body: 'Cannabis can amplify the sedative effects of kratom at higher doses. The combination may cause dizziness and nausea. Start with low doses of both.' },
  'Cannabis+Nicotine': { risk: 'yellow', title: 'Cannabis + Nicotine', body: 'A very common combination. Nicotine can briefly intensify a cannabis high. The combination increases overall nicotine dependence risk over time.' },

  // ── Fentanyl combos ──
  'Fentanyl+Tilidine': { risk: 'red', title: 'Fentanyl + Tilidine', body: 'Two opioids combined dramatically increase the risk of respiratory depression and fatal overdose. This is an extremely dangerous combination. Naloxone must be on hand.' },
  'Fentanyl+Kratom': { risk: 'red', title: 'Fentanyl + Kratom', body: 'Kratom has opioid-like effects — combining it with fentanyl stacks opioid activity dangerously. Risk of respiratory depression and overdose is very high. Naloxone must be on hand.' },

  // ── Poppers combos ──
  'Poppers+Viagra': { risk: 'red', title: 'Poppers + Viagra', body: 'Both dilate blood vessels. Combined they cause a severe drop in blood pressure that can lead to fainting, stroke, or heart attack. This is a well-known dangerous combination — never mix these.' },
  'Cocaine+Poppers': { risk: 'yellow', title: 'Poppers + Cocaine', body: 'Cocaine raises blood pressure while poppers dramatically lower it, creating dangerous cardiovascular conflict. The rapid fluctuation puts serious strain on the heart.' },
  'MDMA+Poppers': { risk: 'yellow', title: 'Poppers + MDMA', body: 'Both affect the cardiovascular system. MDMA raises heart rate and blood pressure while poppers cause a sudden drop. The combination puts significant strain on the heart. Use with extreme caution.' },
  'Ecstasy+Poppers': { risk: 'yellow', title: 'Poppers + Ecstasy', body: 'Both affect the cardiovascular system. Ecstasy raises heart rate and blood pressure while poppers cause a sudden drop. The combination puts significant strain on the heart. Use with extreme caution.' },

  // ── Psychedelics ──
  '2C-B (2C-x)+LSD': { risk: 'yellow', title: 'LSD + 2C-B', body: 'Two powerful psychedelics combined create an extremely intense and long-lasting experience. Very disorienting and can be overwhelming even for experienced users. Have a sober sitter in a safe environment.' },
  'LSD+Mescaline': { risk: 'yellow', title: 'LSD + Mescaline', body: 'Combining two powerful psychedelics creates an extremely intense and very long-lasting experience. This is not recommended — the combined duration can exceed 18 hours. Only consider with significant experience.' },
  '2C-B (2C-x)+Mescaline': { risk: 'yellow', title: 'Mescaline + 2C-B', body: 'Two psychedelics combined. Effects are intense and the duration is very long given mescaline\'s timeline. Have a sober sitter, be in a safe environment, and keep doses low.' },

  // ── Nicotine / Stimulants ──
  'MDMA+Nicotine': { risk: 'yellow', title: 'Nicotine + MDMA', body: 'Both increase heart rate. MDMA dramatically raises cardiovascular demand — adding nicotine on top compounds this. A very common but underestimated combination at events. Be mindful of how much you\'re smoking.' },
  'Ecstasy+Nicotine': { risk: 'yellow', title: 'Nicotine + Ecstasy', body: 'Both increase heart rate. Ecstasy dramatically raises cardiovascular demand — adding nicotine on top compounds this. A very common but underestimated combination at events. Be mindful of how much you\'re smoking.' },
  '3-CMC+MDMA': { risk: 'yellow', title: '3-CMC + MDMA', body: 'Two stimulants that both affect serotonin. Combined they raise the risk of serotonin syndrome, overheating, and cardiovascular strain significantly. Keep doses low and take regular breaks.' },
  '4-CMC+MDMA': { risk: 'yellow', title: '4-CMC + MDMA', body: 'Two stimulants that both affect serotonin. Combined they raise the risk of serotonin syndrome, overheating, and cardiovascular strain significantly. Keep doses low and take regular breaks.' },
  '3-CMC+Alcohol': { risk: 'yellow', title: '3-CMC + Alcohol', body: 'A stimulant and depressant that mask each other\'s effects. You may feel less drunk than you are, leading to overconsumption of both. Cardiovascular strain increases. Stay hydrated and go slow.' },
  '4-CMC+Alcohol': { risk: 'yellow', title: '4-CMC + Alcohol', body: 'A stimulant and depressant that mask each other\'s effects. You may feel less drunk than you are, leading to overconsumption of both. Cardiovascular strain increases. Stay hydrated and go slow.' },
  '3-CMC+GHB': { risk: 'red', title: '3-CMC + GHB', body: 'Stimulant and depressant combo that masks each other\'s effects. GHB has a very narrow safety window — the stimulant effect of 3-CMC makes it easy to misjudge GHB dose. Avoid redosing GHB.' },
  '4-CMC+GHB': { risk: 'red', title: '4-CMC + GHB', body: 'Stimulant and depressant combo that masks each other\'s effects. GHB has a very narrow safety window — the stimulant effect of 4-CMC makes it easy to misjudge GHB dose. Avoid redosing GHB.' },
  '3-CMC+Cocaine': { risk: 'yellow', title: '3-CMC + Cocaine', body: 'Two stimulants combined significantly raise heart rate and blood pressure. The cardiovascular strain is substantial. Keep doses very low and avoid combining if you have any heart concerns.' },
  '4-CMC+Cocaine': { risk: 'yellow', title: '4-CMC + Cocaine', body: 'Two stimulants combined significantly raise heart rate and blood pressure. The cardiovascular strain is substantial. Keep doses very low and avoid combining if you have any heart concerns.' },
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

function findCombo(selected: string[]): ComboResult | null {
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
  const [selected, setSelected] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggle = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filtered = activeCategory === 'All'
    ? SUBSTANCES
    : SUBSTANCES.filter(s => s.category === activeCategory);

  const combo: ComboResult | null = selected.length >= 2 ? findCombo(selected) : null;

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

              {(infoState === 'empty' || infoState === 'one') && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                  {infoState === 'empty'
                    ? 'Choose at least two substances to see the results'
                    : 'Choose one more substance to see the results'}
                </p>
              )}

              {infoState === 'result' && combo && (
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
                </>
              )}

              {infoState === 'result' && !combo && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                  No data available for this combination yet.
                </p>
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
