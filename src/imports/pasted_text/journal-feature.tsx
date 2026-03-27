Build the complete Journal feature. This covers 5 screens and all wiring in App.tsx.

State in App.tsx
tsxinterface TripLog {
  id: number;
  date: string;
  mood: string;
  moodSub: string;
  moodIndex: number;
  substances: string[];
  locations: string[];
  reasons: string[];
  bodyFeelings: string[];
  feltGood: string;
  challenging: string;
  learned: string;
  different: string;
}

const [tripLogs, setTripLogs] = useState<TripLog[]>([]);
const [journalStep, setJournalStep] = useState<'main' | 'context' | 'mood' | 'reflection' | 'done'>('main');
const [draftLog, setDraftLog] = useState<Partial<TripLog>>({});
Two entry points into the journal flow:

Bottom nav "Journal" tab → setCurrentPage('journal'), setJournalStep('main')
+ icon in the Journal card on the Home Page → same


Overlay architecture — critical
JournalMainPage always stays rendered. The three logging screens (Context, Mood, Reflection) are overlays that slide up from the bottom, stacked on top of the main page. They are never page replacements.
tsx{currentPage === 'journal' && (
  <>
    <JournalMainPage
      tripLogs={tripLogs}
      onLogTrip={() => { setDraftLog({}); setJournalStep('context'); }}
      onTabChange={handleTabChange}
      onProfileOpen={() => setProfileOpen(true)}
      journalStep={journalStep}
    />
    <JournalContextOverlay
      isOpen={journalStep === 'context' || journalStep === 'mood' || journalStep === 'reflection'}
      onNext={(data) => { setDraftLog(prev => ({...prev, ...data})); setJournalStep('mood'); }}
      onBack={() => setJournalStep('main')}
      onClose={() => setJournalStep('main')}
    />
    <JournalMoodOverlay
      isOpen={journalStep === 'mood' || journalStep === 'reflection'}
      onNext={(data) => { setDraftLog(prev => ({...prev, ...data})); setJournalStep('reflection'); }}
      onBack={() => setJournalStep('context')}
      onClose={() => setJournalStep('main')}
    />
    <JournalReflectionOverlay
      isOpen={journalStep === 'reflection'}
      draftLog={draftLog}
      onDone={(log) => { setTripLogs(prev => [log, ...prev]); setDraftLog({}); setJournalStep('done'); }}
      onBack={() => setJournalStep('mood')}
      onClose={() => setJournalStep('main')}
    />
    {journalStep === 'done' && (
      <SuccessScreen
        isFirst={tripLogs.length === 1}
        onComplete={() => setJournalStep('main')}
      />
    )}
  </>
)}
Slide-up animation for all three overlays:
css/* Closed */
transform: translateY(100%);
/* Open */
transform: translateY(0);
transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
Each overlay: position: fixed, inset: 0, background: #0D0D0D, always in DOM, visibility via transform only.
Stacking z-index:

JournalContextOverlay: z-index: 80
JournalMoodOverlay: z-index: 81
JournalReflectionOverlay: z-index: 82
SuccessScreen: z-index: 83

Each overlay's isOpen prop includes all later steps too — so when Reflection is open, Context and Mood stay visible underneath it. Tapping back on Mood slides it down — Context is immediately visible. Tapping × closes everything back to main.

Screen 1 — JournalMainPage.tsx
Header — same working blur pattern as App.tsx:

Left: profile icon → onProfileOpen()
Center: "Today - June 16" Roboto Bold 18px #F1F1F1
Right: calendar icon 32×32 (placeholder)

Empty state (when tripLogs.length === 0), vertically centered:

"Nothing here yet" — Roboto Bold 18px #F1F1F1, 70% opacity
"Start your first Trip Log to reflect on how you felt, what you took, and what you learned. It's private, optional — and just for you." — Roboto Regular 16px, centered, 70% opacity
"Log my trip +" button — centered, width: 244px, height: 60px, background: #8C5CFE, border-radius: 8px, Roboto Bold 18px #F1F1F1 + + icon, box-shadow: 0px 1px 2px rgba(5,32,81,0.05), calls onLogTrip()

Logs state (when tripLogs.length > 0):

Scrollable list of log cards, top: 110px, bottom: 100px, padding: 0 8px 24px, gap: 16px
Floating + button: position: absolute, right: 16px, bottom: 116px, width: 59px, height: 59px, background: #8C5CFE, border-radius: 122px, backdrop-filter: blur(5px), white + icon 34×34 — calls onLogTrip()

Log card: background: #171717, border-radius: 16px, padding: 16px, gap: 28px

