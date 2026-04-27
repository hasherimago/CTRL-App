import { useState, type JSX } from 'react';
import svgPaths from '../../../imports/svg-x1dnee4l9r';
import { BottomNav } from '../ui/BottomNav';
import combosRaw from './data/combos.json';
import { adaptCombos, findCombo } from './data/tripsitCombosAdapter';
import type { RiskLevel, ComboResult, TripSitCombos } from './data/tripsitCombosAdapter';

const COMBINATIONS: Record<string, ComboResult> = adaptCombos(combosRaw as TripSitCombos);

// ─── Custom combos — same-class pairs & missing cross-class pairs ─────────────
// Key format: sorted comboKeys joined by '+', same as adaptCombos output.
// 'same' is a special key used when both selected drugs share the same comboKey.
const CUSTOM_COMBOS: Record<string, ComboResult> = {

  // ── Same-class combinations ─────────────────────────────────────────────────
  'same:benzodiazepines': {
    risk: 'red',
    title: 'Benzodiazepines + Benzodiazepines',
    body: 'Combining two benzodiazepines compounds CNS and respiratory depression. Even at individually moderate doses, the combination can cause respiratory arrest and death. There is no recreational benefit — only significantly elevated risk.',
  },
  'same:opioids': {
    risk: 'red',
    title: 'Opioids + Opioids',
    body: 'Combining two opioids dramatically multiplies the risk of respiratory depression and overdose death. This is one of the leading causes of overdose fatality. Even at doses that seem manageable separately, the combination can be fatal.',
  },
  'same:amphetamines': {
    risk: 'red',
    title: 'Stimulants + Stimulants',
    body: 'Combining two amphetamine-class stimulants dramatically increases cardiovascular strain — elevated heart rate, blood pressure, and risk of arrhythmia or cardiac arrest. The combination also increases risk of stimulant psychosis and severe hyperthermia.',
  },
  'same:caffeine': {
    risk: 'yellow',
    title: 'Caffeine + Caffeine',
    body: 'Combining two caffeine sources increases total caffeine intake — elevated heart rate, anxiety, and insomnia risk. At high total doses (>600 mg) cardiac arrhythmia is possible. Generally low risk at moderate combined amounts.',
  },
  'same:mdma': {
    risk: 'red',
    title: 'MDMA + MDA',
    body: 'MDMA and MDA share the same serotonergic mechanism. Combining them significantly increases neurotoxic risk and raises the likelihood of serotonin syndrome, hyperthermia, and cardiac stress. The combination is harder to manage than either alone.',
  },
  'same:mephedrone': {
    risk: 'red',
    title: 'Cathinones + Cathinones',
    body: 'Combining two cathinone-class stimulants/empathogens (e.g. Mephedrone and Methylone) compounds cardiovascular strain, hyperthermia, and serotonin syndrome risk. Both substances share a mechanism — the combination is more dangerous than simply doubling the dose.',
  },
  'same:lsd': {
    risk: 'yellow',
    title: 'LSD + LSA',
    body: 'LSD and LSA both act on serotonin receptors producing psychedelic effects. The combination is synergistic — effects compound and the trip becomes stronger and longer. Start with significantly lower doses of both; tolerance cross-over means standard doses can overwhelm.',
  },
  'same:mushrooms': {
    risk: 'yellow',
    title: 'Psilocybin + Psilocybin analogs',
    body: '4-AcO-DMT and 4-HO-MET are prodrugs/analogues of psilocin, the same active compound found in mushrooms. Combining them is essentially consuming more psilocybin-like substance — effects are additive. Reduce doses of both accordingly.',
  },
  'same:mescaline': {
    risk: 'yellow',
    title: 'Mescaline + Peyote',
    body: 'Peyote\'s primary active compound is mescaline. Combining them simply increases total mescaline exposure. Effects are additive; account for the total mescaline content from both sources when dosing.',
  },
  'same:2c-x': {
    risk: 'yellow',
    title: '2C-x + 2C-x',
    body: 'Combining two 2C phenethylamines (e.g. 2C-B and 2C-E) increases serotonergic activity, stimulation, and psychedelic intensity in an unpredictable and hard-to-manage way. Each compound has a different potency and duration profile — the interaction is not simply additive.',
  },
  'same:nbomes': {
    risk: 'red',
    title: 'NBOMe + NBOMe',
    body: 'NBOMe compounds (25I-NBOMe, 25C-NBOMe) are already extremely dangerous individually due to vasoconstriction and cardiac toxicity. Combining two NBOMe substances dramatically increases overdose risk, seizure risk, and the likelihood of fatal cardiac arrest.',
  },
  'same:dox': {
    risk: 'red',
    title: 'DOx + DOx',
    body: 'DOx compounds (DOC, DOM) are very long-acting stimulating psychedelics (12–24+ hours). Combining two DOx substances creates a prolonged, intensified experience with dramatically elevated cardiovascular strain. Fatigue, sleep deprivation, and stimulant toxicity become serious concerns.',
  },
  'same:5-meo-xxt': {
    risk: 'red',
    title: '5-MeO tryptamines + 5-MeO tryptamines',
    body: '5-MeO tryptamines are among the most potent serotonergic compounds known. Combining 5-MeO-DMT, 5-MeO-MiPT, or related compounds dramatically increases the risk of serotonin syndrome, respiratory depression, and cardiovascular collapse.',
  },
  'same:pcp': {
    risk: 'red',
    title: 'PCP + 3-MeO-PCP',
    body: 'Combining PCP-class arylcyclohexylamines amplifies dissociation, stimulation, and manic/psychotic states in an unpredictable way. The combination significantly increases cardiovascular risk and the chance of dangerous, erratic behavior.',
  },
  'same:cannabis': {
    risk: 'red',
    title: 'Cannabis + Synthetic Cannabinoid',
    body: 'AB-FUBINACA is a synthetic cannabinoid far more potent and unpredictable than natural cannabis. Combining them significantly increases the risk of severe adverse effects including psychosis, seizures, cardiac events, and loss of consciousness.',
  },
  'same:diphenhydramine': {
    risk: 'yellow',
    title: 'DPH + Dimenhydrinate',
    body: 'Dimenhydrinate contains diphenhydramine as its active component. Combining them compounds anticholinergic burden — risk of delirium, confusion, urinary retention, tachycardia, and dangerous overheating increases significantly.',
  },

  // ── Missing cross-class pairs ───────────────────────────────────────────────
  'alcohol+pregabalin': {
    risk: 'red',
    title: 'Alcohol + Pregabalin',
    body: 'Both alcohol and pregabalin are CNS depressants. The combination produces synergistic respiratory and CNS depression that can be fatal. Pregabalin dramatically potentiates alcohol\'s sedative effects — even moderate doses of each can be dangerous together.',
  },
  'alcohol+lithium': {
    risk: 'yellow',
    title: 'Alcohol + Lithium',
    body: 'Alcohol can cause dehydration and electrolyte shifts that raise lithium blood levels to potentially toxic levels. Lithium has a narrow therapeutic window — increased levels can cause tremor, confusion, and cardiac abnormalities. Avoid heavy drinking while on lithium.',
  },
  'alcohol+mephedrone': {
    risk: 'red',
    title: 'Alcohol + Mephedrone',
    body: 'Alcohol is a CNS depressant while mephedrone is a stimulant/empathogen. The combination masks the sedating effects of alcohol, encouraging over-consumption. Combined cardiovascular and serotonergic strain is significant. Risk of cardiac arrhythmia and acute toxicity is elevated.',
  },
  'benzodiazepines+pregabalin': {
    risk: 'red',
    title: 'Benzodiazepines + Pregabalin',
    body: 'Combining benzodiazepines and pregabalin causes synergistic CNS and respiratory depression. Both substances are prescribed CNS depressants — together they significantly increase the risk of respiratory arrest, especially in recreational doses or in combination with other substances.',
  },
  'benzodiazepines+lithium': {
    risk: 'yellow',
    title: 'Benzodiazepines + Lithium',
    body: 'No major pharmacokinetic interaction is known, but both drugs affect the CNS. Benzodiazepines may mask signs of lithium toxicity. Lithium can occasionally lower the seizure threshold; benzodiazepines protect against seizures. Monitor closely and avoid recreational use.',
  },
  'benzodiazepines+mephedrone': {
    risk: 'red',
    title: 'Benzodiazepines + Mephedrone',
    body: 'Mephedrone is a stimulant and empathogen that may mask the sedative effects of benzodiazepines, leading to overconsumption of both. When the mephedrone wears off, the accumulated benzodiazepine dose can cause respiratory depression. Cardiovascular strain from mephedrone combined with CNS depression creates a dangerous imbalance.',
  },
  'ghb/gbl+lithium': {
    risk: 'yellow',
    title: 'GHB/GBL + Lithium',
    body: 'Limited data exists on this combination. GHB/GBL are potent CNS depressants and lithium affects sodium channels and neurotransmitter systems. The combination may unpredictably affect the CNS. Lithium users should avoid recreational depressants due to the narrow therapeutic window.',
  },
  'cannabis+diphenhydramine': {
    risk: 'yellow',
    title: 'Cannabis + DPH',
    body: 'Cannabis and diphenhydramine both impair cognition and can cause sedation. DPH has anticholinergic properties that can intensify cannabis-induced anxiety and disorientation. The combination can produce a confusing and uncomfortable dissociative-like state. Avoid high doses of either.',
  },
  'cannabis+lithium': {
    risk: 'yellow',
    title: 'Cannabis + Lithium',
    body: 'Some case reports suggest cannabis use can induce mania or mood instability in individuals taking lithium. Cannabis may also interact with lithium\'s renal clearance mechanism. Patients on lithium should discuss cannabis use with their prescriber.',
  },
  'cannabis+mephedrone': {
    risk: 'yellow',
    title: 'Cannabis + Mephedrone',
    body: 'Cannabis can amplify the anxiety, paranoia, and cardiovascular effects of mephedrone. Mephedrone\'s stimulant effects combined with cannabis\'s unpredictable psychoactive effects increase the risk of panic attacks, tachycardia, and psychological distress.',
  },
  'diphenhydramine+mdma': {
    risk: 'yellow',
    title: 'DPH + MDMA',
    body: 'DPH is an anticholinergic antihistamine that can unpredictably modulate MDMA\'s serotonergic effects. The anticholinergic burden combined with MDMA\'s effects on heart rate and temperature regulation increases cardiovascular strain and the risk of hyperthermia and urinary retention.',
  },
  'diphenhydramine+nitrous': {
    risk: 'yellow',
    title: 'DPH + Nitrous Oxide',
    body: 'Both substances are CNS depressants that impair cognition and coordination. DPH has anticholinergic and sedative effects; combining with nitrous increases disorientation and risk of losing consciousness. Risk of positional asphyxia if consciousness is lost.',
  },
  'diphenhydramine+pcp': {
    risk: 'red',
    title: 'DPH + PCP',
    body: 'Both substances cause dissociation and delirium through different mechanisms. DPH\'s anticholinergic deliriogenic effects combined with PCP\'s NMDA antagonism creates a highly unpredictable and dangerous state of confusion, psychosis, and cardiovascular instability.',
  },
  '2c-x+diphenhydramine': {
    risk: 'yellow',
    title: '2C-x + DPH',
    body: 'DPH\'s anticholinergic effects are unpredictable when combined with serotonergic psychedelics. The combination can produce an uncomfortable mix of psychedelic and delirious effects. DPH may also increase anxiety and physical discomfort during the psychedelic experience.',
  },
  '2c-t-x+diphenhydramine': {
    risk: 'red',
    title: '2C-T-x + DPH',
    body: '2C-T-x compounds can inhibit MAO enzymes, and DPH has multiple CNS effects. The combination is poorly studied and potentially dangerous. Unpredictable serotonergic and anticholinergic interactions risk severe cardiovascular and neurological complications.',
  },
  'amt+diphenhydramine': {
    risk: 'red',
    title: 'aMT + DPH',
    body: 'aMT has MAOI properties and combines serotonergic and stimulant effects. DPH\'s anticholinergic properties combined with aMT\'s multiple mechanisms creates high risk of serotonergic toxicity and severe cardiovascular strain. This combination is considered very dangerous.',
  },
  '5-meo-xxt+diphenhydramine': {
    risk: 'red',
    title: '5-MeO tryptamines + DPH',
    body: '5-MeO tryptamines are extremely potent. DPH\'s anticholinergic and sedative effects combined with a powerful serotonergic compound is unpredictable and potentially dangerous — risk of severe confusion, hyperthermia, cardiovascular collapse, and serotonin syndrome.',
  },
  'lithium+opioids': {
    risk: 'yellow',
    title: 'Lithium + Opioids',
    body: 'Limited formal data exists, but opioids cause respiratory depression that can compound sedation. Some opioids (tramadol, meperidine) carry serotonin syndrome risk which lithium may potentiate. NSAIDs used for opioid-related pain can raise lithium levels dangerously.',
  },
  'amphetamines+mephedrone': {
    risk: 'red',
    title: 'Amphetamines + Mephedrone',
    body: 'Both amphetamines and mephedrone are stimulants with serotonergic activity. Combining them causes synergistic cardiovascular strain — risk of severe tachycardia, hypertension, hyperthermia, and serotonin syndrome is significant. The combination is considered unsafe.',
  },
  'cocaine+mephedrone': {
    risk: 'red',
    title: 'Cocaine + Mephedrone',
    body: 'Both cocaine and mephedrone are powerful stimulants with cardiovascular effects. Combining them compounds vasoconstriction, tachycardia, and hypertension to dangerous levels. Mephedrone also has serotonergic effects that interact unpredictably with cocaine\'s monoamine reuptake inhibition.',
  },
  'caffeine+lithium': {
    risk: 'yellow',
    title: 'Caffeine + Lithium',
    body: 'Caffeine increases renal lithium excretion, potentially lowering lithium blood levels below therapeutic range. Conversely, caffeine withdrawal (e.g. stopping coffee) can raise lithium levels. Patients on lithium should maintain consistent caffeine intake and monitor lithium levels.',
  },
  'mephedrone+mescaline': {
    risk: 'red',
    title: 'Mephedrone + Mescaline',
    body: 'Mephedrone\'s powerful stimulant and serotonergic effects combined with mescaline\'s phenethylamine psychedelic activity creates intense cardiovascular strain and unpredictable psychological effects. Risk of hypertensive crisis, hyperthermia, and severe anxiety is high.',
  },
  '2c-x+mephedrone': {
    risk: 'red',
    title: '2C-x + Mephedrone',
    body: 'Both 2C-x compounds and mephedrone have serotonergic and stimulant properties. Combining them significantly raises the risk of serotonin syndrome, severe hypertension, hyperthermia, and cardiac arrhythmia. The combination is potentially dangerous.',
  },
  '2c-t-x+mephedrone': {
    risk: 'red',
    title: '2C-T-x + Mephedrone',
    body: '2C-T-x compounds can inhibit MAO enzymes. Combined with mephedrone\'s serotonergic stimulant activity, this creates a serious risk of serotonin syndrome and cardiovascular toxicity. This combination has caused fatalities and should be strictly avoided.',
  },
  'mephedrone+nbomes': {
    risk: 'red',
    title: 'Mephedrone + NBOMes',
    body: 'Both mephedrone and NBOMe compounds place significant strain on the cardiovascular system. The combination risks severe vasoconstriction, hypertensive crisis, tachycardia, and cardiac arrest. NBOMes are dangerous even alone — adding a stimulant empathogen amplifies this risk greatly.',
  },
  'amt+mephedrone': {
    risk: 'red',
    title: 'aMT + Mephedrone',
    body: 'aMT has MAOI properties alongside its psychedelic and stimulant effects. Combining with mephedrone — a serotonergic stimulant — creates extremely high risk of serotonin syndrome, hyperthermia, and severe cardiovascular toxicity. This combination is considered life-threatening.',
  },
  '5-meo-xxt+mephedrone': {
    risk: 'red',
    title: '5-MeO tryptamines + Mephedrone',
    body: '5-MeO tryptamines are among the most serotonergically potent compounds known. Adding mephedrone\'s serotonergic stimulant effects dramatically elevates the risk of serotonin syndrome, cardiovascular collapse, and death. This combination should never be used.',
  },
  'ketamine+mephedrone': {
    risk: 'red',
    title: 'Ketamine + Mephedrone',
    body: 'Ketamine and mephedrone place opposing demands on the cardiovascular system — ketamine raises heart rate and blood pressure, and mephedrone compounds this with additional sympathomimetic effects. The psychological effects are also difficult to manage simultaneously. Significant risk of cardiac arrhythmia.',
  },
  'mephedrone+mxe': {
    risk: 'red',
    title: 'Mephedrone + MXE',
    body: 'MXE is a dissociative with some serotonergic activity. Combined with mephedrone\'s serotonergic stimulant effects, the combination risks serotonin syndrome and unpredictable dissociative-stimulant states. Cardiovascular strain and hyperthermia are significant concerns.',
  },
  'mephedrone+pcp': {
    risk: 'red',
    title: 'Mephedrone + PCP',
    body: 'PCP and mephedrone together create a volatile combination of stimulant, empathogen, and dissociative effects. PCP is known to cause extreme agitation and psychosis; mephedrone amplifies stimulation and serotonergic activity. Risk of cardiovascular crisis and severe psychiatric episodes.',
  },
  'mephedrone+nitrous': {
    risk: 'yellow',
    title: 'Mephedrone + Nitrous Oxide',
    body: 'Nitrous oxide combined with stimulants like mephedrone creates cardiovascular strain — increased heart rate from mephedrone combined with nitrous\'s cardiac effects. The dissociative and empathogenic effects can be psychologically overwhelming. Use extreme caution with breathing and positioning.',
  },
  'maois+mephedrone': {
    risk: 'red',
    title: 'MAOIs + Mephedrone',
    body: 'This combination is extremely dangerous. MAOIs prevent the breakdown of serotonin and monoamines; mephedrone causes massive monoamine release. Together they cause life-threatening serotonin syndrome — hyperthermia, seizures, cardiovascular collapse, and death. Absolutely avoid.',
  },
  'mephedrone+ssris': {
    risk: 'red',
    title: 'SSRIs + Mephedrone',
    body: 'SSRIs inhibit serotonin reuptake; mephedrone causes serotonin release and inhibits reuptake. Together they severely elevate synaptic serotonin levels, raising the risk of serotonin syndrome — agitation, hyperthermia, clonus, and potentially fatal cardiovascular effects.',
  },
  'lithium+mephedrone': {
    risk: 'red',
    title: 'Lithium + Mephedrone',
    body: 'Lithium and serotonergic stimulants like mephedrone can interact to produce serotonin syndrome. Lithium lowers the serotonin syndrome threshold — the addition of mephedrone\'s serotonin-releasing activity creates significant risk. Mephedrone\'s cardiovascular effects are also unpredictable in patients on lithium.',
  },
  'amt+lithium': {
    risk: 'red',
    title: 'aMT + Lithium',
    body: 'aMT is a psychedelic with MAOI and serotonergic properties. Lithium is known to increase the risk of serotonin syndrome and unpredictable neurological effects when combined with serotonergic substances. This combination carries a significant risk of neurotoxicity and serotonin syndrome.',
  },
  '5-meo-xxt+lithium': {
    risk: 'red',
    title: '5-MeO tryptamines + Lithium',
    body: 'Lithium significantly lowers the threshold for serotonin syndrome and seizures when combined with serotonergic compounds. 5-MeO tryptamines are extremely potent serotonergic substances. This combination is potentially life-threatening and is known to cause violent seizures.',
  },
  'lithium+pcp': {
    risk: 'red',
    title: 'Lithium + PCP',
    body: 'PCP is a powerful NMDA antagonist that can cause psychosis and mania — effects that lithium is prescribed to treat. The pharmacodynamic interaction is unpredictable and potentially severe. PCP may also interfere with lithium\'s renal clearance, risking lithium toxicity.',
  },
  'lithium+maois': {
    risk: 'red',
    title: 'Lithium + MAOIs',
    body: 'Combining lithium and MAOIs significantly elevates the risk of serotonin syndrome. Both affect serotonin neurotransmission through different mechanisms — together they can cause hyperthermia, seizures, and cardiovascular instability. This combination is potentially life-threatening.',
  },
  'pregabalin+ssris': {
    risk: 'yellow',
    title: 'Pregabalin + SSRIs',
    body: 'Pregabalin is sometimes co-prescribed with SSRIs, but at recreational doses the combination can cause excessive sedation and dizziness. Some case reports suggest a small increased risk of serotonin-related effects. Monitor carefully and avoid high doses of pregabalin alongside SSRIs.',
  },
  '2c-t-x+pregabalin': {
    risk: 'red',
    title: '2C-T-x + Pregabalin',
    body: '2C-T-x compounds are potent phenethylamines with potential MAO inhibition. Combined with pregabalin\'s CNS depressant effects, this combination is poorly characterized but risks respiratory depression and unpredictable psychoactive effects. Avoid.',
  },
  'amt+pregabalin': {
    risk: 'red',
    title: 'aMT + Pregabalin',
    body: 'aMT has stimulant, psychedelic, and MAOI properties. Pregabalin is a CNS depressant. The opposing pharmacology creates unpredictable effects, and aMT\'s MAOI activity may dangerously potentiate pregabalin\'s sedation or cause respiratory compromise.',
  },
  'pcp+pregabalin': {
    risk: 'red',
    title: 'PCP + Pregabalin',
    body: 'PCP causes dissociation and CNS excitation; pregabalin is a CNS depressant. The combination of opposing CNS effects is unpredictable and can result in respiratory depression or paradoxical excitation. Cardiovascular effects of PCP are worsened by CNS instability.',
  },
  'maois+pregabalin': {
    risk: 'yellow',
    title: 'MAOIs + Pregabalin',
    body: 'There is limited data on this combination. MAOIs affect multiple neurotransmitter systems; pregabalin acts on voltage-gated calcium channels. The primary risk is additive CNS depression at high doses. Patients on MAOIs should consult their prescriber before using pregabalin.',
  },
  'lithium+pregabalin': {
    risk: 'yellow',
    title: 'Lithium + Pregabalin',
    body: 'Limited data exists on this specific combination. Pregabalin is a CNS depressant and lithium affects neurotransmission broadly. The primary concern is additive sedation and potential effects on lithium\'s renal clearance. Avoid recreational use of pregabalin while on lithium therapy.',
  },
};

