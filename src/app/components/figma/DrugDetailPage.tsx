import { useState } from 'react';
import svgPaths from '../../../imports/svg-0uazz9hzf3';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';

// ─── Drug images ──────────────────────────────────────────────────────────────
import imgFentanyl   from 'figma:asset/ae5ee5272e00bda061d8408823d886def6a1042f.png';
import imgTilidine   from 'figma:asset/265f35c7d228c312571fd9378e870d172ecf9ad7.png';
import imgKetamine   from 'figma:asset/f5502ba7f5b6db5c7eaea8904cdc58247616ce67.png';
import imgMephedrone from 'figma:asset/37caa7cf43211d15ebdf3fdc7a002e0ae36c234b.png';
import imgMDMA       from 'figma:asset/b7f282cb0401597a3df9104ae60428dd05e2180a.png';
import imgCannabis   from 'figma:asset/5c43ab744872d94da08e20e185de8c7977fc9fdc.png';
import imgCocaine    from 'figma:asset/5b99b9d16ca4c921e699048e6414fe7d22af6ed3.png';
import imgMephedrone2 from 'figma:asset/bfc20b12edb8c711ad76ca54051c2443f5582e45.png';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

export interface DrugDetailPageProps {
  drugId: number;
  onBack: () => void;
  onTabChange: (tab: NavTab) => void;
  onSearchOpen?: () => void;
}

interface Tag { label: string; color: string; }
interface Section { id: string; title: string; content: string; }
interface DrugData {
  id: number;
  name: string;
  aliases: string[];
  tags: Tag[];
  image: string;
  description: string[];
  sections: Section[];
}

// ─── Drug content data ────────────────────────────────────────────────────────