Row 1: emoji (40×40) + mood name Roboto Bold 18px white + mood subtitle Roboto Regular 14px white 60% | date Roboto Regular 16px white 60% (right)
Row 2: reflection text ("What felt good?" answer) — Roboto Regular 16px #F1F1F1, line-height: 1.3
Row 3: substance + location tag pills, Roboto Regular 14px, border-radius: 18px, padding: 12px, substance tags use their drug color (#CCF1FF for Ketamine etc.), location tags use border: 1px solid #F1F1F1, color: #F1F1F1

Bottom nav: Journal tab active (<BottomNav activeTab="Journal" onTabChange={onTabChange} />)

Overlay 1 — JournalContextOverlay.tsx (Substance & Context)
Flat header, no blur:

Left: ← back → onBack()
Center: "Substance & Context" Roboto Bold 18px white
Right: × close → onClose()
Height: 83px, icons at top: 35px

Scrollable content from top: 124px, padding: 0 16px 120px, gap: 60px between sections:
Section 1 — "What substance(s) did you use?"
Multi-select tags: MDMA, GHB, Ecstasy, Cocaine, 2C-B, DMT, Ketamine, Caffeine, +
Section 2 — "Where were you?"
Multi-select tags: Club, Home, Nature, Solo, Date, Sex, Festival, Office, +
Section 3 — "Why did you decide to take it?"
Multi-select tags: Curiosity, Fun, Connection, Healing, Escape, Creativity, Self-reflection, +
Tag shared style:

Default: border: 1px solid #F1F1F1, color: #F1F1F1, border-radius: 18px, padding: 12px, Roboto Regular 16px
Selected: background: #8C5CFE, border-color: #8C5CFE, color: #F1F1F1
Each section has its own useState<string[]>([])
+ button: border: 1px solid #F1F1F1, border-radius: 30px, width: 35px, height: 35px

"Next ›" button — position: fixed, bottom: 60px, centered, width: 244px, height: 60px, background: #8C5CFE:

Saves { substances, locations, reasons } to draft via onNext()

Home indicator bar at bottom, no bottom nav

Overlay 2 — JournalMoodOverlay.tsx (Mood & Body)
Same flat header: "Mood & Body" | back → onBack() | × → onClose()
Section 1 — "How did you feel during the experience?"
5 emoji faces in a row, centered, gap: 19px, each 58×58px. Use useState<number>(3) (default: Happy).
Emoji definitions (index: label, face color, expression):

0: Angry — grey face, furrowed brows, frown
1: Sad — grey face, downturned mouth
2: Neutral — grey face, flat line mouth
3: Happy — warm yellow/orange face, blush cheeks (blushed emoji from Figma)
4: Euphoric — grey face, big open smile

Render emojis using emoji Unicode characters in large styled <span> elements as a simpler alternative to the Figma layered assets:
tsxconst EMOJIS = ['😠', '😕', '😐', '😊', '😄'];
const MOOD_LABELS = ['Angry', 'Sad', 'Neutral', 'Happy', 'Euphoric'];
const MOOD_SUBS = ['Frustrated', 'Low', 'Mellow', 'Euforic', 'Transcendent'];
Selected emoji: font-size: 58px, transform: scale(1.2), full opacity. Unselected: font-size: 50px, opacity: 0.4. On tap — bounce animation:
css@keyframes emoji-bounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.4); }
  100% { transform: scale(1.2); }
}
Section 2 — "What did your body feel like?"
Subtitle: "Any physical sensations or discomfort?" — Inter Regular 14px white 60%
Multi-select tags: Energetic, Tension, Nausea, Clenching, Sensual, Numbness, +
"Next ›" button — same style, saves { moodIndex, mood, moodSub, bodyFeelings } via onNext()

Overlay 3 — JournalReflectionOverlay.tsx (Reflection)
Same flat header: "Reflection" | back → onBack() | × → onClose()
4 textarea sections, gap: 30px, from top: 124px, padding: 0 16px 120px:
Each section: label (Roboto Bold 18px white) + <textarea> (height: 77px, border: 1px solid rgba(187,187,187,0.8), border-radius: 10px, background: transparent, color: #F1F1F1, font-size: 14px, padding: 8px 11px, resize: none, placeholder "Share your thoughts here..." at 40% opacity)
Questions: "What felt good?" | "What was challenging?" | "What did you learn or take away?" | "Would you do anything differently?"
"Done" button — same purple style, no icon. On tap:
tsxconst newLog: TripLog = {
  id: Date.now(),
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
  mood: MOOD_LABELS[draftLog.moodIndex ?? 3],
  moodSub: MOOD_SUBS[draftLog.moodIndex ?? 3],
  moodIndex: draftLog.moodIndex ?? 3,
  substances: draftLog.substances ?? [],
  locations: draftLog.locations ?? [],
  reasons: draftLog.reasons ?? [],
  bodyFeelings: draftLog.bodyFeelings ?? [],
  feltGood, challenging, learned, different,
};
onDone(newLog);

Success screen — SuccessScreen.tsx
position: fixed, inset: 0, z-index: 83, background: #0D0D0D, centered content:

Large emoji: 🎉 at 64px
"First trip logged!" (if isFirst) or "Trip logged!" — Roboto Bold 24px #F1F1F1
"Your reflection has been saved." — Roboto Regular 16px #F1F1F1 70%

Auto-dismisses after 1.5s via useEffect:
tsxuseEffect(() => {
  const t = setTimeout(onComplete, 1500);
  return () => clearTimeout(t);
}, []);

Files to create:

src/app/components/figma/JournalMainPage.tsx
src/app/components/figma/JournalContextOverlay.tsx
src/app/components/figma/JournalMoodOverlay.tsx
src/app/components/figma/JournalReflectionOverlay.tsx
src/app/components/figma/SuccessScreen.tsx

Apply LAYOUT constants from src/app/constants/layout.ts for all scroll containers. Use the same header blur pattern from App.tsx on JournalMainPage only. The three overlays use flat dark headers with no blur.
