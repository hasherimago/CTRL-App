import type { VercelRequest, VercelResponse } from '@vercel/node';

// Module-level cache — survives across warm invocations on the same instance
let cachedNews: object | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

function buildPrompt(today: string) {
  return `You are a harm reduction news editor for CTRL, a drug safety app used at clubs and parties.
Today's date is ${today}.

Generate exactly 3 distinct harm reduction drug safety alerts as a JSON array.
- Item 0: most recent alert, dated within the last 7 days
- Item 1: older alert, dated 8–15 days ago
- Item 2: oldest alert, dated 16–28 days ago
Each alert should be about a DIFFERENT drug category.

Respond ONLY with a valid JSON array of 3 objects — no markdown, no backticks, no explanation:
[
  {
    "badge": "Warning" | "Update" | "Caution",
    "badgeColor": "#FF5545" for Warning | "#FFD400" for Caution | "#C9B2FF" for Update,
    "title": "2-4 word headline (will be displayed uppercase)",
    "summary": "1 sentence plain text teaser shown on the home card",
    "body": "3-5 sentence plain text article body with full harm reduction advice. Use \\n\\n to separate paragraphs.",
    "date": "date in DD.MM.YYYY format within the range described above (today is ${today})",
    "category": one of: "Opioids" | "Stimulants" | "Psychedelics" | "Depressants" | "Dissociatives" | "Empathogens" | "NPS" | "General",
    "categoryColor": the matching hex color for that category
  },
  ...
]

Category colors:
Opioids=#FFD0B4, Stimulants=#FFADA5, Psychedelics=#B2FFF1, Depressants=#B3C3D1,
Dissociatives=#CCF1FF, Empathogens=#FFBEEA, NPS=#E9FF93, General=#C9B2FF`;
}

async function generateNews(): Promise<object> {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).replace(/\//g, '.');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: buildPrompt(today),
      messages: [{ role: 'user', content: 'Generate the 3 harm reduction drug safety alerts.' }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic error ${response.status}`);

  const data = await response.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  if (!textBlock) throw new Error('No text block in response');

  const clean = textBlock.text.replace(/```json|```/g, '').trim();
  const items = JSON.parse(clean);
  return { items };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const now = Date.now();
  if (!cachedNews || now - cacheTime > CACHE_TTL) {
    cachedNews = await generateNews();
    cacheTime = now;
  }

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');
  res.status(200).json(cachedNews);
}