const DRUG_DATA: DrugData[] = [
  {
    id: 1,
    name: 'Fentanyl',
    aliases: ['Drop Dead', 'China White', 'Synthetic heroin'],
    tags: [{ label: 'Opioids', color: '#FFD0B4' }],
    image: imgFentanyl,
    description: [
      'Fentanyl is an analgesic used to treat very severe and chronic pain and belongs to the group of opioid analgesics. Opioids are chemically synthesized substances that have the same mechanism of action as natural opiates (morphine and codeine).',
      'Fentanyl has an effect up to 100 times stronger than morphine and is one of the strongest painkillers available.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Fentanyl produces intense euphoria, pain relief, sedation, and a sense of deep relaxation. It activates opioid receptors in the brain, releasing dopamine and creating feelings of warmth and pleasure. Effects include drowsiness, confusion, nausea, and critically — slowed breathing. Onset depends heavily on the route of administration: intravenous use produces near-instant effects, while patches release the drug slowly over 72 hours.' },
      { id: 'dosage', title: 'Dosage', content: 'Fentanyl is extremely potent — therapeutic doses are measured in micrograms (μg), not milligrams. Medical doses range from 25–200 μg depending on the form and patient tolerance. Street fentanyl has no consistent dosage — even a tiny amount (2 μg) can be lethal for a non-tolerant person. Never use alone, and always test your supply with a fentanyl test strip before use.' },
      { id: 'risks', title: 'Risks', content: 'The primary risk is fatal respiratory depression — breathing slows to a stop. Overdose can occur even with a single dose in non-tolerant users. Other risks include physical dependence forming within days, severe withdrawal symptoms, and contamination of other street drugs with fentanyl. Analogs like carfentanil are up to 100× more potent and increasingly common in the supply.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Always carry naloxone (Narcan) and ensure someone nearby knows how to administer it. Never use alone — have a trusted person present. Test your supply using fentanyl test strips before every use. Start with an extremely small amount. Avoid mixing with alcohol, benzodiazepines, or other depressants. If an overdose occurs, administer naloxone immediately, place the person in the recovery position, and call emergency services.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Combining fentanyl with any other central nervous system depressant dramatically increases overdose risk. Alcohol, benzodiazepines (Xanax, Valium), gabapentin, and other opioids all amplify respiratory depression — this combination is responsible for the majority of opioid overdose deaths. Stimulants may mask sedation, leading to dangerous redosing. Even cannabis can impair judgment around dose management.' },
      { id: 'extender', title: 'Extender', content: 'Fentanyl is frequently used as an adulterant in other street drugs including heroin, cocaine, MDMA, and counterfeit pills (fake Xanax, Adderall). Because it is so potent, microscopic traces can cause overdose in users who are not opioid-tolerant. Always test any street drug with a fentanyl test strip before use — this is a critical harm reduction practice that saves lives.' },
    ],
  },
  {
    id: 2,
    name: 'Tilidine',
    aliases: ['Valoron', 'Valtran', 'Tilicer'],
    tags: [{ label: 'Opioids', color: '#FFD0B4' }],
    image: imgTilidine,
    description: [
      'Tilidine is a synthetic opioid analgesic primarily used in German-speaking countries for moderate to severe pain relief. It is commonly combined with naloxone to reduce misuse potential and lower overdose risk.',
      'Tilidine binds to mu-opioid receptors in the brain and nervous system, producing pain relief, euphoria, and sedation. Despite its medical use, it carries significant addiction risk when misused.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Tilidine produces pain relief, euphoria, warmth, and sedation by activating mu-opioid receptors. Effects begin within 15–30 minutes orally and last 4–6 hours. Users report feelings of relaxation and a mild high. High doses or injection (bypassing the naloxone barrier) intensify euphoric effects significantly.' },
      { id: 'dosage', title: 'Dosage', content: 'Medical doses typically range from 50–100 mg per dose, up to 400 mg/day. Street use often involves higher doses to overcome the naloxone component. The therapeutic window is narrow — recreational doses approaching or exceeding 200 mg can cause significant respiratory depression, especially in non-tolerant individuals.' },
      { id: 'risks', title: 'Risks', content: 'Key risks include respiratory depression, physical dependence (can develop within weeks of regular use), and severe withdrawal. The combined naloxone formulation reduces but does not eliminate abuse potential. Injecting the oral solution causes immediate precipitated withdrawal. Overdose risk is highest when combined with other CNS depressants.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Never use alone. Keep naloxone (Narcan) accessible. Avoid injecting oral formulations — this is extremely dangerous. Start with the lowest possible dose if tolerance is unknown. Do not mix with alcohol, benzodiazepines, or other opioids. Seek medical help for withdrawal — abrupt cessation after dependence is very uncomfortable and potentially dangerous.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Combining tilidine with CNS depressants (alcohol, benzodiazepines, other opioids, antihistamines) multiplies the risk of fatal respiratory depression. Stimulants like cocaine or MDMA can mask drowsiness, leading to accidental overdose through redosing. MAO inhibitors combined with tilidine can trigger a dangerous serotonin syndrome-like reaction.' },
      { id: 'extender', title: 'Extender', content: 'Like other opioids, tilidine is sometimes used as an adulterant or substituted for other drugs in street supply chains. It may appear in pills sold as other substances. Always use a fentanyl test strip before use — fentanyl contamination in opioid supply is increasingly common and potentially lethal even in tiny amounts.' },
    ],
  },
  {
    id: 3,
    name: 'Ketamine',
    aliases: ['Special K', 'Kit Kat', 'Cat Valium'],
    tags: [{ label: 'Dissociatives', color: '#CCF1FF' }],
    image: imgKetamine,
    description: [
      'Ketamine is a dissociative anesthetic used medically for induction of anesthesia and increasingly for treatment-resistant depression. It creates a unique altered state involving perceptual distortions, dissociation, and sometimes profound out-of-body experiences.',
      'At lower doses ketamine produces mild dissociation and euphoria; higher doses produce the "K-hole" — a deep, immersive dissociative state where users feel completely detached from their body and reality.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Ketamine produces dose-dependent dissociative effects — from mild time distortion and euphoria at low doses ("K-buzz") to complete ego dissolution and sensory dissociation at higher doses ("K-hole"). Effects include altered perception of space and time, visual and auditory hallucinations, numbness, and a floating sensation. Onset is rapid by insufflation (2–5 min) or injection, slower orally.' },
      { id: 'dosage', title: 'Dosage', content: 'By insufflation: threshold 15–30 mg, light 30–75 mg, common 75–150 mg, K-hole 200+ mg. Effects last 45–90 min by insufflation. Oral doses are roughly 1.5–2× higher. Tolerance develops rapidly with frequent use. Redosing is common but increases risk of bladder damage. Always measure doses accurately — a small digital scale is essential.' },
      { id: 'risks', title: 'Risks', content: 'The most severe long-term risk is ketamine cystitis — serious, sometimes irreversible bladder and urinary tract damage from chronic use. Psychological dependence is significant; the dissociative high is highly habit-forming. Acute risks include injury (inability to move, falling), vomiting while incapacitated, and psychological distress. High-dose use suppresses the gag reflex — aspiration risk if vomiting occurs.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Use in a safe, seated or lying position with a trusted person present. Never use alone at high doses. Limit use frequency — maximum 1–2× per month to reduce bladder damage risk. Stay hydrated but do not over-hydrate. Avoid redosing excessively. If urinary pain, blood in urine, or frequent urination develops, stop use immediately and seek medical attention. Do not mix with other depressants.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Combining ketamine with CNS depressants (alcohol, benzodiazepines, opioids, GHB) dramatically increases risk of respiratory depression and unconsciousness. The "downer on top of dissociative" combination is responsible for many ketamine-related harms. MDMA + ketamine is very popular but strains the cardiovascular system. Stimulants + ketamine create unpredictable cardiovascular load.' },
      { id: 'extender', title: 'Extender', content: 'Street ketamine is relatively often mis-sold as other substances, particularly MDMA or cocaine in powder form. Reagent test kits (Mandelin, Mecke) can identify ketamine. Always test unknown powders — presence of fentanyl in any powder supply is a serious and increasing risk.' },
    ],
  },
  {
    id: 4,
    name: 'Mephedrone',
    aliases: ['4MMC', 'Mephi', 'Meow'],
    tags: [{ label: 'Stimulants', color: '#FFADA5' }],
    image: imgMephedrone,
    description: [
      'Mephedrone (4-methylmethcathinone) is a synthetic cathinone stimulant and entactogen that became widely popular as a legal high before being banned in most countries. It produces intense euphoria, increased energy, and strong empathogenic effects.',
      'Mephedrone has a very short duration of action with a compelling urge to redose — a property that makes compulsive use and binge patterns extremely common among users.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Mephedrone produces euphoria, increased sociability, heightened empathy, energy boost, and tactile enhancement. Effects onset within 15–45 min orally or 5–10 min by insufflation, lasting 2–3 hours. The strong compulsion to redose when effects fade is a hallmark of mephedrone use.' },
      { id: 'dosage', title: 'Dosage', content: 'Oral threshold is 75–100 mg; active dose 100–200 mg. By insufflation, effects are felt at 50–75 mg. Redosing is common — total consumption per session can reach 500–1000 mg+. This high cumulative dose is where serious cardiovascular, psychiatric, and neurotoxic risks appear. Measuring each dose and setting hard limits before starting is critical.' },
      { id: 'risks', title: 'Risks', content: 'Cardiovascular risks include tachycardia, hypertension, and arrhythmia — particularly dangerous in those with pre-existing heart conditions. Psychiatric risks include severe anxiety, paranoia, and psychosis during and after use. Heavy binge use has caused seizures, hyperthermia, and cardiac arrest. Comedown effects include depression, fatigue, and anxiety lasting days. Addiction risk is high due to the intense compulsion to redose.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Set a hard dose limit BEFORE you start and stick to it. Use a timer to space doses at minimum 90-minute intervals. Avoid insufflation — nasal damage accumulates rapidly. Stay hydrated. Monitor body temperature. Use with trusted friends who can intervene if behavior becomes erratic. Take regular breaks and plan recovery days. Do not mix with other stimulants, alcohol, or uppers.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Combining mephedrone with other stimulants (cocaine, amphetamine, MDMA) creates severe cardiovascular strain. Mixing with alcohol increases dehydration and masks intoxication signals. Combining with depressants (opioids, benzos) creates unpredictable interactions. SSRIs/SNRIs can trigger serotonin syndrome — particularly dangerous.' },
      { id: 'extender', title: 'Extender', content: 'Mephedrone is often sold as MDMA or other substances. Street pills or powders labeled as MDMA, cocaine, or speed may contain mephedrone or other cathinones. Use a reagent test kit (Marquis, Mecke, Simon\'s) to identify substances before use. Fentanyl test strips should also be used with any unknown powder.' },
    ],
  },
  {
    id: 5,
    name: 'MDMA',
    aliases: ['Molly', 'XTC', 'Mandy'],
    tags: [{ label: 'Psychedelics', color: '#B2FFF1' }],
    image: imgMDMA,
    description: [
      'MDMA (3,4-methylenedioxymethamphetamine) is an empathogen and entactogen that produces intense feelings of emotional closeness, euphoria, and heightened sensory perception. It is widely used in party and rave culture and is being studied for therapeutic use in PTSD treatment.',
      'MDMA works by massively flooding the brain with serotonin, dopamine, and norepinephrine. The resulting "serotonin dump" creates its characteristic effects but also contributes to neurotoxic risk with frequent use.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'MDMA produces profound euphoria, feelings of emotional openness and love, increased sociability, empathy, and enhanced sensory experience — music sounds richer, touch is more pleasurable. Physical effects include increased heart rate, pupil dilation, jaw clenching, and sweating. Effects onset 30–60 min orally, peak at 90 min, and last 3–5 hours. A comedown of fatigue and low mood typically follows.' },
      { id: 'dosage', title: 'Dosage', content: 'Typical active dose is 75–125 mg. A rough guide is 1–1.5 mg/kg body weight. Street pills vary enormously in strength (50–300 mg+) — always test and consider splitting pills. Redosing one time at approximately half the original dose extends the experience; more redoses sharply increase neurotoxic risk and worsen the comedown. Follow the "3-month rule": use no more than once every 3 months.' },
      { id: 'risks', title: 'Risks', content: 'Hyponatremia (dangerously low sodium from over-drinking water) has caused deaths — drink no more than 500 ml/hour of water, or electrolyte drinks when dancing. Hyperthermia (overheating) is a major risk in hot environments. Cardiovascular strain, serotonin syndrome risk, and potential long-term neurotoxicity from frequent use are serious concerns. The comedown can trigger temporary depression.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Test your pills with a reagent kit (Marquis, Mecke, Simon\'s) AND a fentanyl test strip. Dose accurately — crush and weigh or split the pill. Stay at a comfortable temperature; take breaks from dancing. Drink 250–500 ml of water per hour if dancing, less if not. Take supplements: 5-HTP the day after (not day of) may help recovery. Plan for a rest day following use.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Combining MDMA with MAO inhibitors (including some SSRIs and recreational drugs like Syrian rue) can cause life-threatening serotonin syndrome. Mixing with stimulants (cocaine, amphetamine) amplifies cardiovascular stress. Alcohol causes additional dehydration and liver stress. Lithium may trigger seizures. If taking psychiatric medications, consult a harm reduction service before using MDMA.' },
      { id: 'extender', title: 'Extender', content: 'MDMA pills and powders are frequently adulterated — common adulterants include methamphetamine, cathinones (mephedrone, methylone), PMA/PMMA (much more dangerous), and NBOMe compounds. PMA/PMMA is particularly deadly, with a narrow margin between active and lethal doses. Always test with Marquis reagent (MDMA turns purple-black; PMA stays orange) and a fentanyl test strip.' },
    ],
  },
  {
    id: 6,
    name: 'Cannabis',
    aliases: ['Marijuana', 'Ganja', 'Weed'],
    tags: [{ label: 'Cannabinoids', color: '#CBFFC6' }],
    image: imgCannabis,
    description: [
      'Cannabis is one of the most widely used psychoactive substances globally. It contains hundreds of compounds, with THC (tetrahydrocannabinol) being the primary psychoactive ingredient and CBD (cannabidiol) offering modulating and therapeutic effects.',
      'The effects of cannabis vary enormously based on the THC:CBD ratio, method of use, dose, and individual tolerance. Modern high-potency strains and concentrates carry significantly different risk profiles than traditional lower-THC preparations.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Cannabis produces relaxation, euphoria, altered time perception, heightened sensory experience, and increased appetite. At higher doses or with high-THC strains: intense psychedelic effects, paranoia, and anxiety can occur. Smoked/vaped onset is 2–10 minutes lasting 2–3 hours. Edibles onset is 30–90 min but effects last 4–8 hours and are significantly more intense — a common source of accidental overconsumption.' },
      { id: 'dosage', title: 'Dosage', content: 'For flower (smoked/vaped): 1–2 puffs is a threshold dose; a full joint may be several times a normal dose. For edibles: 5–10 mg THC is a beginner dose. The golden rule: "start low, go slow." With edibles, wait at least 2 hours before redosing. High-THC concentrates (dabs, wax, shatter) can contain 70–90% THC — extreme caution required, especially for inexperienced users.' },
      { id: 'risks', title: 'Risks', content: 'Acute risks include anxiety, panic attacks, and psychotic episodes — particularly with high doses or high-THC strains in predisposed individuals. Regular heavy use is associated with cannabis use disorder, memory impairment, and for adolescents, increased risk of psychosis. Smoking cannabis causes respiratory harm similar to tobacco. Driving or operating machinery while impaired significantly increases accident risk.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Choose strains or products with a balanced THC:CBD ratio — CBD moderates some of THC\'s anxiogenic and psychotic effects. Use a vaporizer instead of smoking to reduce respiratory harm. Do not mix with tobacco (nicotine dependence risk). Avoid use if you have personal or family history of psychosis or schizophrenia. Keep edibles safely stored and clearly labeled — accidental consumption by children is a serious concern.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Combining cannabis with alcohol ("crossfading") significantly increases risk of nausea, vomiting, severe anxiety, and "greening out." With psychedelics, cannabis can amplify and destabilize the experience unpredictably. With stimulants, it adds cardiovascular strain. Cannabis can reduce the clearance of some medications — check interactions if on prescribed drugs.' },
      { id: 'extender', title: 'Extender', content: 'Synthetic cannabinoids ("spice," K2) are sometimes sold as cannabis or used to spray cannabis flower. These compounds carry significantly higher and less predictable risks than THC — including severe agitation, psychosis, heart attacks, and death. If cannabis produces effects much more intense than expected, suspect synthetic contamination.' },
    ],
  },
  {
    id: 7,
    name: 'Cocaine',
    aliases: ['Coke', 'Candy', 'Flake'],
    tags: [{ label: 'Stimulants', color: '#FFADA5' }],
    image: imgCocaine,
    description: [
      'Cocaine is a powerful stimulant derived from the coca plant. It produces intense but short-lived euphoria, increased energy, and feelings of confidence by blocking the reuptake of dopamine, serotonin, and norepinephrine.',
      'Its very short duration of action (30–60 minutes) drives frequent redosing and creates a highly reinforcing use pattern, making cocaine one of the most psychologically addictive substances available.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Cocaine rapidly produces euphoria, increased energy, reduced appetite, heightened alertness, and feelings of confidence. By insufflation, onset is 3–5 minutes and effects last 30–60 minutes. The strong compulsion to redose when effects fade is a hallmark of cocaine use. Smoking crack cocaine produces an even more intense but shorter-lasting (5–15 min) high with correspondingly stronger compulsion to redose.' },
      { id: 'dosage', title: 'Dosage', content: 'A typical line is approximately 50–100 mg by insufflation. Effects are felt at 20–30 mg. Street cocaine purity varies enormously — from under 20% to over 80%. Lack of knowledge about purity makes dose estimation difficult. Never eyeball a dose from an unknown batch. Cardiovascular risk scales sharply with dose, frequency, and individual heart health.' },
      { id: 'risks', title: 'Risks', content: 'Cardiac arrest, even in young and otherwise healthy users, is the primary acute risk — cocaine causes coronary artery spasm and increased cardiac demand simultaneously. Chronic insufflation causes progressive nasal septum damage and eventual perforation. Psychological dependence is very high. Mixing with alcohol forms cocaethylene in the liver — significantly increasing cardiovascular toxicity.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Use your own clean surface and straw/card — never share snorting equipment (bloodborne disease transmission risk). Rinse nasal passages with saline after use. Take long breaks between uses. Avoid mixing with alcohol or other stimulants. Do not use if you have any heart condition or family history of cardiac events. Test your supply — fentanyl-contaminated cocaine has caused numerous fatal overdoses.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'Alcohol + cocaine produces cocaethylene in the liver — a compound more toxic than either substance alone, with a longer half-life and greater cardiovascular toxicity. This combination is responsible for a high proportion of cocaine-related deaths. Mixing with stimulants (MDMA, amphetamine) severely strains the cardiovascular system. Combining with opioids (speedball) creates a particularly deadly interaction.' },
      { id: 'extender', title: 'Extender', content: 'Cocaine is one of the most adulterated street drugs. Common adulterants include levamisole (linked to severe immune suppression), phenacetin (nephrotoxic), lidocaine, and benzocaine. Critically, fentanyl contamination in cocaine has dramatically increased — many cocaine overdose deaths involve fentanyl. Always test with a fentanyl strip and reagent test kit before use.' },
    ],
  },
  {
    id: 8,
    name: 'Poppers',
    aliases: ['Liquid Gold', 'Snappers', 'PP'],
    tags: [
      { label: 'Inhalants', color: '#EEEEEE' },
    ],
    image: imgMephedrone2,
    description: [
      'Poppers (alkyl nitrites) are a group of inhalant drugs sold as liquids that release vapours when opened. They produce a short, intense rush of euphoria, muscle relaxation, and a warm flushing sensation lasting 1–3 minutes.',
      'Widely used in party and LGBTQ+ spaces, poppers are known for enhancing music, touch, and sexual experience. Despite their common perception as "safe," they carry real risks — especially in combination with certain medications.',
    ],
    sections: [
      { id: 'effect', title: 'Effect', content: 'Poppers cause a rapid vasodilation (widening of blood vessels), producing a brief rush of warmth, lightheadedness, euphoria, and heightened sensory experience. Muscles relax — including smooth muscle tissue — which is why they are widely used for anal sex. Effects peak within 30–60 seconds and last 1–3 minutes. Dizziness, flushing, and a brief drop in blood pressure are common.' },
      { id: 'dosage', title: 'Dosage', content: 'Poppers are inhaled directly from the bottle — 1–3 short sniffs from a held-open bottle is a typical use. They should never be swallowed — ingestion can cause severe methemoglobinemia (a dangerous blood condition) and is potentially fatal. Keep the bottle away from eyes and skin; direct contact causes chemical burns. Do not inhale from bags or enclosed spaces.' },
      { id: 'risks', title: 'Risks', content: 'Swallowing poppers can be fatal — keep away from lips and children. Eye or skin contact causes severe chemical burns. In people with cardiovascular conditions, the sudden blood pressure drop can trigger fainting or cardiac events. Regular heavy use can cause methemoglobinemia (reduces blood\'s oxygen-carrying capacity). Poppers have been linked to vision loss (Poppers Maculopathy) in some users, particularly with heavy use.' },
      { id: 'safer-use', title: 'Safer Use', content: 'Inhale vapours only — never swallow. Keep bottle upright to avoid spills onto skin. Use in well-ventilated spaces. Do not use while lying down (increases dizziness and fall risk). Avoid using in quick succession — give your body time to recover blood pressure between uses. Stop use if you experience eye pain, blurred vision, or severe headache and seek medical attention.' },
      { id: 'mixed-use', title: 'Mixed use', content: 'The most dangerous combination is poppers with PDE5 inhibitors (Viagra, Cialis, Levitra) — both cause vasodilation and the combination can cause a fatal drop in blood pressure. Do not combine under any circumstances. Combining with alcohol amplifies dizziness and cardiovascular stress. Use alongside stimulants increases cardiac strain.' },
      { id: 'extender', title: 'Extender', content: 'Since regulations on amyl nitrite tightened in some countries, poppers are now commonly sold as isopropyl or isobutyl nitrite. These variants carry higher risk of methemoglobinemia and eye damage than the original amyl nitrite formulation. The bottle label may say "room odorizer" or "leather cleaner" — these are all poppers. Regardless of the exact compound, the same safety rules apply.' },
    ],
  },
];

