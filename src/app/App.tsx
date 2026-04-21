import { useState, useRef, useEffect } from 'react';
import { id } from '@instantdb/react';
import { db } from '../db';
import svgPaths from '../imports/svg-srcobnd1q5';
import ArrowUpIcon from '../imports/24x24_arrow_up.svg';
import imgPrePartyKit from '../assets/Pre-Party Kit.png';
import imgAfterPartyKit from '../assets/After-Party Kit.png';
import imgTwoInOneKit from '../assets/2-in-1 Party Kit.png';
import imgTestingKit from '../assets/Testing Kit.png';
import shopImage from 'figma:asset/158d2cf416b73440500600afc54970028192895b.png';
import { LiveNewsBlock, FALLBACK_NEWS } from './components/figma/LiveNewsBlock';
import type { NewsItem } from './components/figma/LiveNewsBlock';
import { ShopPage } from './components/figma/ShopPage';
import { ShopKitPage } from './components/figma/ShopKitPage';
import { PrePartyKitPage } from './components/figma/PrePartyKitPage';
import { AfterPartyKitPage } from './components/figma/AfterPartyKitPage';
import { TwoInOneKitPage } from './components/figma/TwoInOneKitPage';
// ── CHANGED: also import adaptDrugs + TripSitDrug type ──
import { OnboardingScreen, hasSeenOnboarding } from './components/figma/OnboardingScreen';
import { LibraryPage, adaptDrugs } from './components/figma/LibraryPage';
import type { TripSitDrug } from './components/figma/LibraryPage';
import { DrugDetailPage } from './components/figma/DrugDetailPage';
import { ArticlePage } from './components/figma/ArticlePage';
import { ProfilePage } from './components/figma/ProfilePage';
import { InstallPromptOverlay } from './components/figma/InstallPromptOverlay';
import { JournalMainPage } from './components/figma/JournalMainPage';
import { JournalContextOverlay } from './components/figma/JournalContextOverlay';
import { JournalMoodOverlay } from './components/figma/JournalMoodOverlay';
import { JournalReflectionOverlay } from './components/figma/JournalReflectionOverlay';
import { SuccessScreen } from './components/figma/SuccessScreen';
import { BottomNav } from './components/ui/BottomNav';
import { SearchOverlay } from './components/ui/SearchOverlay';
import { CheckerPage } from './components/figma/CheckerPage';
import { ScanPage } from './components/figma/ScanPage';
import { ChecklistOverlay } from './components/figma/ChecklistOverlay';
import type { ChecklistItem } from './components/figma/ChecklistOverlay';
import type { TripLog, JournalStep } from './types/journal';
// ── CHANGED: import the raw TripSit JSON ──
import drugsRaw from './components/figma/data/drugs.json';
import { DRUG_CATEGORY_COLOR } from './components/ui/DrugCardArt';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';


// ── CHANGED: adapt once at module level, not inside the component ──
const DRUGS: TripSitDrug[] = adaptDrugs(drugsRaw as Record<string, unknown>);