// ─── Category filter pills ────────────────────────────────────────────────────
// 7 categories aligned with Library + Medications for prescription/OTC drugs

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'All',           color: '#8C5CFE' },
  { label: 'Stimulants',    color: '#FFADA5' },
  { label: 'Psychedelics',  color: '#B2FFF1' },
  { label: 'Depressants',   color: '#B3C3D1' },
  { label: 'Opioids',       color: '#FFD0B4' },
  { label: 'Dissociatives', color: '#CCF1FF' },
  { label: 'Empathogens',   color: '#FFBEEA' },
  { label: 'Medications',   color: '#D4B3FF' },
];

const CATEGORY_COLOR: Record<string, string> = {
  Stimulants:    '#FFADA5',
  Psychedelics:  '#B2FFF1',
  Depressants:   '#B3C3D1',
  Opioids:       '#FFD0B4',
  Dissociatives: '#CCF1FF',
  Empathogens:   '#FFBEEA',
  Medications:   '#D4B3FF',
};

// ─── Substances ───────────────────────────────────────────────────────────────
// One entry per unique comboKey where possible — no duplicate-key clutter.
// comboKey MUST exactly match a top-level key in combos.json.
// Verified keys: 2-fdck, 2c-t-x, 2c-x, 3-mmc, 5-meo-xxt, alcohol,
//   alphetamines, amt, ayahuasca, benzodiazepines, caffeine, cannabis,
//   cocaine, dextromethorphan, diphenhydramine, dmt, dox, fentanyl,
//   ghb/gbl, ketamine, lithium, lsd, maois, mdma, mephedrone, mescaline,
//   mushrooms, mxe, nbomes, nitrous, opioids, pcp, poppers, pregabalin,
//   ssris, tilidine, tramadol, viagra, 2c-x, 2c-t-x, 5-meo-xxt