// ─── Hero image per drug ──────────────────────────────────────────────────────

function DrugHeroImage({ drug }: { drug: DrugData }) {
  // Ketamine card image is rotated — straighten it for the detail hero
  const style: React.CSSProperties = {
    width: '260px',
    height: '260px',
    objectFit: 'contain',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return <img src={drug.image} alt={drug.name} style={style} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DrugDetailPage({ drugId, onBack, onTabChange, onSearchOpen }: DrugDetailPageProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const drug = DRUG_DATA.find((d) => d.id === drugId) ?? DRUG_DATA[0];

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 10,
          }}
        >
          {/* Back arrow */}
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
              <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
            </svg>
          </button>

          {/* Search */}
          <button
            onClick={onSearchOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: `${LAYOUT.NAV_HEIGHT}px`,
          left: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Hero image area */}
        <div
          style={{
            paddingTop: '56px',
            height: '320px',
            position: 'relative',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <DrugHeroImage drug={drug} />
        </div>

        {/* Info card */}
        <div
          style={{
            position: 'relative',
            background: '#171717',
            borderRadius: '20px',
            margin: '0 8px 32px',
            padding: '16px',
          }}
        >
          {/* Share icon */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d={svgPaths.p1fbe6e80} fill="#F1F1F1" />
                <path d={svgPaths.p378ae500} fill="#F1F1F1" />
              </svg>
            </button>
          </div>

          {/* Title + aliases */}
          <div style={{ marginBottom: '16px' }}>
            <h1
              style={{
                fontFamily: "'TT Travels Next Trial Variable', sans-serif",
                fontWeight: 700,
                fontSize: '32px',
                color: '#F1F1F1',
                letterSpacing: '0.64px',
                lineHeight: 1.5,
                margin: '0 0 8px 0',
              }}
            >
              {drug.name}
            </h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {drug.aliases.map((alias) => (
                <p
                  key={alias}
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#F1F1F1',
                    opacity: 0.4,
                    margin: 0,
                    letterSpacing: '0.32px',
                    lineHeight: 1.3,
                  }}
                >
                  {alias}
                </p>
              ))}
            </div>
          </div>

          {/* Category tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {drug.tags.map((tag) => (
              <div
                key={tag.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 12px',
                  border: `1px solid ${tag.color}`,
                  borderRadius: '100px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: tag.color,
                    letterSpacing: '0.32px',
                    lineHeight: 1.3,
                  }}
                >
                  {tag.label}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            {drug.description.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#F1F1F1',
                  letterSpacing: '0.32px',
                  lineHeight: 1.3,
                  margin: i < drug.description.length - 1 ? '0 0 12px 0' : 0,
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Expandable sections */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {drug.sections.map((section, idx) => (
              <div key={section.id}>
                {idx > 0 && (
                  <div style={{ height: '1px', background: 'rgba(241,241,241,0.1)' }} />
                )}
                <div style={{ padding: '16px 0' }}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#FFFFFF',
                        letterSpacing: '0.36px',
                        lineHeight: 1.5,
                        margin: 0,
                        textAlign: 'left',
                      }}
                    >
                      {section.title}
                    </p>

                    {/* Plus → × toggle */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.25s ease',
                        transform: openSection === section.id ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d={svgPaths.p2f92f800} fill="#F1F1F1" />
                        <path
                          clipRule="evenodd"
                          d={svgPaths.p1acbbd80}
                          fill="#F1F1F1"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {openSection === section.id && (
                    <div style={{ paddingTop: '12px' }}>
                      <p
                        style={{
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 400,
                          fontSize: '15px',
                          color: '#F1F1F1',
                          letterSpacing: '0.3px',
                          lineHeight: 1.6,
                          margin: 0,
                          opacity: 0.8,
                        }}
                      >
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacing so content clears the nav bar */}
        <div style={{ height: `${LAYOUT.CONTENT_BOTTOM_PADDING}px` }} />
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Library" onTabChange={onTabChange} />
    </div>
  );
}