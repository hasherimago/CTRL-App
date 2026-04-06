import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  badge: string;       // e.g. "Warning", "Alert", "Update"
  badgeColor: string;  // hex — red for danger, yellow for caution, purple for info
  title: string;       // 2–4 words, uppercase in render
  summary: string;     // 1–2 sentences shown on card
  body: string;        // 3–5 sentences shown on article page
  category: string;    // e.g. "Opioids", "Stimulants", "Psychedelics"
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

// Static fallback — the original Figma story
export const FALLBACK_NEWS: NewsItem = {
  badge: 'Warning',
  badgeColor: '#FF5545',
  title: 'Fake batch\nof Oxycodone',
  summary: 'Fentanyl was found in a batch of oxycodone in Berlin on 12.05.2025',
  body: 'A counterfeit batch of oxycodone containing fentanyl was detected in Berlin on 12.05.2025. Fentanyl is an extremely potent opioid linked to fatal overdoses, especially when taken unknowingly.\n\nIf you or someone you know has sourced oxycodone recently, do not use it without testing. Start with a very small dose, never use alone, and keep naloxone nearby if possible.\n\nStay safe — share this with your community.',
  category: 'Opioids',
  categoryColor: CATEGORY_COLOR['Opioids'],
};

const CACHE_KEY = 'ctrl_live_news_v1';
const CACHE_TTL = 1000 * 60 * 60 * 3; // 3 hours

// ─── Fetch logic ──────────────────────────────────────────────────────────────

export async function fetchLiveNews(): Promise<NewsItem> {
  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch {}

  const systemPrompt = `You are a harm reduction news editor for CTRL, a drug safety app used at clubs and parties.
Generate a realistic and plausible harm reduction drug safety alert based on known drug safety trends in Europe.
Focus on: adulterated drugs, dangerous batches, fentanyl contamination, overdose warnings, new psychoactive substances.
Base it on patterns from DanceSafe, The Loop, EMCDDA, or drug checking services.

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation:
{
  "badge": "Warning" | "Alert" | "Update" | "Caution",
  "badgeColor": "#FF5545" for danger | "#FFD400" for caution | "#C9B2FF" for info,
  "title": "2-4 word headline (will be displayed uppercase)",
  "summary": "1 sentence plain text teaser shown on the home card",
  "body": "3-5 sentence plain text article body with full harm reduction advice. Use \\n\\n to separate paragraphs.",
  "category": one of: "Opioids" | "Stimulants" | "Psychedelics" | "Depressants" | "Dissociatives" | "Empathogens" | "NPS" | "General",
  "categoryColor": the matching hex color for that category
}

Category colors:
Opioids=#FFD0B4, Stimulants=#FFADA5, Psychedelics=#B2FFF1, Depressants=#B3C3D1,
Dissociatives=#CCF1FF, Empathogens=#FFBEEA, NPS=#E9FF93, General=#C9B2FF`;

  const url = import.meta.env.DEV
    ? '/api/anthropic/v1/messages'
    : '/api/news';

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (import.meta.env.DEV) {
    headers['x-api-key'] = import.meta.env.VITE_ANTHROPIC_API_KEY;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Generate a realistic harm reduction drug safety alert or warning.' }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.error('[LiveNews] API error', response.status, errText);
    throw new Error(`API error ${response.status}`);
  }

  const data = await response.json();

  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  if (!textBlock) {
    console.error('[LiveNews] no text block, content types:', data.content?.map((b: { type: string }) => b.type));
    throw new Error('No text in response');
  }

  const clean = textBlock.text.replace(/```json|```/g, '').trim();
  const parsed: NewsItem = JSON.parse(clean);

  // Cache it
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: parsed }));
  } catch {}

  return parsed;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LiveNewsBlockProps {
  onReadArticle: () => void;
  onNewsLoaded?: (news: NewsItem) => void;
}

export function LiveNewsBlock({ onReadArticle, onNewsLoaded }: LiveNewsBlockProps) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveNews()
      .then((item) => { setNews(item); onNewsLoaded?.(item); })
      .catch((err) => { console.error('[LiveNews] fetch failed:', err); setNews(FALLBACK_NEWS); onNewsLoaded?.(FALLBACK_NEWS); })
      .finally(() => setLoading(false));
  }, []);

  const item = news ?? FALLBACK_NEWS;

  // Split title on newline for two-line display
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
      {/* Purple radial glow — matches Figma ellipse */}
      <div
        style={{
          position: 'absolute',
          top: '-105px',
          left: '74px',
          width: '226px',
          height: '265px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-40.45% -47.43%',
            background: 'radial-gradient(ellipse at center, rgba(140,92,254,0.55) 0%, rgba(80,40,180,0.25) 45%, transparent 75%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Loading shimmer overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: 'rgba(23,23,23,0.7)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '16px',
            paddingBottom: '90px',
          }}
        >
          <div style={{ width: '60%', height: '12px', background: 'rgba(241,241,241,0.1)', borderRadius: '6px' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Badge */}
        <div
          style={{
            alignSelf: 'flex-start',
            background: item.badgeColor,
            borderRadius: '18px',
            padding: '8px 12px',
            boxShadow: item.badgeColor === '#FF5545'
              ? '0px 3px 3px rgba(160,34,34,0.33)'
              : '0px 3px 3px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            color: '#0D0D0D',
            letterSpacing: '0.32px',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
          }}>
            {item.badge}
          </span>
        </div>

        {/* Title block */}
        <div>
          {titleLines.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'TT Travels Next Trial Variable', sans-serif",
                fontWeight: 800,
                fontSize: '24px',
                color: '#F3EFEF',
                letterSpacing: '0.48px',
                textTransform: 'uppercase',
                lineHeight: '26px',
                margin: 0,
                fontStyle: 'normal',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Summary — clamped to 4 lines */}
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: '#F3EFEF',
          letterSpacing: '0.32px',
          lineHeight: 1.3,
          margin: 0,
          maxWidth: '284px',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.summary}
        </p>
      </div>

      {/* Read the article button */}
      <button
        onClick={onReadArticle}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '50px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid #C9B2FF',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        aria-label="Read the article"
      >
        <span style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          color: '#EFE3F6',
          letterSpacing: '0.36px',
          lineHeight: 1.5,
        }}>
          Read the article
        </span>
      </button>
    </div>
  );
}
