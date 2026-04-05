import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsItem {
  badge: string;       // e.g. "Warning", "Alert", "Update"
  badgeColor: string;  // hex — red for danger, yellow for caution, purple for info
  title: string;       // 2–4 words, uppercase in render
  summary: string;     // 1–2 sentences
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
const FALLBACK: NewsItem = {
  badge: 'Warning',
  badgeColor: '#FF5545',
  title: 'Fake batch\nof Oxycodone',
  summary: 'Fentanyl was found in a batch of oxycodone in Berlin on 12.05.2025',
  category: 'Opioids',
  categoryColor: CATEGORY_COLOR['Opioids'],
};

const CACHE_KEY = 'ctrl_live_news_v1';
const CACHE_TTL = 1000 * 60 * 60 * 3; // 3 hours

// ─── Fetch logic ──────────────────────────────────────────────────────────────

async function fetchLiveNews(): Promise<NewsItem> {
  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch {}

  const systemPrompt = `You are a harm reduction news editor for CTRL, a drug safety app used at clubs and parties.
Search the web for the single most recent and important harm reduction or drug safety alert from the last 6 months.
Focus on: adulterated drugs, dangerous batches, fentanyl contamination, overdose warnings, new psychoactive substances.
Prefer European sources (DanceSafe, The Loop, EMCDDA, drug checking services, health authorities).

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation:
{
  "badge": "Warning" | "Alert" | "Update" | "Caution",
  "badgeColor": "#FF5545" for danger | "#FFD400" for caution | "#C9B2FF" for info,
  "title": "2-4 word headline (will be displayed uppercase)",
  "summary": "1-2 sentence plain text summary of the key safety information",
  "category": one of: "Opioids" | "Stimulants" | "Psychedelics" | "Depressants" | "Dissociatives" | "Empathogens" | "NPS" | "General",
  "categoryColor": the matching hex color for that category
}

Category colors:
Opioids=#FFD0B4, Stimulants=#FFADA5, Psychedelics=#B2FFF1, Depressants=#B3C3D1,
Dissociatives=#CCF1FF, Empathogens=#FFBEEA, NPS=#E9FF93, General=#C9B2FF`;

const url = import.meta.env.DEV
? '/api/anthropic/v1/messages'
: 'https://api.anthropic.com/v1/messages';
const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: 'Find the most recent harm reduction drug safety alert or warning.' }],
    }),
  });

  if (!response.ok) throw new Error('API error');

  const data = await response.json();

  // Extract text blocks from response (may include tool_use and tool_result blocks)
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  if (!textBlock) throw new Error('No text in response');

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
}

export function LiveNewsBlock({ onReadArticle }: LiveNewsBlockProps) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveNews()
      .then(setNews)
      .catch(() => setNews(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const item = news ?? FALLBACK;

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

        {/* Summary */}
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          color: '#F3EFEF',
          letterSpacing: '0.32px',
          lineHeight: 1.3,
          margin: 0,
          maxWidth: '284px',
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