interface Substance {
  name: string;     // display name in UI
  comboKey: string; // exact key from combos.json
  category: string;
  color: string;
}

const SUBSTANCES: Substance[] = [
  // ── Stimulants ──────────────────────────────────────────────────────────────
  { name: 'Cocaine',         comboKey: 'cocaine',          category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Amphetamines',    comboKey: 'amphetamines',     category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Meth',            comboKey: 'amphetamines',     category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Ritalin', comboKey: 'amphetamines',     category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Modafinil',       comboKey: 'amphetamines',     category: 'Stimulants',    color: '#FFADA5' },
  { name: 'Caffeine',        comboKey: 'caffeine',         category: 'Stimulants',    color: '#FFADA5' },

  // ── Psychedelics ─────────────────────────────────────────────────────────────
  { name: 'LSD',             comboKey: 'lsd',              category: 'Psychedelics',  color: '#B5EAD7' },
  { name: 'Mushrooms',       comboKey: 'mushrooms',        category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'DMT',             comboKey: 'dmt',              category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'Ayahuasca',       comboKey: 'ayahuasca',        category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'Mescaline',       comboKey: 'mescaline',        category: 'Psychedelics',  color: '#B2FFF1' },
  { name: '2C-B',            comboKey: '2c-x',             category: 'Psychedelics',  color: '#FFB6A3' },
  { name: 'NBOMe',           comboKey: 'nbomes',           category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'DOx',             comboKey: 'dox',              category: 'Psychedelics',  color: '#B2FFF1' },
  { name: 'aMT',             comboKey: 'amt',              category: 'Psychedelics',  color: '#B2FFF1' },
  { name: '5-MeO-MiPT',     comboKey: '5-meo-xxt',        category: 'Psychedelics',  color: '#B2FFF1' },

  // ── Depressants ──────────────────────────────────────────────────────────────
  { name: 'Alcohol',         comboKey: 'alcohol',          category: 'Depressants',   color: '#F5D163' },
  { name: 'GHB / GBL',       comboKey: 'ghb/gbl',          category: 'Depressants',   color: '#A8E6CF' },
  { name: 'Cannabis',        comboKey: 'cannabis',         category: 'Depressants',   color: '#CBFFC6' },
  { name: 'Poppers',         comboKey: 'poppers',          category: 'Depressants',   color: '#FFE5B4' },

  // ── Opioids ──────────────────────────────────────────────────────────────────
  { name: 'Heroin',          comboKey: 'opioids',          category: 'Opioids',       color: '#FFD0B4' },
  { name: 'Fentanyl',        comboKey: 'opioids',          category: 'Opioids',       color: '#FFD0B4' },
  { name: 'Oxycodone',       comboKey: 'opioids',          category: 'Opioids',       color: '#FFD0B4' },
  { name: 'Tilidine',        comboKey: 'opioids',          category: 'Opioids',       color: '#FFD0B4' },
  { name: 'Tramadol',        comboKey: 'tramadol',         category: 'Opioids',       color: '#FFD0B4' },
  { name: 'Kratom',          comboKey: 'opioids',          category: 'Opioids',       color: '#FFD0B4' },

  // ── Dissociatives ────────────────────────────────────────────────────────────
  { name: 'Ketamine',        comboKey: 'ketamine',         category: 'Dissociatives', color: '#CCF1FF' },
  { name: '2-FDCK',          comboKey: '2-fdck',           category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'DXM',             comboKey: 'dextromethorphan', category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'MXE',             comboKey: 'mxe',              category: 'Dissociatives', color: '#CCF1FF' },
  { name: 'Nitrous',         comboKey: 'nitrous',          category: 'Dissociatives', color: '#CCF1FF' },

  // ── Empathogens ──────────────────────────────────────────────────────────────
  { name: 'MDMA',            comboKey: 'mdma',             category: 'Empathogens',   color: '#FFBEEA' },
  { name: 'Mephedrone',      comboKey: 'mephedrone',       category: 'Empathogens',   color: '#FFBEEA' },
  { name: '3-MMC',           comboKey: 'mephedrone',       category: 'Empathogens',   color: '#FFBEEA' },
  { name: 'MDA',             comboKey: 'mdma',             category: 'Empathogens',   color: '#FFBEEA' },
  { name: '4-FA',            comboKey: 'amphetamines',     category: 'Empathogens',   color: '#FFBEEA' },

  // ── Medications ──────────────────────────────────────────────────────────────
  { name: 'SSRIs',           comboKey: 'ssris',            category: 'Medications',   color: '#D4B3FF' },
  { name: 'MAOIs',           comboKey: 'maois',            category: 'Medications',   color: '#D4B3FF' },
  { name: 'Xanax / Benzos',  comboKey: 'benzodiazepines',  category: 'Medications',   color: '#D4B3FF' },
  { name: 'Pregabalin',      comboKey: 'pregabalin',       category: 'Medications',   color: '#D4B3FF' },
  { name: 'Benadryl / DPH',  comboKey: 'diphenhydramine',  category: 'Medications',   color: '#D4B3FF' },
  { name: 'Lithium',         comboKey: 'lithium',          category: 'Medications',   color: '#D4B3FF' },
  { name: 'Viagra',          comboKey: 'viagra',           category: 'Medications',   color: '#D4B3FF' },
];

