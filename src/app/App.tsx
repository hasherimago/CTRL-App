import { useState, useRef, useMemo } from 'react';
import svgPaths from '../imports/svg-srcobnd1q5';
import ArrowUpIcon from '../imports/24x24_arrow_up.svg';
import img1BoxKit2 from 'figma:asset/21513547f5bac8311041c05250d422150f954ce0.png';
import imgBoxKit22 from 'figma:asset/427be1764d9d405c7a5e965a565203239a7abd9b.png';
import imgBoxKit32 from 'figma:asset/fe666c239a772ba091da12ba0d15214623bc20e0.png';
import imgTestingKit1 from 'figma:asset/3540376fb624c022b5c0acc0baca73f0f03c7230.png';
import shopImage from 'figma:asset/158d2cf416b73440500600afc54970028192895b.png';
import MainNewsBlock from '../imports/MainNewsBlock';
import { ShopPage } from './components/figma/ShopPage';
import { LibraryPage, adaptDrugs } from './components/figma/LibraryPage';
import type { TripSitDrug } from './components/figma/LibraryPage';
import { DrugDetailPage } from './components/figma/DrugDetailPage';
import { ArticlePage } from './components/figma/ArticlePage';
import { ProfilePage } from './components/figma/ProfilePage';
import { JournalMainPage } from './components/figma/JournalMainPage';
import { JournalContextOverlay } from './components/figma/JournalContextOverlay';
import { JournalMoodOverlay } from './components/figma/JournalMoodOverlay';
import { JournalReflectionOverlay } from './components/figma/JournalReflectionOverlay';
import { SuccessScreen } from './components/figma/SuccessScreen';
import { BottomNav } from './components/ui/BottomNav';
import { SearchOverlay } from './components/ui/SearchOverlay';
import { CheckerPage } from './components/figma/CheckerPage';
import type { TripLog, JournalStep } from './types/journal';
import drugsRaw from './components/figma/data/drugs.json';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

// ── Adapt TripSit data once at module level (not inside component) ──
const DRUGS: TripSitDrug[] = adaptDrugs(drugsRaw as Record<string, unknown>);

