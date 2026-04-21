import { useState, useRef } from 'react';
import { LAYOUT } from '../../constants/layout';
import svgPaths from '../../../imports/svg-lomm4xuy7s';
import { BottomNav } from '../ui/BottomNav';
import { MoodEmoji } from '../ui/MoodEmoji';
import type { TripLog } from '../../types/journal';
import type { EmojiProps } from '../ui/MoodEmoji';
import { DRUG_CATEGORY_COLOR } from '../ui/DrugCardArt';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface JournalMainPageProps {
  tripLogs: TripLog[];
  onLogTrip: () => void;
  onTabChange: (tab: NavTab) => void;
  onProfileOpen: () => void;
  onDeleteLog: (id: string) => void;
  onEditLog: (log: TripLog) => void;
}

const SUBSTANCE_COLORS: Record<string, string> = {
  // Empathogens
  MDMA: DRUG_CATEGORY_COLOR.Empathogens,
  Ecstasy: DRUG_CATEGORY_COLOR.Empathogens,
  MDA: DRUG_CATEGORY_COLOR.Empathogens,
  Mephedrone: DRUG_CATEGORY_COLOR.Empathogens,
  '3-MMC': DRUG_CATEGORY_COLOR.Empathogens,
  '4-FA': DRUG_CATEGORY_COLOR.Empathogens,
  // Psychedelics
  LSD: DRUG_CATEGORY_COLOR.Psychedelics,
  Mushrooms: DRUG_CATEGORY_COLOR.Psychedelics,
  DMT: DRUG_CATEGORY_COLOR.Psychedelics,
  Ayahuasca: DRUG_CATEGORY_COLOR.Psychedelics,
  Mescaline: DRUG_CATEGORY_COLOR.Psychedelics,
  '2C-B': DRUG_CATEGORY_COLOR.Psychedelics,
  NBOMe: DRUG_CATEGORY_COLOR.Psychedelics,
  // Stimulants
  Cocaine: DRUG_CATEGORY_COLOR.Stimulants,
  Amphetamines: DRUG_CATEGORY_COLOR.Stimulants,
  Meth: DRUG_CATEGORY_COLOR.Stimulants,
  Speed: DRUG_CATEGORY_COLOR.Stimulants,
  Caffeine: DRUG_CATEGORY_COLOR.Stimulants,
  Ritalin: DRUG_CATEGORY_COLOR.Stimulants,
  Modafinil: DRUG_CATEGORY_COLOR.Stimulants,
  // Depressants
  Alcohol: DRUG_CATEGORY_COLOR.Depressants,
  GHB: DRUG_CATEGORY_COLOR.Depressants,
  'GHB/GBL': DRUG_CATEGORY_COLOR.Depressants,
  Cannabis: DRUG_CATEGORY_COLOR.Depressants,
  Poppers: DRUG_CATEGORY_COLOR.Depressants,
  // Dissociatives
  Ketamine: DRUG_CATEGORY_COLOR.Dissociatives,
  '2-FDCK': DRUG_CATEGORY_COLOR.Dissociatives,
  DXM: DRUG_CATEGORY_COLOR.Dissociatives,
  MXE: DRUG_CATEGORY_COLOR.Dissociatives,
  Nitrous: DRUG_CATEGORY_COLOR.Dissociatives,
  // Opioids
  Heroin: DRUG_CATEGORY_COLOR.Opioids,
  Fentanyl: DRUG_CATEGORY_COLOR.Opioids,
  Oxycodone: DRUG_CATEGORY_COLOR.Opioids,
  Tramadol: DRUG_CATEGORY_COLOR.Opioids,
  Kratom: DRUG_CATEGORY_COLOR.Opioids,
  // NPS
  'MDPV': DRUG_CATEGORY_COLOR.NPS,
};

const REASON_COLOR = '#F1F1F1';
const BODY_COLOR   = '#F1F1F1';

// Mirror the MOODS array from JournalMoodOverlay so LogCard can resolve face → emoji
const MOODS: { face: EmojiProps['face'] }[] = [
  { face: 'Angry' },
  { face: 'Sad' },
  { face: 'Neutral' },
  { face: 'Happy' },
  { face: 'Super' },
];

