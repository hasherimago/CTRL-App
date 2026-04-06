import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  badge: string;        // "Warning" | "Update" | "Caution"
  badgeColor: string;   // hex
  title: string;        // 2–4 words, uppercase in render
  summary: string;      // 1 sentence shown on home card
  body: string;         // 3–5 sentences for article page
  date: string;         // "DD.MM.YYYY" — shown on article page
  category: string;
  categoryColor: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  Opioids:       '#FFD0B4',
  Stimulants:    '#FFADA5',
  Psychedelics:  '#B2FFF1',
  Depressants:   '#B3C3D1',
  Dissociatives: '#CCF1FF',
  Empathogens:   '#FFBEEA',
  NPS:           '#E9FF93',
  General:       '#C9B2FF',
};

export const FALLBACK_NEWS: NewsItem[] = [
  {
    badge: 'Warning',
    badgeColor: '#FF5545',
    title: 'Nitazene in\nStreet Opioids',
    summary: 'Isotonitazene detected in heroin and counterfeit oxycodone across multiple European countries.',
    body: 'European drug checking services have identified isotonitazene and metonitazene contaminating heroin and counterfeit oxycodone tablets across multiple countries. These synthetic opioids are significantly more potent than heroin.\n\nThey have been linked to a sharp rise in overdose deaths. Carry naloxone and never use alone.\n\nIf you or someone you know has used street opioids recently, watch for signs of overdose: slow breathing, blue lips, unresponsive.',
    date: '01.04.2026',
    category: 'Opioids',
    categoryColor: CATEGORY_COLOR['Opioids'],
  },
  {
    badge: 'Caution',
    badgeColor: '#FFD400',
    title: 'High-dose\nMDMA pills',
    summary: 'Pills sold as ecstasy in Berlin and Amsterdam tested at over 250mg MDMA — more than double a standard dose.',
    body: 'Drug checking services in Berlin and Amsterdam have flagged a batch of blue pressed pills containing over 250mg MDMA per tablet. Standard recreational doses are 80–120mg.\n\nTaking a full pill of this batch significantly increases the risk of hyperthermia, seizures, and serotonin syndrome, especially combined with alcohol.\n\nTest your pills before use, redose carefully, and stay hydrated — but not more than 500ml per hour.',
    date: '25.03.2026',
    category: 'Empathogens',
    categoryColor: CATEGORY_COLOR['Empathogens'],
  },
  {
    badge: 'Update',
    badgeColor: '#C9B2FF',
    title: 'Ketamine\nAdulterants',
    summary: 'Ketamine samples in several EU cities found to contain significant amounts of novel dissociatives.',
    body: 'Recent drug checking reports from France and Germany have found ketamine samples adulterated with deschloroketamine and 2-FDCK. These analogues have a longer duration and higher potency than standard ketamine.\n\nUsers may experience unexpectedly intense or prolonged dissociative effects, increasing risk of the "k-hole" at lower doses than usual.\n\nStart with a much smaller amount than usual, especially if the source is new or unknown.',
    date: '18.03.2026',
    category: 'Dissociatives',
    categoryColor: CATEGORY_COLOR['Dissociatives'],
  },
];

const CACHE_KEY = 'ctrl_live_news_v5';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// ─── Fetch logic ──────────────────────────────────────────────────────────────