export default function App() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: false, 1: false, 2: false, 3: false,
  });

  const [activeTab, setActiveTab] = useState<NavTab>('Home');
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'library' | 'article' | 'fentanyl' | 'journal' | 'checker'>('home');
  const [selectedDrug, setSelectedDrug] = useState<TripSitDrug | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Journal state
  const [tripLogs, setTripLogs] = useState<TripLog[]>([]);
  const [journalStep, setJournalStep] = useState<JournalStep>('main');
  const [draftLog, setDraftLog] = useState<Partial<TripLog>>({});
  const [sessionKey, setSessionKey] = useState(0);

  const previousPageRef = useRef<'home' | 'shop' | 'library' | 'article' | 'fentanyl' | 'journal' | 'checker'>('home');
  const skipTransitionRef = useRef(false);

  const openSearch = () => {
    previousPageRef.current = currentPage;
    setSearchOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
      });
    });
  };

  const toggleCheckbox = (index: number) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const checklistItems = [
    'I have enough water nearby',
    'I packed snacks',
    'I went to the bathroom',
    'I packed gum / sniffer / tissues',
  ];

  const sessionDays = [
    false, false, false, false, true, false, false, false, false, false, false,
    false, true, false, false, false, false, false, false, false, true, false,
  ];

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedDrug(null);
    if (tab === 'Library') setCurrentPage('library');
    else if (tab === 'Home') setCurrentPage('home');
    else if (tab === 'Checker') setCurrentPage('checker');
    else if (tab === 'Journal') { setCurrentPage('journal'); setJournalStep('main'); }
    else setCurrentPage('home');
  };

  const handleDrugClick = (drugKey: string) => {
    const drug = DRUGS.find(d => d.key === drugKey) ?? null;
    setSelectedDrug(drug);
  };

  const handleDrugBack = () => setSelectedDrug(null);

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── BASE PAGE LAYER ── */}
      {currentPage === 'shop' ? (
        <ShopPage onBack={() => { setCurrentPage('home'); setActiveTab('Home'); }} onSearchOpen={openSearch} />
      ) : currentPage === 'checker' ? (
        <CheckerPage onTabChange={handleTabChange} onSearchOpen={openSearch} onProfileOpen={() => setProfileOpen(true)} />
      ) : currentPage === 'library' ? (
        <LibraryPage
          drugs={DRUGS}
          onTabChange={handleTabChange}
          onDrugClick={handleDrugClick}
          onSearchOpen={openSearch}
          onProfileOpen={() => setProfileOpen(true)}
        />
      ) : currentPage === 'article' ? (
        <ArticlePage
          onBack={() => setCurrentPage('home')}
          onDrug={(drugKey) => {
            skipTransitionRef.current = true;
            handleDrugClick(String(drugKey));
            requestAnimationFrame(() => { skipTransitionRef.current = false; });
          }}
          onTabChange={handleTabChange}
          onSearchOpen={openSearch}
        />
      ) : currentPage === 'journal' ? (
        <>
          <JournalMainPage
            tripLogs={tripLogs}
            onLogTrip={() => {
              setDraftLog({});
              setSessionKey(k => k + 1);
              requestAnimationFrame(() => {
                setJournalStep('context');
              });
            }}
            onTabChange={handleTabChange}
            onProfileOpen={() => setProfileOpen(true)}
          />
          <JournalContextOverlay
            key={`ctx-${sessionKey}`}
            isOpen={journalStep === 'context' || journalStep === 'mood' || journalStep === 'reflection'}
            onNext={(data) => { setDraftLog(prev => ({ ...prev, ...data })); setJournalStep('mood'); }}
            onBack={() => setJournalStep('main')}
            onClose={() => setJournalStep('main')}
          />
          <JournalMoodOverlay
            key={`mood-${sessionKey}`}
            isOpen={journalStep === 'mood' || journalStep === 'reflection'}
            onNext={(data) => { setDraftLog(prev => ({ ...prev, ...data })); setJournalStep('reflection'); }}
            onBack={() => setJournalStep('context')}
            onClose={() => setJournalStep('main')}
          />
          <JournalReflectionOverlay
            key={`refl-${sessionKey}`}
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
      ) : (
        <div className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">

          {/* ── FIXED HEADER ── */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 50 }}>
            {/* Layer 1: blur with gradient mask */}
            <div style={{
              position: 'absolute', inset: 0,
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
              <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
                <button
                  onClick={() => setProfileOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Open profile"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
                    <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
                  </svg>
                </button>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', margin: 0, lineHeight: 1.5 }}>
                  CTRL
                </p>
                <button
                  onClick={openSearch}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  aria-label="Open search"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
                    <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── SCROLLABLE HOME CONTENT ── */}
          <div className="hide-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden">
            <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
            <div style={{ paddingTop: '72px', paddingBottom: '116px', paddingLeft: '16px', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <MainNewsBlock />

              {/* Shop strip */}
              <div className="bg-[#171717] rounded-[16px] overflow-hidden">
                <div className="flex gap-[8px] overflow-x-auto p-4 hide-scrollbar">
                  <div className="relative w-[240px] h-[174px] bg-[#171717] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setCurrentPage('shop')}>
                    <img src={img1BoxKit2} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-cover" />
                    <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Testing kit</p>
                  </div>
                  <div className="relative w-[240px] h-[174px] bg-[#171717] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setCurrentPage('shop')}>
                    <img src={imgBoxKit22} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-cover" />
                    <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Fentanyl strips</p>
                  </div>
                  <div className="relative w-[240px] h-[174px] bg-[#171717] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setCurrentPage('shop')}>
                    <img src={imgBoxKit32} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-cover" />
                    <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">2-in-1 party kit</p>
                  </div>
                  <div className="relative w-[240px] h-[174px] bg-[#171717] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setCurrentPage('shop')}>
                    <img src={imgTestingKit1} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-cover" />
                    <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Testing kit</p>
                  </div>
                </div>
              </div>

              {/* Journal Card */}
              {(() => {
                const isEmpty = tripLogs.length === 0;
                const sessionCount = tripLogs.length;

                const label = isEmpty
                  ? '3 sessions logged this month'
                  : sessionCount === 1
                  ? '1 session logged this month'
                  : `${sessionCount} sessions logged this month`;

                const totalDots = 22;
                const PLACEHOLDER_DOTS = [
                  false, false, false, false, true, false, false, false, false, false, false,
                  false, true, false, false, false, false, false, false, false, true, false,
                ];
                const activeDotIndices = tripLogs.map((_, i) =>
                  Math.floor((i / Math.max(tripLogs.length, 1)) * totalDots)
                );

                const lastEntry = isEmpty ? null : tripLogs[0].date;
                const lastSubstances = tripLogs[0]?.substances ?? [];
                const lastFeelings = tripLogs[0]?.bodyFeelings ?? [];

                const SUBSTANCE_COLORS: Record<string, string> = {
                  MDMA: '#FFBEEA', GHB: '#A8E6CF', Ecstasy: '#FF9BE0', Cocaine: '#F1F1F1',
                  '2C-B': '#FFB6A3', DMT: '#C3B1E1', Ketamine: '#CCF1FF', Caffeine: '#F5D163', LSD: '#B5EAD7',
                };

                const handleAddLog = () => {
                  setCurrentPage('journal');
                  setActiveTab('Journal');
                  setDraftLog({});
                  setSessionKey(k => k + 1);
                  requestAnimationFrame(() => setJournalStep('context'));
                };

                return (
                  <div
                    className="bg-[#171717] rounded-[16px] p-4 space-y-4 cursor-pointer"
                    onClick={() => { setCurrentPage('journal'); setActiveTab('Journal'); setJournalStep('main'); }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white text-[18px] font-bold tracking-[0.36px]">Journal</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddLog(); }}
                        className="w-6 h-6 flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
                        aria-label="Log a trip"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d={svgPaths.p3b3aa00} fill="#F1F1F1" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[#F1F1F1] text-[16px] font-normal tracking-[0.32px]">{label}</p>
                      <img src={ArrowUpIcon} alt="up" className="w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-11 gap-2">
                      {Array.from({ length: totalDots }).map((_, i) => {
                        const isActive = isEmpty ? PLACEHOLDER_DOTS[i] : activeDotIndices.includes(i);
                        return (
                          <div key={i} className={`w-[23px] h-[23px] rounded-full ${isActive ? 'bg-[#8C5CFE]' : 'bg-[#2D2D2D]'}`} />
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#F1F1F1] text-[16px] font-normal tracking-[0.32px]">
                        Last entry: {isEmpty ? '3 days ago' : lastEntry}
                      </p>
                      {isEmpty ? (
                        <>
                          <span className="border border-[#F1F1F1] text-[#F1F1F1] px-3 py-2 rounded-[18px] text-[14px]">LSD</span>
                          <span className="border border-[#F1F1F1] text-[#F1F1F1] px-3 py-2 rounded-[18px] text-[14px]">Nature</span>
                        </>
                      ) : (
                        lastSubstances.map(tag => (
                          <span
                            key={tag}
                            style={{ borderColor: SUBSTANCE_COLORS[tag] || '#F1F1F1', color: SUBSTANCE_COLORS[tag] || '#F1F1F1' }}
                            className="border px-3 py-2 rounded-[18px] text-[14px]"
                          >{tag}</span>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#F1F1F1] text-[16px] font-normal tracking-[0.32px]">You felt most:</p>
                      {isEmpty ? (
                        <>
                          <span className="border border-[#FFBEEA] text-[#FFBEEA] px-3 py-2 rounded-[18px] text-[14px]">Connected</span>
                          <span className="border border-[#FFADA5] text-[#FFADA5] px-3 py-2 rounded-[18px] text-[14px]">Overstimulated</span>
                        </>
                      ) : lastFeelings.length > 0 ? (
                        lastFeelings.map(tag => (
                          <span key={tag} className="border border-[#FFADA5] text-[#FFADA5] px-3 py-2 rounded-[18px] text-[14px]">{tag}</span>
                        ))
                      ) : (
                        <span className="text-[#F1F1F1] text-[14px] opacity-50">—</span>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* ── FIXED BOTTOM NAVIGATION ── */}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      {/* ── DRUG DETAIL OVERLAY — instant, no animation ── */}
      {selectedDrug !== null && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
          <DrugDetailPage
            drug={selectedDrug}
            onBack={handleDrugBack}
            onTabChange={handleTabChange}
            onSearchOpen={openSearch}
          />
        </div>
      )}

      {/* ── SEARCH OVERLAY ── */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDrug={(drugKey) => {
          setCurrentPage(previousPageRef.current);
          handleDrugClick(String(drugKey));
          setSearchOpen(false);
        }}
      />

      {/* ── PROFILE OVERLAY ── */}
      <ProfilePage
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
