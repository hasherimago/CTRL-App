import { LAYOUT } from '../../constants/layout';
import svgPaths from '../../../imports/svg-lomm4xuy7s';
import { BottomNav } from '../ui/BottomNav';
import { MoodEmoji } from '../ui/MoodEmoji';
import type { TripLog } from '../../types/journal';
import type { EmojiProps } from '../ui/MoodEmoji';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface JournalMainPageProps {
  tripLogs: TripLog[];
  onLogTrip: () => void;
  onTabChange: (tab: NavTab) => void;
  onProfileOpen: () => void;
}

const SUBSTANCE_COLORS: Record<string, string> = {
  MDMA: '#FFBEEA',
  GHB: '#A8E6CF',
  Ecstasy: '#FF9BE0',
  Cocaine: '#F1F1F1',
  '2C-B': '#FFB6A3',
  DMT: '#C3B1E1',
  Ketamine: '#CCF1FF',
  Caffeine: '#F5D163',
  LSD: '#B5EAD7',
};

const REASON_COLOR = '#B8A0FF';   // soft purple
const BODY_COLOR   = '#FFADA5';   // warm salmon

// Mirror the MOODS array from JournalMoodOverlay so LogCard can resolve face → emoji
const MOODS: { face: EmojiProps['face'] }[] = [
  { face: 'Angry' },
  { face: 'Sad' },
  { face: 'Neutral' },
  { face: 'Happy' },
  { face: 'Super' },
];

function LogCard({ log }: { log: TripLog }) {
  const face = MOODS[log.moodIndex ?? 3]?.face ?? 'Happy';
  const reflectionText = log.feltGood || log.challenging || log.learned || '';

  const hasSubstancesOrLocations = log.substances.length > 0 || log.locations.length > 0;
  const hasReasonsOrBody = (log.reasons?.length ?? 0) > 0 || (log.bodyFeelings?.length ?? 0) > 0;

  return (
    <div style={{ background: '#171717', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
      {/* Row 1: emoji + mood + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MoodEmoji face={face} selected={true} size={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', lineHeight: 1.5 }}>{log.mood}</span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: 'rgba(241,241,241,0.6)', letterSpacing: '0.28px', lineHeight: 1.3 }}>{log.moodSub}</span>
          </div>
        </div>
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgba(241,241,241,0.6)', letterSpacing: '0.32px', lineHeight: 1.3, flexShrink: 0 }}>{log.date}</span>
      </div>

      {/* Row 2: reflection text */}
      {reflectionText ? (
        <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3, margin: 0 }}>{reflectionText}</p>
      ) : null}

      {/* Tags — all inline */}
      {(hasSubstancesOrLocations || hasReasonsOrBody) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {log.substances.map(s => (
            <span key={s} style={{ border: `1px solid ${SUBSTANCE_COLORS[s] || '#CCF1FF'}`, color: SUBSTANCE_COLORS[s] || '#CCF1FF', borderRadius: '100px', padding: '6px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{s}</span>
          ))}
          {log.locations.map(l => (
            <span key={l} style={{ border: '1px solid #F1F1F1', color: '#F1F1F1', borderRadius: '100px', padding: '6px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{l}</span>
          ))}
          {(log.reasons ?? []).map(r => (
            <span key={r} style={{ border: `1px solid ${REASON_COLOR}`, color: REASON_COLOR, borderRadius: '100px', padding: '6px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{r}</span>
          ))}
          {(log.bodyFeelings ?? []).map(b => (
            <span key={b} style={{ border: `1px solid ${BODY_COLOR}`, color: BODY_COLOR, borderRadius: '100px', padding: '6px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{b}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const today = new Date();
const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

export function JournalMainPage({ tripLogs, onLogTrip, onTabChange, onProfileOpen }: JournalMainPageProps) {
  const isEmpty = tripLogs.length === 0;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0D0D0D', overflow: 'hidden' }}>

      {/* ── HEADER ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 50 }}>
        {/* blur layer */}
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }} />
        {/* gradient layer */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)', pointerEvents: 'none' }} />
        {/* content */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
          {/* Profile icon */}
          <button onClick={onProfileOpen} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', left: '2px', top: '2px', width: '28px', height: '28px' }}>
              <svg style={{ position: 'absolute', width: '100%', height: '100%' }} fill="none" viewBox="0 0 28 28">
                <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
                <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Title */}
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', lineHeight: 1.5 }}>Today - {dateStr}</span>

          {/* Calendar icon */}
          <button style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', left: '2px', top: '2px', width: '28px', height: '25px' }}>
              <svg style={{ position: 'absolute', width: '100%', height: '100%' }} fill="none" viewBox="0 0 28 25">
                <path d="M9 20H5V18H9V20Z" fill="#F1F1F1" />
                <path d="M16 20H12V18H16V20Z" fill="#F1F1F1" />
                <path d="M23 20H19V18H23V20Z" fill="#F1F1F1" />
                <path d="M9 15H5V13H9V15Z" fill="#F1F1F1" />
                <path d="M16 15H12V13H16V15Z" fill="#F1F1F1" />
                <path d="M23 15H19V13H23V15Z" fill="#F1F1F1" />
                <path clipRule="evenodd" d={svgPaths.pf205780} fill="#F1F1F1" fillRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {isEmpty ? (
        <>
          {/* Empty state — vertically centred between header and nav */}
          <div style={{
            position: 'absolute',
            top: '56px',
            bottom: `${LAYOUT.NAV_HEIGHT}px`,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            gap: '20px',
          }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', opacity: 0.7, letterSpacing: '0.36px', lineHeight: 1.5, textAlign: 'center', margin: 0 }}>
              Nothing here yet
            </p>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', opacity: 0.7, letterSpacing: '0.32px', lineHeight: 1.3, textAlign: 'center', margin: 0, maxWidth: '354px' }}>
              Start your first Trip Log to reflect on how you felt, what you took, and what you learned. It's private, optional — and just for you.
            </p>
          </div>

          {/* "Log my trip" CTA */}
          <button
            onClick={onLogTrip}
            style={{
              position: 'absolute',
              bottom: '156px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '244px',
              height: '60px',
              background: '#F1F1F1',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0px 1px 2px 0px rgba(5,32,81,0.05)',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0D0D0D', letterSpacing: '0.36px', lineHeight: 1.5 }}>Log my trip</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H7M7 7H13M7 7V13M7 7V1" stroke="#0D0D0D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </>
      ) : (
        <>
          {/* Scrollable log list */}
          <div style={{ position: 'absolute', top: 0, bottom: `${LAYOUT.NAV_HEIGHT}px`, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            <div style={{ padding: '70px 8px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tripLogs.map(log => <LogCard key={log.id} log={log} />)}
            </div>
          </div>

          {/* Floating + button */}
          <button
            onClick={onLogTrip}
            style={{
              position: 'absolute',
              right: '16px',
              bottom: '116px',
              width: '59px',
              height: '59px',
              background: '#8C5CFE',
              borderRadius: '122px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              zIndex: 10,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M3 17H17M17 17H31M17 17V31M17 17V3" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.83333" />
            </svg>
          </button>
        </>
      )}

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Journal" onTabChange={onTabChange} />
    </div>
  );
}