export async function fetchLiveNews(): Promise<NewsItem[]> {
  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch {}

  let items: NewsItem[];

  if (import.meta.env.DEV) {
    // Dev: generate a single item via Vite proxy, wrap in array
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
    const systemPrompt = `You are a harm reduction news editor for CTRL, a drug safety app used at clubs and parties.
Today's date is ${today}. Generate a realistic and plausible harm reduction drug safety alert dated within the last 4 weeks.

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation:
{
  "badge": "Warning" | "Update" | "Caution",
  "badgeColor": "#FF5545" for Warning | "#FFD400" for Caution | "#C9B2FF" for Update,
  "title": "2-4 word headline (will be displayed uppercase)",
  "summary": "1 sentence plain text teaser",
  "body": "3-5 sentence article body. Use \\n\\n to separate paragraphs.",
  "date": "DD.MM.YYYY within last 4 weeks",
  "category": "Opioids" | "Stimulants" | "Psychedelics" | "Depressants" | "Dissociatives" | "Empathogens" | "NPS" | "General",
  "categoryColor": matching hex color
}
Category colors: Opioids=#FFD0B4, Stimulants=#FFADA5, Psychedelics=#B2FFF1, Depressants=#B3C3D1, Dissociatives=#CCF1FF, Empathogens=#FFBEEA, NPS=#E9FF93, General=#C9B2FF`;

    const response = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Generate a harm reduction drug safety alert.' }],
      }),
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
    if (!textBlock) throw new Error('No text block');
    const single: NewsItem = JSON.parse(textBlock.text.replace(/```json|```/g, '').trim());
    items = [single, ...FALLBACK_NEWS.slice(1)];
  } else {
    // Prod: GET pre-generated cached array from Vercel edge
    const response = await fetch('/api/news-cached');
    if (!response.ok) throw new Error(`API error ${response.status}`);
    const json = await response.json();
    items = json.items ?? json;
  }

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: items }));
  } catch {}

  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LiveNewsBlockProps {
  onReadArticle: () => void;
  onNewsLoaded?: (items: NewsItem[]) => void;
}

export function LiveNewsBlock({ onReadArticle, onNewsLoaded }: LiveNewsBlockProps) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveNews()
      .then((data) => { setItems(data); onNewsLoaded?.(data); })
      .catch((err) => { console.error('[LiveNews] fetch failed:', err); setItems(FALLBACK_NEWS); onNewsLoaded?.(FALLBACK_NEWS); })
      .finally(() => setLoading(false));
  }, []);

  const item = (items ?? FALLBACK_NEWS)[0];
  const titleLines = item.title.split('\n');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#171717',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '16px',
        paddingTop: '100px',
        gap: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Purple radial glow */}
      <div style={{ position: 'absolute', top: '-105px', left: '74px', width: '226px', height: '265px', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          inset: '-40.45% -47.43%',
          background: 'radial-gradient(ellipse at center, rgba(140,92,254,0.55) 0%, rgba(80,40,180,0.25) 45%, transparent 75%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(23,23,23,0.7)', display: 'flex', alignItems: 'flex-end', padding: '16px', paddingBottom: '90px' }}>
          <div style={{ width: '60%', height: '12px', background: 'rgba(241,241,241,0.1)', borderRadius: '6px' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Badge only — date moved to article page */}
        <div style={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: item.badgeColor,
          borderRadius: '44px',
          padding: '4px 12px',
          boxShadow: item.badgeColor === '#FF5545' ? '0px 3px 3px rgba(160,34,34,0.33)' : '0px 3px 3px rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#0D0D0D', letterSpacing: '0.32px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
            {item.badge}
          </span>
        </div>

        {/* Title */}
        <div>
          {titleLines.map((line, i) => (
            <p key={i} style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '28px', color: '#F3EFEF', textTransform: 'uppercase', lineHeight: '30px', margin: 0 }}>
              {line}
            </p>
          ))}
        </div>

        {/* Summary — clamped to 4 lines */}
        <p style={{
          fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F3EFEF',
          letterSpacing: '0.32px', lineHeight: 1.3, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.summary}
        </p>
      </div>

      {/* Read the article button */}
      <button
        onClick={onReadArticle}
        style={{
          position: 'relative', zIndex: 1, width: '100%', height: '50px',
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid #C9B2FF', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}
        aria-label="Read the article"
      >
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#EFE3F6', letterSpacing: '0.36px', lineHeight: 1.5 }}>
          Read the article
        </span>
      </button>
    </div>
  );
}