// ─── Risk icons & colours ─────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, { color: string; icon: JSX.Element }> = {
  green: {
    color: '#4ADE80',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="10" cy="10" r="9" fill="#4ADE80" />
        <path d="M6 10l3 3 5-5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  yellow: {
    color: '#FFD600',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="10" cy="10" r="9" fill="#FFD600" />
        <path d="M10 6.5V11" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13.5" r="0.8" fill="#111" />
      </svg>
    ),
  },
  red: {
    color: '#FF8080',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <path d="M9.134 2.5a1 1 0 0 1 1.732 0l7.794 13.5A1 1 0 0 1 17.794 17.5H2.206a1 1 0 0 1-.866-1.5L9.134 2.5Z" fill="#FF6B6B" />
        <path d="M10 8v3.5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="0.8" fill="#111" />
      </svg>
    ),
  },
};

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

  const remove = (name: string) => {
    setSelected(prev => prev.filter(n => n !== name));
  };

  const filtered = activeCategory === 'All'
    ? SUBSTANCES
    : SUBSTANCES.filter(s => s.category === activeCategory);

  const selectedComboKeys = selected.map(
    name => SUBSTANCES.find(s => s.name === name)?.comboKey ?? name
  );

  const combo = (() => {
    if (selectedComboKeys.length < 2) return null;
    // Deduplicate — multiple substances can share the same comboKey
    const uniqueKeys = [...new Set(selectedComboKeys)];
    // Same-class: all selected drugs share one comboKey
    if (uniqueKeys.length === 1) {
      return CUSTOM_COMBOS[`same:${uniqueKeys[0]}`] ?? null;
    }
    // With 3+ unique keys there is no single combo entry covering all of them.
    // Returning a partial pair match is misleading, so return null instead.
    if (uniqueKeys.length > 2) return null;
    // Exactly 2 unique keys — check custom pairs first, then TripSit
    const sortedPair = [...uniqueKeys].sort().join('+');
    if (CUSTOM_COMBOS[sortedPair]) return CUSTOM_COMBOS[sortedPair];
    return findCombo(uniqueKeys, COMBINATIONS);
  })();

  // Always show the actual selected drug names as the title
  const displayTitle = selected.join(' + ');

  const infoState = selected.length === 0 ? 'empty'
    : selected.length === 1 ? 'one'
    : combo ? 'result'
    : 'nodata';
  const riskConfig = combo?.risk ? RISK_CONFIG[combo.risk] : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0D0D0D', overflow: 'hidden' }}>

      {/* ── FIXED HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          <button onClick={onProfileOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Open profile">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
              <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
            </svg>
          </button>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', margin: 0, lineHeight: 1.5 }}>
            Combo Checker
          </p>
          <button onClick={onSearchOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Open search">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
              <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="hide-scrollbar" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
        <div style={{ paddingTop: '56px' }}>

          {/* ── RESULT PANEL ── */}
          <div style={{ padding: '16px 8px 0' }}>
            <div style={{
              borderRadius: '16px', border: '1px solid #1E1E1E', background: '#111111',
              minHeight: '160px', padding: '20px', display: 'flex', flexDirection: 'column',
              justifyContent: infoState === 'result' ? 'flex-start' : 'center',
              alignItems: infoState === 'result' ? 'flex-start' : 'center',
            }}>
              {(infoState === 'empty' || infoState === 'one') && (
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '15px', color: '#F1F1F1', opacity: 0.3, textAlign: 'center', margin: 0, letterSpacing: '0.32px', lineHeight: 1.5 }}>
                  {infoState === 'empty'
                    ? 'Choose at least two substances to see the results'
                    : 'Choose one more substance to see the results'}
                </p>
              )}

              {infoState === 'result' && combo && riskConfig && (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                    {riskConfig.icon}
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: riskConfig.color, margin: 0, letterSpacing: '0.32px', lineHeight: 1.4 }}>
                      {displayTitle}
                    </p>
                  </div>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#F1F1F1', opacity: 0.7, margin: 0, letterSpacing: '0.28px', lineHeight: 1.65 }}>
                    {combo.body}
                  </p>
                </>
              )}

              {infoState === 'nodata' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#F1F1F1" strokeOpacity="0.2" strokeWidth="1.5" />
                    <path d="M12 8v5" stroke="#F1F1F1" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="0.8" fill="#F1F1F1" fillOpacity="0.4" />
                  </svg>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '15px', color: '#F1F1F1', opacity: 0.45, margin: 0, letterSpacing: '0.32px' }}>
                    No interaction data available
                  </p>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', color: '#F1F1F1', opacity: 0.25, margin: 0, letterSpacing: '0.26px', lineHeight: 1.6 }}>
                    We couldn't find data for this combination. That doesn't mean it's safe — research each substance individually before combining.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── SELECTED TAGS ── */}
          <div style={{ padding: '12px 8px 0' }}>
            <div className="hide-scrollbar" style={{ overflowX: 'auto', scrollbarWidth: 'none', minHeight: '30px' }}>
              {selected.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: 'max-content' }}>
                  {selected.map(name => (
                    <div key={name} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(241,241,241,0.08)',
                      border: '1px solid rgba(241,241,241,0.18)',
                      borderRadius: '44px', padding: '6px 10px 6px 12px',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px',
                        color: '#F1F1F1', whiteSpace: 'nowrap', lineHeight: 1,
                      }}>
                        {name}
                      </span>
                      <button
                        onClick={() => remove(name)}
                        aria-label={`Remove ${name}`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '16px', height: '16px', flexShrink: 0,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.5" fill="rgba(241,241,241,0.15)" />
                          <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#F1F1F1" strokeOpacity="0.6" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── CATEGORY FILTER STRIP ── */}
          <div className="hide-scrollbar" style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '12px 8px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', width: 'max-content' }}>
              {CATEGORIES.map(({ label, color }) => {
                const isActive = activeCategory === label;
                return (
                  <button key={label} onClick={() => setActiveCategory(label)} style={{
                    background: isActive ? color : 'transparent',
                    border: isActive ? 'none' : `1px solid ${color}`,
                    borderRadius: '44px', padding: '8px 12px',
                    fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px',
                    color: isActive ? '#0D0D0D' : color,
                    cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1.3, flexShrink: 0,
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
                    padding: '14px 8px', borderRadius: '12px',
                    border: isSelected ? `1.5px solid ${sub.color}`: '1.5px solid #2A2A2A',  // same width, just dimmer color
                    background: isSelected ? `${sub.color}1A` : '#171717',
                    color: isSelected ? sub.color : '#F1F1F1',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '14px', letterSpacing: '0.28px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <BottomNav activeTab="Checker" onTabChange={onTabChange} />
    </div>
  );
}