export default function App() {
  const { user } = db.useAuth();
  const [onboardingDone, setOnboardingDone] = useState(hasSeenOnboarding);

  // Local state for guest mode (user === null) — zero InstantDB persistence
  const [localChecklistItems, setLocalChecklistItems] = useState<ChecklistItem[]>([]);
  const [localTripLogs, setLocalTripLogs] = useState<TripLog[]>([]);
  const [localSavedDrugs, setLocalSavedDrugs] = useState<Array<{ id: string; drugKey: string }>>([]);

  // InstantDB query — skipped entirely (null) when not logged in
  const { data } = db.useQuery(user ? {
    checklistItems: { $: { where: { 'owner.id': user.id } } },
    tripLogs: { $: { where: { 'owner.id': user.id } } },
    savedDrugs: { $: { where: { 'owner.id': user.id } } },
  } : null);

  // ── Checklist ─────────────────────────────────────────────────────────────
  const checklistItems: ChecklistItem[] = user
    ? [...(data?.checklistItems ?? [])].sort((a, b) => a.createdAt - b.createdAt)
    : [...localChecklistItems].sort((a, b) => a.createdAt - b.createdAt);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checklistFocusAdd, setChecklistFocusAdd] = useState(false);

  const [liveNews, setLiveNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [activeTab, setActiveTab] = useState<NavTab>('Home');
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'shopKit' | 'shopKitPre' | 'shopKitAfter' | 'shopKitTwo' | 'library' | 'article' | 'fentanyl' | 'journal' | 'checker' | 'scan'>('home');
  // ── CHANGED: number → TripSitDrug object ──
  const [selectedDrug, setSelectedDrug] = useState<TripSitDrug | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  // Journal state
  const [journalStep, setJournalStep] = useState<JournalStep>('main');
  const [draftLog, setDraftLog] = useState<Partial<TripLog>>({});
  const [sessionKey, setSessionKey] = useState(0);
  const [editingLog, setEditingLog] = useState<TripLog | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const drugKey = params.get('drug');
    if (drugKey) {
      const drug = DRUGS.find(d => d.key === drugKey);
      if (drug) {
        setSelectedDrug(drug);
        setCurrentPage('library');
        setActiveTab('Library');
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const previousPageRef = useRef<'home' | 'shop' | 'shopKit' | 'shopKitPre' | 'shopKitAfter' | 'shopKitTwo' | 'library' | 'article' | 'fentanyl' | 'journal' | 'checker' | 'scan'>('home');
  const kitBackRef = useRef<'home' | 'shop'>('shop');
  const openSearch = () => {
    previousPageRef.current = currentPage;
    setSearchOpen(true);
  };

  const addChecklistItem = (text: string) => {
    if (!user) {
      setLocalChecklistItems(prev => [...prev, { id: id(), text, checked: false, createdAt: Date.now() }]);
      return;
    }
    db.transact(db.tx.checklistItems[id()].update({ text, checked: false, createdAt: Date.now() }).link({ owner: user.id }));
  };
  const toggleChecklistItem = (itemId: string) => {
    if (!user) {
      setLocalChecklistItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i));
      return;
    }
    const item = checklistItems.find(i => i.id === itemId);
    if (item) db.transact(db.tx.checklistItems[itemId].update({ checked: !item.checked }));
  };
  const deleteChecklistItem = (itemId: string) => {
    if (!user) {
      setLocalChecklistItems(prev => prev.filter(i => i.id !== itemId));
      return;
    }
    db.transact(db.tx.checklistItems[itemId].delete());
  };

  // ── Saved drugs ───────────────────────────────────────────────────────────
  const savedDrugSource = user ? (data?.savedDrugs ?? []) : localSavedDrugs;
  const savedDrugMap = new Map(savedDrugSource.map(d => [d.drugKey as string, d.id]));
  const savedKeys = new Set(savedDrugMap.keys());

  // ── Trip logs ─────────────────────────────────────────────────────────────
  const tripLogs: TripLog[] = user
    ? [...(data?.tripLogs ?? [])].sort((a, b) => (b.createdAt as number) - (a.createdAt as number)) as TripLog[]
    : [...localTripLogs].sort((a, b) => (b.createdAt as number) - (a.createdAt as number)) as TripLog[];

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    // ── CHANGED: clear selectedDrug instead of selectedDrugId ──
    setSelectedDrug(null);
    if (tab === 'Library') setCurrentPage('library');
    else if (tab === 'Home') setCurrentPage('home');
    else if (tab === 'Checker') setCurrentPage('checker');
    else if (tab === 'Scan') setCurrentPage('scan');
    else if (tab === 'Journal') { setCurrentPage('journal'); setJournalStep('main'); }
    else setCurrentPage('home');
  };

  // ── CHANGED: look up drug object by string key ──
  const handleDrugClick = (drugKey: string) => {
    const drug = DRUGS.find(d => d.key === drugKey) ?? null;
    setSelectedDrug(drug);
  };
  const handleDrugBack = () => setSelectedDrug(null);
  const handleSaveToggle = (drugKey: string) => {
    if (!user) {
      const exists = localSavedDrugs.find(d => d.drugKey === drugKey);
      if (exists) {
        setLocalSavedDrugs(prev => prev.filter(d => d.drugKey !== drugKey));
      } else {
        setLocalSavedDrugs(prev => [...prev, { id: id(), drugKey }]);
      }
      return;
    }
    const entityId = savedDrugMap.get(drugKey);
    if (entityId) db.transact(db.tx.savedDrugs[entityId].delete());
    else db.transact(db.tx.savedDrugs[id()].update({ drugKey }).link({ owner: user.id }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {!onboardingDone && (
        <OnboardingScreen onDone={() => setOnboardingDone(true)} />
      )}

      {/* ── BASE PAGE LAYER ── */}
      {currentPage === 'shop' ? (
        <ShopPage
          onBack={() => { setCurrentPage('home'); setActiveTab('Home'); }}
          onSearchOpen={openSearch}
          onTabChange={handleTabChange}
          onKitClick={(kit) => {
            kitBackRef.current = 'shop';
            if (kit === 'preParty') setCurrentPage('shopKitPre');
            else if (kit === 'afterParty') setCurrentPage('shopKitAfter');
            else if (kit === 'twoInOne') setCurrentPage('shopKitTwo');
            else if (kit === 'testing') setCurrentPage('shopKit');
          }}
        />
      ) : currentPage === 'shopKit' ? (
        <ShopKitPage
          onBack={() => setCurrentPage(kitBackRef.current)}
          onSearchOpen={openSearch}
          onTabChange={handleTabChange}
        />
      ) : currentPage === 'shopKitPre' ? (
        <PrePartyKitPage
          onBack={() => setCurrentPage(kitBackRef.current)}
          onSearchOpen={openSearch}
          onTabChange={handleTabChange}
        />
      ) : currentPage === 'shopKitAfter' ? (
        <AfterPartyKitPage
          onBack={() => setCurrentPage(kitBackRef.current)}
          onSearchOpen={openSearch}
          onTabChange={handleTabChange}
        />
      ) : currentPage === 'shopKitTwo' ? (
        <TwoInOneKitPage
          onBack={() => setCurrentPage(kitBackRef.current)}
          onSearchOpen={openSearch}
          onTabChange={handleTabChange}
        />
      ) : currentPage === 'scan' ? (
        <ScanPage onTabChange={handleTabChange} />
      ) : currentPage === 'checker' ? (
        <CheckerPage onTabChange={handleTabChange} onSearchOpen={openSearch} onProfileOpen={() => setProfileOpen(true)} />
      ) : currentPage === 'library' ? (
        // ── CHANGED: pass drugs={DRUGS} and updated onDrugClick ──
        <LibraryPage
          drugs={DRUGS}
          savedKeys={savedKeys}
          onTabChange={handleTabChange}
          onDrugClick={handleDrugClick}
          onSearchOpen={openSearch}
          onProfileOpen={() => setProfileOpen(true)}
        />
      ) : currentPage === 'article' ? (
        <ArticlePage
          news={liveNews}
          drugs={DRUGS}
          onDrug={(key) => { handleDrugClick(key); }}
          onBack={() => setCurrentPage('home')}
          onTabChange={handleTabChange}
          onSearchOpen={openSearch}
        />
      ) : currentPage === 'fentanyl' ? (
        // legacy fentanyl route — look up by key
        (() => {
          const fentanyl = DRUGS.find(d => d.key === 'fentanyl');
          return fentanyl ? (
            <DrugDetailPage
  drug={fentanyl}
  onBack={() => setCurrentPage('article')}
  onTabChange={handleTabChange}
  onSearchOpen={openSearch}
  isSaved={savedKeys.has(fentanyl.key)}
  onSaveToggle={handleSaveToggle}
/>
          ) : null;
        })()
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
            onDeleteLog={(logId) => {
              if (!user) {
                setLocalTripLogs(prev => prev.filter(l => l.id !== logId));
              } else {
                db.transact(db.tx.tripLogs[logId].delete());
              }
            }}
            onEditLog={(log) => setEditingLog(log)}
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
            onDone={(log) => {
              if (!user) {
                setLocalTripLogs(prev => [{ ...log, id: id(), createdAt: Date.now() } as TripLog, ...prev]);
              } else {
                db.transact(db.tx.tripLogs[id()].update({ ...log, createdAt: Date.now() }).link({ owner: user.id }));
              }
              setDraftLog({}); setJournalStep('done');
              if (!localStorage.getItem('ctrl_install_prompted')) {
                localStorage.setItem('ctrl_install_prompted', '1');
                setTimeout(() => setShowInstall(true), 1800);
              }
            }}
            onBack={() => setJournalStep('mood')}
            onClose={() => setJournalStep('main')}
          />
          {journalStep === 'done' && (
            <SuccessScreen
              isFirst={tripLogs.length === 1}
              onComplete={() => setJournalStep('main')}
            />
          )}
          {editingLog && (
            <JournalReflectionOverlay
              key={`edit-${editingLog.id}`}
              isOpen={true}
              draftLog={editingLog}
              onDone={() => {}}
              onBack={() => setEditingLog(null)}
              onClose={() => setEditingLog(null)}
              editLog={editingLog}
              onUpdate={(updated) => {
                if (!user) {
                  setLocalTripLogs(prev => prev.map(l => l.id === updated.id ? updated : l));
                } else {
                  db.transact(db.tx.tripLogs[updated.id].update({
                    feltGood: updated.feltGood,
                    challenging: updated.challenging,
                    learned: updated.learned,
                    different: updated.different,
                  }));
                }
                setEditingLog(null);
              }}
            />
          )}
        </>
      ) : (
        // ── HOME PAGE — untouched, exactly as original ──
        <div className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">

          {/* ── FIXED HEADER ── */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 50 }}>
            <div style={{
              position: 'absolute', inset: 0,
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
              <button
                onClick={() => setProfileOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                aria-label="Open profile"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
                  <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={openSearch}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                aria-label="Open search"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="13" cy="13" r="9" stroke="#F1F1F1" strokeWidth="2" />
                  <path d="M19.5 19.5L25.5 25.5" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── SCROLLABLE CONTENT ── */}
          <div className="absolute top-0 bottom-0 left-0 right-0 overflow-y-auto overflow-x-hidden">
            <div className="pb-[124px] space-y-4" style={{ paddingTop: '0px' }}>

              <div className="px-2 h-[416px]">
                <LiveNewsBlock onReadArticle={() => setCurrentPage('article')} onNewsLoaded={setLiveNews} />
              </div>

              <div className="px-2 space-y-4">

                {/* Party Checklist Card */}
                <div className="bg-[#171717] rounded-[16px] p-4 space-y-6 cursor-pointer" onClick={() => setChecklistOpen(true)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <p className="text-white text-[18px] font-bold tracking-[0.36px]">Party checklist</p>
                      <p className="text-[#8C5CFE] text-[18px] font-bold tracking-[0.36px]">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setChecklistFocusAdd(true); setChecklistOpen(true); }}
                      className="w-6 h-6 bg-transparent border-0 cursor-pointer p-0 flex items-center justify-center"
                      aria-label="Add checklist item"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d={svgPaths.p3b3aa00} fill="#F1F1F1" />
                      </svg>
                    </button>
                  </div>
                  {checklistItems.length === 0 ? (
                    <p className="text-[#F1F1F1] text-[16px] font-normal leading-[1.3] tracking-[0.32px] opacity-30">Nothing here yet</p>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {checklistItems.slice(0, 4).map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <button
                              onClick={e => { e.stopPropagation(); toggleChecklistItem(item.id); }}
                              className={`w-6 h-6 border-2 flex items-center justify-center flex-shrink-0 cursor-pointer p-0 ${item.checked ? 'border-[#8C5CFE]' : 'border-[#555]'}`}
                              style={{ borderRadius: '4px', background: item.checked ? '#8C5CFE' : 'transparent' }}
                            >
                              {item.checked && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                            <p className={`text-[#F1F1F1] text-[16px] font-normal leading-[1.3] tracking-[0.32px] ${item.checked ? 'opacity-40 line-through' : ''}`}>{item.text}</p>
                          </div>
                        ))}
                      </div>
                      {checklistItems.length > 4 && (
                        <p className="text-white text-[16px] font-normal leading-[1.3] tracking-[0.32px] opacity-50">+ {checklistItems.length - 4} more tasks</p>
                      )}
                    </>
                  )}
                </div>

                {/* Horizontal Scroll Shop Strip */}
                <div className="overflow-x-auto -mx-2 px-2">
                  <div className="flex gap-4 w-max">
                    <div className="relative w-[174px] h-[174px] bg-[#AAFF00] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setCurrentPage('shop')}>
                      <img src={shopImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0D0D] rounded-full px-6 py-[19px] flex items-center gap-1">
                        <p className="text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Shop</p>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M9 6L15 12L9 18" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative w-[240px] h-[174px] bg-[#8C5CFE] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => { kitBackRef.current = 'home'; setCurrentPage('shopKitPre'); }}>
                      <img src={imgPrePartyKit} alt="" className="absolute bottom-[-44px] left-[40px] w-[260px] h-[260px] object-contain" />
                      <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Pre-party kit</p>
                    </div>
                    <div className="relative w-[240px] h-[174px] bg-[#AAFF00] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => { kitBackRef.current = 'home'; setCurrentPage('shopKitAfter'); }}>
                      <img src={imgAfterPartyKit} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-contain" />
                      <p className="absolute bottom-4 left-4 text-[#0D0D0D] text-[18px] font-bold tracking-[0.36px]">After-party kit</p>
                    </div>
                    <div className="relative w-[240px] h-[174px] bg-[#171717] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => { kitBackRef.current = 'home'; setCurrentPage('shopKitTwo'); }}>
                      <img src={imgTwoInOneKit} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-contain" />
                      <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">2-in-1 party kit</p>
                    </div>
                    <div className="relative w-[240px] h-[174px] bg-[#171717] rounded-[16px] overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => { kitBackRef.current = 'home'; setCurrentPage('shopKit'); }}>
                      <img src={imgTestingKit} alt="" className="absolute top-1/2 left-[40px] -translate-y-1/2 w-[260px] h-[260px] object-contain" />
                      <p className="absolute bottom-4 left-4 text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Testing kit</p>
                    </div>
                  </div>
                </div>

                {/* Journal Card */}
                {(() => {
                  const isEmpty = tripLogs.length === 0;
                  const sessionCount = tripLogs.length;

                  const label = isEmpty
                    ? '0 moments reflected this month'
                    : sessionCount === 1
                    ? '1 moment reflected this month'
                    : `${sessionCount} moments reflected this month`;

                  const totalDots = 31;
                  const dayCountMap = new Map<number, number>();
                  tripLogs.forEach(log => {
                    const match = log.date?.match(/\d+/);
                    if (match) {
                      const day = parseInt(match[0], 10);
                      dayCountMap.set(day, (dayCountMap.get(day) ?? 0) + 1);
                    }
                  });

                  const lastEntry = isEmpty ? null : tripLogs[0].date;
                  const lastSubstances = tripLogs[0]?.substances ?? [];
                  const lastFeelings = tripLogs[0]?.bodyFeelings ?? [];

                  const SUBSTANCE_COLORS: Record<string, string> = {
                    // Empathogens
                    MDMA: DRUG_CATEGORY_COLOR.Empathogens, Ecstasy: DRUG_CATEGORY_COLOR.Empathogens,
                    MDA: DRUG_CATEGORY_COLOR.Empathogens, Mephedrone: DRUG_CATEGORY_COLOR.Empathogens,
                    '3-MMC': DRUG_CATEGORY_COLOR.Empathogens, '4-FA': DRUG_CATEGORY_COLOR.Empathogens,
                    // Psychedelics
                    LSD: DRUG_CATEGORY_COLOR.Psychedelics, Mushrooms: DRUG_CATEGORY_COLOR.Psychedelics,
                    DMT: DRUG_CATEGORY_COLOR.Psychedelics, Ayahuasca: DRUG_CATEGORY_COLOR.Psychedelics,
                    Mescaline: DRUG_CATEGORY_COLOR.Psychedelics, '2C-B': DRUG_CATEGORY_COLOR.Psychedelics,
                    NBOMe: DRUG_CATEGORY_COLOR.Psychedelics,
                    // Stimulants
                    Cocaine: DRUG_CATEGORY_COLOR.Stimulants, Amphetamines: DRUG_CATEGORY_COLOR.Stimulants,
                    Meth: DRUG_CATEGORY_COLOR.Stimulants, Speed: DRUG_CATEGORY_COLOR.Stimulants,
                    Caffeine: DRUG_CATEGORY_COLOR.Stimulants, Ritalin: DRUG_CATEGORY_COLOR.Stimulants,
                    // Depressants
                    Alcohol: DRUG_CATEGORY_COLOR.Depressants, GHB: DRUG_CATEGORY_COLOR.Depressants,
                    'GHB/GBL': DRUG_CATEGORY_COLOR.Depressants, Cannabis: DRUG_CATEGORY_COLOR.Depressants,
                    // Dissociatives
                    Ketamine: DRUG_CATEGORY_COLOR.Dissociatives, Nitrous: DRUG_CATEGORY_COLOR.Dissociatives,
                    '2-FDCK': DRUG_CATEGORY_COLOR.Dissociatives, DXM: DRUG_CATEGORY_COLOR.Dissociatives,
                    // Opioids
                    Heroin: DRUG_CATEGORY_COLOR.Opioids, Fentanyl: DRUG_CATEGORY_COLOR.Opioids,
                    Oxycodone: DRUG_CATEGORY_COLOR.Opioids, Tramadol: DRUG_CATEGORY_COLOR.Opioids,
                    Kratom: DRUG_CATEGORY_COLOR.Opioids,
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
                        <p className="text-[#F1F1F1] text-[16px] font-normal tracking-[0.32px] opacity-30">{label}</p>
                        {!isEmpty && <img src={ArrowUpIcon} alt="up" className="w-6 h-6" />}
                      </div>
                      <div className="grid grid-cols-11 gap-2">
                        {Array.from({ length: totalDots }).map((_, i) => {
                          const day = i + 1;
                          const count = dayCountMap.get(day) ?? 0;
                          const isActive = count > 0;
                          return (
                            <div
                              key={i}
                              className="w-[24px] h-[24px] rounded-full flex items-center justify-center"
                              style={{ backgroundColor: isActive ? '#8C5CFE' : '#2D2D2D' }}
                            >
                              {isActive && (
                                <span style={{
                                  color: '#F1F1F1',
                                  fontFamily: 'Sora',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  lineHeight: 'normal',
                                }}>
                                  {count}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {!isEmpty && (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[#F1F1F1] text-[16px] font-normal tracking-[0.32px]">
                              Last entry: {lastEntry}
                            </p>
                            {lastSubstances.map(tag => (
                              <span
                                key={tag}
                                style={{ borderColor: SUBSTANCE_COLORS[tag] || '#F1F1F1', color: SUBSTANCE_COLORS[tag] || '#F1F1F1' }}
                                className="border px-[10px] py-[4px] rounded-[18px] text-[14px]"
                              >{tag}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[#F1F1F1] text-[16px] font-normal tracking-[0.32px]">You felt most:</p>
                            {lastFeelings.length > 0 ? (
                              lastFeelings.map(tag => (
                                <span key={tag} className="border border-[#F1F1F1] text-[#F1F1F1] px-[10px] py-[4px] rounded-[18px] text-[14px]">{tag}</span>
                              ))
                            ) : (
                              <span className="text-[#F1F1F1] text-[14px] opacity-50">—</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

              </div>
            </div>
          </div>

          {/* ── FIXED BOTTOM NAVIGATION ── */}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      {/* ── DRUG DETAIL OVERLAY — instant, no animation ── */}
      {/* ── CHANGED: drug object instead of numeric id ── */}
      {selectedDrug !== null && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
          <DrugDetailPage
  drug={selectedDrug}
  onBack={handleDrugBack}
  onTabChange={handleTabChange}
  onSearchOpen={openSearch}
  isSaved={savedKeys.has(selectedDrug.key)}
  onSaveToggle={handleSaveToggle}
/>
        </div>
      )}

      {/* ── SEARCH OVERLAY ── */}
      {/* ── CHANGED: onSelectDrug now passes string key ── */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        drugs={DRUGS} 
        onSelectDrug={(drugKey) => {
          setCurrentPage(previousPageRef.current);
          handleDrugClick(String(drugKey));
          setSearchOpen(false);
        }}
      />

      {/* ── CHECKLIST OVERLAY ── */}
      <ChecklistOverlay
        isOpen={checklistOpen}
        focusAdd={checklistFocusAdd}
        items={checklistItems}
        onAdd={addChecklistItem}
        onToggle={toggleChecklistItem}
        onDelete={deleteChecklistItem}
        onClose={() => { setChecklistOpen(false); setChecklistFocusAdd(false); }}
      />

      {/* ── PROFILE OVERLAY ── */}
      <ProfilePage
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={() => {
          setProfileOpen(false);
          setActiveTab('Home');
          setCurrentPage('home');
          setSelectedDrug(null);
          setSearchOpen(false);
          setJournalStep('main');
          setDraftLog({});
          setSessionKey(k => k + 1);
          setLocalChecklistItems([]);
          setLocalTripLogs([]);
          setLocalSavedDrugs([]);
        }}
      />

      {/* ── INSTALL PROMPT OVERLAY ── */}
      <InstallPromptOverlay
        isOpen={showInstall}
        onClose={() => setShowInstall(false)}
      />
    </div>
  );
}