const ACTION_W = 80;
// ease-out-expo — confident, decisive snap
const SNAP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function SwipeableLogCard({ log, onDelete, onEdit }: { log: TripLog; onDelete: () => void; onEdit: () => void }) {
  const face = MOODS[log.moodIndex ?? 3]?.face ?? 'Happy';
  const reflectionText = log.feltGood || log.challenging || log.learned || '';
  const hasSubstancesOrLocations = log.substances.length > 0 || log.locations.length > 0;
  const hasReasonsOrBody = (log.reasons?.length ?? 0) > 0 || (log.bodyFeelings?.length ?? 0) > 0;

  // 'closed' | 'left' (delete) | 'right' (edit)
  const [swipeState, setSwipeState] = useState<'closed' | 'left' | 'right'>('closed');
  const [translateX, setTranslateX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const dirLocked = useRef<'h' | 'v' | null>(null);
  const lastClientX = useRef(0);
  const velocity = useRef(0);

  const close = () => { setTranslateX(0); setSwipeState('closed'); };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    lastClientX.current = e.touches[0].clientX;
    moved.current = false;
    dirLocked.current = null;
    velocity.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const cx = e.touches[0].clientX;
    const dx = cx - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    velocity.current = cx - lastClientX.current;
    lastClientX.current = cx;

    if (!dirLocked.current) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      dirLocked.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (dirLocked.current === 'v') return;

    e.preventDefault();
    moved.current = true;
    setDragging(true);

    const base = swipeState === 'left' ? -ACTION_W : swipeState === 'right' ? ACTION_W : 0;
    const raw = base + dx;

    // Rubber-band resistance past action width
    let clamped: number;
    if (raw < -ACTION_W) {
      clamped = -ACTION_W - ((-raw - ACTION_W) * 0.22);
    } else if (raw > ACTION_W) {
      clamped = ACTION_W + ((raw - ACTION_W) * 0.22);
    } else {
      clamped = raw;
    }
    setTranslateX(clamped);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (!moved.current) {
      if (swipeState !== 'closed') close();
      return;
    }
    const vel = velocity.current;
    const FLICK = 6;
    if (vel < -FLICK || translateX < -ACTION_W / 2) {
      setTranslateX(-ACTION_W); setSwipeState('left');
    } else if (vel > FLICK || translateX > ACTION_W / 2) {
      setTranslateX(ACTION_W); setSwipeState('right');
    } else {
      close();
    }
  };

  // Icon animation progress (0→1) for each side
  const leftProg  = Math.max(0, Math.min(1, -translateX / ACTION_W));
  const rightProg = Math.max(0, Math.min(1,  translateX / ACTION_W));

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>

      {/* ── Edit action (swipe right) — left side ── */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: ACTION_W,
        background: '#8C5CFE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '16px 0 0 16px',
      }}>
        <button
          onClick={() => { close(); onEdit(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            style={{ transform: `scale(${0.55 + 0.45 * rightProg})`, opacity: Math.min(1, rightProg * 1.4), transition: dragging ? 'none' : `transform 0.35s ${SNAP_EASE}, opacity 0.25s ease` }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#fff', fontWeight: 600,
            opacity: Math.min(1, rightProg * 1.4), transition: dragging ? 'none' : 'opacity 0.25s ease' }}>Edit</span>
        </button>
      </div>

      {/* ── Delete action (swipe left) — right side ── */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: ACTION_W,
        background: '#FF3B30',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0 16px 16px 0',
      }}>
        <button
          onClick={() => { close(); onDelete(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            style={{ transform: `scale(${0.55 + 0.45 * leftProg})`, opacity: Math.min(1, leftProg * 1.4), transition: dragging ? 'none' : `transform 0.35s ${SNAP_EASE}, opacity 0.25s ease` }}>
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#fff', fontWeight: 600,
            opacity: Math.min(1, leftProg * 1.4), transition: dragging ? 'none' : 'opacity 0.25s ease' }}>Delete</span>
        </button>
      </div>

      {/* ── Card ── */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background: '#171717',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          overflow: 'hidden',
          transform: `translateX(${translateX}px)`,
          transition: dragging ? 'none' : `transform 0.38s ${SNAP_EASE}`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'pan-y',
        }}
      >
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
                <span key={s} style={{ border: `1px solid ${SUBSTANCE_COLORS[s] || '#F1F1F1'}`, color: SUBSTANCE_COLORS[s] || '#F1F1F1', borderRadius: '100px', padding: '6px 12px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{s}</span>
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
    </div>
  );
}

const today = new Date();
const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

// Returns the most frequent string in an array, or null if empty
function getMostFrequent(items: string[]): string | null {
  if (items.length === 0) return null;
  const freq: Record<string, number> = {};
  for (const item of items) freq[item] = (freq[item] ?? 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

// Parses log.date string ("April 14") into a Date at midnight local time
// Assumes current year. Returns null if unparseable.
function parseLogDate(dateStr: string): Date | null {
  const d = new Date(`${dateStr} ${new Date().getFullYear()}`);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

// Returns current day streak: consecutive calendar days ending today or
// yesterday that have at least one log
function getDayStreak(logs: TripLog[]): number {
  if (logs.length === 0) return 0;
  const loggedDays = new Set(
    logs
      .map(l => parseLogDate(l.date))
      .filter((d): d is Date => d !== null)
      .map(d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const cursor = new Date(today);
  // if nothing logged today, start checking from yesterday
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  if (!loggedDays.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!loggedDays.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Returns array of 7 Date objects (Mon–Sun) for the week at offset from today
// offset 0 = current week, -1 = last week, etc.
function getWeekDays(offset: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Returns true if two Date objects fall on the same calendar day
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface CalendarPanelProps {
  isOpen: boolean;
  weekOffset: number;
  onWeekChange: (delta: number) => void;
  onClose: () => void;
  tripLogs: TripLog[];
}

function CalendarPanel({ isOpen, weekOffset, onWeekChange, onClose, tripLogs }: CalendarPanelProps) {
  const days = getWeekDays(weekOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Week range label e.g. "APR 6 – APR 12"
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const weekLabel = `${fmt(days[0])} – ${fmt(days[6])}`;

  // Log dates as timestamps for fast lookup
  const logDates = tripLogs
    .map(l => parseLogDate(l.date))
    .filter((d): d is Date => d !== null);

  // Stats
  const sessions = tripLogs.length;
  const dayStreak = getDayStreak(tripLogs);
  const mostUsedSubstance = getMostFrequent(tripLogs.flatMap(l => l.substances));
  const mostCommonMood = getMostFrequent(tripLogs.map(l => l.mood).filter(Boolean));
  const mostCommonReason = getMostFrequent(tripLogs.flatMap(l => l.reasons ?? []));

  const DIVIDER = { borderRight: '1px solid rgba(241,241,241,0.08)' };
  const DIVIDER_TOP = { borderTop: '1px solid rgba(241,241,241,0.08)' };

  const StatCell = ({
    value,
    label,
    borderRight = false,
    borderTop = false,
  }: {
    value: string;
    label: string;
    borderRight?: boolean;
    borderTop?: boolean;
  }) => (
    <div style={{
      flex: 1,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...(borderRight ? DIVIDER : {}),
      ...(borderTop ? DIVIDER_TOP : {}),
    }}>
      <span style={{
        fontFamily: 'Sora, Roboto, sans-serif',
        fontWeight: 700,
        fontSize: '22px',
        color: '#F1F1F1',
        lineHeight: 1.2,
        letterSpacing: '-0.5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '10px',
        letterSpacing: '0.8px',
        color: '#F1F1F1',
        opacity: 0.4,
        textTransform: 'uppercase',
        lineHeight: 1.3,
      }}>
        {label}
      </span>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: '56px',
      left: 0,
      right: 0,
      zIndex: 49,
      background: '#0D0D0D',
      borderBottom: '1px solid rgba(241,241,241,0.08)',
      borderRadius: '0 0 16px 16px',
      transform: isOpen ? 'translateY(0)' : 'translateY(-110%)',
      transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: isOpen ? 'auto' : 'none',
    }}>

      {/* ── WEEK NAVIGATION ── */}
      <div style={{ padding: '16px 16px 0' }}>

        {/* Week range row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            onClick={() => onWeekChange(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#F1F1F1', opacity: 0.6, display: 'flex', alignItems: 'center' }}
            aria-label="Previous week"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7L7 13" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#F1F1F1', letterSpacing: '0.8px' }}>
            {weekLabel}
          </span>
          <button
            onClick={() => onWeekChange(1)}
            disabled={weekOffset >= 0}
            style={{ background: 'none', border: 'none', cursor: weekOffset >= 0 ? 'default' : 'pointer', padding: '4px', color: '#F1F1F1', opacity: weekOffset >= 0 ? 0.15 : 0.6, display: 'flex', alignItems: 'center' }}
            aria-label="Next week"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="#F1F1F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Day columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '16px' }}>
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const hasLog = logDates.some(ld => isSameDay(ld, day));
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                {/* Day letter */}
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', fontWeight: 400, color: '#F1F1F1', opacity: 0.4, letterSpacing: '0.5px' }}>
                  {DAY_LABELS[i]}
                </span>
                {/* Date number */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: isToday ? '1.5px solid rgba(241,241,241,0.6)' : '1.5px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: isToday ? 600 : 400, color: '#F1F1F1', opacity: isToday ? 1 : 0.7 }}>
                    {day.getDate()}
                  </span>
                </div>
                {/* Log dot */}
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: hasLog ? '#8C5CFE' : 'transparent',
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height: '1px', background: 'rgba(241,241,241,0.08)' }} />

      {/* ── STATS GRID ── */}
      <div>
        {/* Row 1 */}
        <div style={{ display: 'flex' }}>
          <StatCell value={String(sessions)} label="Sessions" borderRight />
          <StatCell value={mostUsedSubstance ?? '—'} label="Most Used" />
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', borderTop: '1px solid rgba(241,241,241,0.08)' }}>
          <StatCell value={mostCommonMood ?? '—'} label="Top Mood" borderRight />
          <StatCell value={mostCommonReason ?? '—'} label="Top Reason" />
        </div>
      </div>

      {/* ── COLLAPSE CHEVRON ── */}
      <button
        onClick={onClose}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Close calendar"
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 9L8 2L15 9" stroke="#F1F1F1" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export function JournalMainPage({ tripLogs, onLogTrip, onTabChange, onProfileOpen, onDeleteLog, onEditLog }: JournalMainPageProps) {
  const isEmpty = tripLogs.length === 0;
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);

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
          <button
            onClick={onProfileOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Open profile"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
              <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
            </svg>
          </button>

          {/* Title */}
          <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', margin: 0, lineHeight: 1.5 }}>
            Today - {dateStr}
          </p>

          {/* Calendar icon */}
          <button
            onClick={() => setCalendarOpen(prev => !prev)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Calendar"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M9 20H5V18H9V20Z" fill="#F1F1F1" />
              <path d="M16 20H12V18H16V20Z" fill="#F1F1F1" />
              <path d="M23 20H19V18H23V20Z" fill="#F1F1F1" />
              <path d="M9 15H5V13H9V15Z" fill="#F1F1F1" />
              <path d="M16 15H12V13H16V15Z" fill="#F1F1F1" />
              <path d="M23 15H19V13H23V15Z" fill="#F1F1F1" />
              <path clipRule="evenodd" d={svgPaths.pf205780} fill="#F1F1F1" fillRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {calendarOpen && (
        <div
          onClick={() => setCalendarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 48 }}
        />
      )}
      <CalendarPanel
        isOpen={calendarOpen}
        weekOffset={calendarWeekOffset}
        onWeekChange={(delta) => setCalendarWeekOffset(prev => {
          const next = prev + delta;
          return next > 0 ? 0 : next;
        })}
        onClose={() => setCalendarOpen(false)}
        tripLogs={tripLogs}
      />

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
              left: '24px',
              right: '24px',
              width: 'auto',
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
            <div style={{ padding: '70px 8px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tripLogs.map(log => (
                <SwipeableLogCard
                  key={log.id}
                  log={log}
                  onDelete={() => onDeleteLog(log.id)}
                  onEdit={() => onEditLog(log)}
                />
              ))}
            </div>
          </div>

          {/* Floating + button */}
          <button
            onClick={onLogTrip}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '24px',
              zIndex: 60,
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#8C5CFE',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 20px 0px rgba(140, 92, 254, 0.4)',
              marginBottom: '60px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20M4 12H20" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Journal" onTabChange={onTabChange} />
    </div>
  );
}