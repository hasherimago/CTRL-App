import svgPaths from '../../../imports/svg-hke02eu6ox';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';
import type { NewsItem } from './LiveNewsBlock';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface ArticlePageProps {
  news: NewsItem[];
  onBack: () => void;
  onSearchOpen: () => void;
  onTabChange: (tab: NavTab) => void;
}

// ─── Share icon ───────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute left-[2px] size-[20px] top-[2px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19.9998">
          <path d={svgPaths.p1fbe6e80} fill="#F1F1F1" />
          <path d={svgPaths.p378ae500} fill="#F1F1F1" />
        </svg>
      </div>
    </div>
  );
}

// ─── Article card — matches Figma design ────────────────────────────────────

function ArticleCard({ item }: { item: NewsItem }) {
  const bodyParagraphs = (item.body ?? item.summary ?? '').split('\n\n').filter(Boolean);

  return (
    <div className="bg-[#171717] flex flex-col gap-[30px] items-start px-4 py-[26px] rounded-[20px] w-full">

      {/* Date + Title */}
      <div className="flex flex-col gap-3 w-full">
        <p style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '16px',
          color: '#F1F1F1',
          opacity: 0.4,
          letterSpacing: '0.32px',
          lineHeight: 1.3,
          margin: 0,
        }}>
          {item.date}
        </p>
        <div className="flex items-start justify-between w-full gap-4">
          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: '29px',
            lineHeight: '30px',
            letterSpacing: '0.58px',
            color: '#F3EFEF',
            textTransform: 'uppercase',
            margin: 0,
            flex: 1,
          }}>
            {item.title.replace('\n', ' ')}
          </p>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: '2px' }} aria-label="Share">
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* Category tag */}
      <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${item.categoryColor}`, borderRadius: '18px', padding: '8px 12px' }}>
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: item.categoryColor, letterSpacing: '0.32px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3, width: '100%' }}>
        {bodyParagraphs.map((para, i) => (
          <p key={i} style={{ margin: 0, marginTop: i > 0 ? '1em' : 0 }}>{para}</p>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ArticlePage({ news, onBack, onSearchOpen, onTabChange }: ArticlePageProps) {
  return (
    <div className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">

      {/* ── FIXED HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '56px' }}>
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
              <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
            </svg>
          </button>
          <button onClick={onSearchOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Open search">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
              <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ position: 'absolute', top: 0, bottom: `${LAYOUT.NAV_HEIGHT}px`, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="px-2 flex flex-col gap-4" style={{ paddingTop: '70px', paddingBottom: `${LAYOUT.CONTENT_BOTTOM_PADDING}px` }}>
          {news.map((item, i) => (
            <ArticleCard key={i} item={item} />
          ))}
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Home" onTabChange={onTabChange} />
    </div>
  );
}
