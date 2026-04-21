import svgPaths from '../../../imports/svg-9phyw3y14s';
import imgPrePartyKit from '../../../assets/Pre-Party Kit.png';
import imgAfterPartyKit from '../../../assets/After-Party Kit.png';
import imgTwoInOneKit from '../../../assets/2-in-1 Party Kit.png';
import imgTestingKit from '../../../assets/Testing Kit.png';
import imgCtrlLabBg from '../../../assets/Ctrl-lab.png';
import imgCtrlCheckBg from '../../../assets/Ctrl-check.png';
import imgMerch1 from '../../../assets/merch1.png';
import imgMerch2 from '../../../assets/merch2.png';
import imgMerch3 from '../../../assets/merch3.png';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface ShopPageProps {
  onBack: () => void;
  onSearchOpen?: () => void;
  onKitClick?: (kit: 'preParty' | 'afterParty' | 'twoInOne' | 'testing') => void;
  onTabChange?: (tab: NavTab) => void;
}

export function ShopPage({ onBack, onSearchOpen, onKitClick, onTabChange }: ShopPageProps) {
  return (
    <div className="relative w-full h-screen bg-[#181818] overflow-hidden">

      {/* ── FIXED HEADER ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[56px]">
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #181818 30%, rgba(24,24,24,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="relative h-full flex items-center justify-between px-4 z-10">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center"
            aria-label="Go back"
          >
            <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
              <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
            </svg>
          </button>
          <p className="text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Shop</p>
          <button
            onClick={onSearchOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Open search"
          >
            <div className="w-8 h-8 relative">
              <div className="absolute left-[5px] top-[5px] w-[18px] h-[18px]">
                <div className="absolute inset-[-5.56%]">
                  <svg className="block w-full h-full" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="9" stroke="#F1F1F1" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="absolute left-[20px] top-[20px] w-[7px] h-[7px]">
                <div className="absolute inset-[-10%]">
                  <svg className="block w-full h-full" fill="none" viewBox="0 0 8.70711 8.70711">
                    <path d={svgPaths.p1a067180} fill="#F1F1F1" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: `${LAYOUT.NAV_HEIGHT}px`,
          left: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="flex flex-col gap-4 pt-[72px]" style={{ paddingBottom: `${LAYOUT.CONTENT_BOTTOM_PADDING}px` }}>

          {/* ── KIT HORIZONTAL SCROLL ── */}
          <div
            style={{
              overflowX: 'auto',
              overflowY: 'visible',
              paddingLeft: '8px',
              paddingRight: '8px',
            }}
          >
            <div className="flex gap-[14px]" style={{ width: 'max-content' }}>

              {/* Pre-party kit */}
              <button
                onClick={() => onKitClick?.('preParty')}
                className="relative flex-shrink-0 rounded-[16px] overflow-hidden"
                style={{ width: '240px', height: '174px', background: '#8C5CFE' }}
              >
                <img
                  src={imgPrePartyKit}
                  alt=""
                  className="absolute object-cover pointer-events-none"
                  style={{ width: '260px', height: '260px', left: '40px', bottom: '-44px' }}
                />
                <p
                  className="absolute text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px] whitespace-nowrap"
                  style={{ fontFamily: 'Roboto, sans-serif', bottom: '16px', left: '16px' }}
                >
                  Pre-party kit
                </p>
              </button>

              {/* After-party kit */}
              <button
                onClick={() => onKitClick?.('afterParty')}
                className="relative flex-shrink-0 rounded-[16px] overflow-hidden"
                style={{ width: '240px', height: '174px', background: '#AAFF00' }}
              >
                <img
                  src={imgAfterPartyKit}
                  alt=""
                  className="absolute object-cover pointer-events-none"
                  style={{ width: '260px', height: '260px', left: '40px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <p
                  className="absolute text-[#0D0D0D] text-[18px] font-bold tracking-[0.36px] whitespace-nowrap"
                  style={{ fontFamily: 'Roboto, sans-serif', bottom: '16px', left: '16px' }}
                >
                  After-party kit
                </p>
              </button>

              {/* 2-in-1 party kit */}
              <button
                onClick={() => onKitClick?.('twoInOne')}
                className="relative flex-shrink-0 rounded-[16px] overflow-hidden"
                style={{ width: '240px', height: '174px', background: '#0D0D0D' }}
              >
                <img
                  src={imgTwoInOneKit}
                  alt=""
                  className="absolute object-cover pointer-events-none"
                  style={{ width: '260px', height: '260px', left: '40px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <p
                  className="absolute text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px] whitespace-nowrap"
                  style={{ fontFamily: 'Roboto, sans-serif', bottom: '16px', left: '16px' }}
                >
                  2-in-1 party kit
                </p>
              </button>

              {/* Testing kit */}
              <button
                onClick={() => onKitClick?.('testing')}
                className="relative flex-shrink-0 rounded-[16px] overflow-hidden"
                style={{ width: '240px', height: '174px', background: '#0D0D0D' }}
              >
                <img
                  src={imgTestingKit}
                  alt=""
                  className="absolute object-cover pointer-events-none"
                  style={{ width: '260px', height: '260px', left: '40px', top: '-42px' }}
                />
                <p
                  className="absolute text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px] whitespace-nowrap"
                  style={{ fontFamily: 'Roboto, sans-serif', bottom: '16px', left: '16px' }}
                >
                  Testing kit
                </p>
              </button>

            </div>
          </div>

          {/* ── CTRL.LAB BANNER ── */}
          <div className="mx-2 relative rounded-[20px] overflow-hidden flex flex-col justify-end px-4 py-[30px]" style={{ height: '222px' }}>
            {/* Gradient bg */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #0b0d0c 40%, #ff81b2)' }}
            />
            {/* Van photo */}
            <img
              src={imgCtrlLabBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ mixBlendMode: 'overlay' }}
            />
            {/* Dark vignette */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(102,102,102,0.4), rgba(0,0,0,0.4))' }}
            />
            <p
              className="relative text-white text-[32px] tracking-[0.64px]"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 704 }}
            >
              Ctrl.lab
            </p>
          </div>

          {/* ── CTRL.CHECK BANNER ── */}
          <div className="mx-2 relative rounded-[20px] overflow-hidden flex flex-col justify-end px-4 py-[30px] gap-[10px]" style={{ height: '222px' }}>
            {/* Map photo */}
            <img
              src={imgCtrlCheckBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Dark vignette */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(102,102,102,0.5), rgba(0,0,0,0.5))' }}
            />
            <p
              className="relative text-white text-[32px] tracking-[0.64px] whitespace-nowrap"
              style={{ fontFamily: 'Sora, sans-serif', fontWeight: 704 }}
            >
              Ctrl.check
            </p>
          </div>

          {/* ── CTRL.MERCH ── */}
          <div style={{ overflowX: 'auto', paddingLeft: '8px', paddingRight: '8px' }}>
            <div className="flex items-center" style={{ width: 'max-content', gap: '0' }}>

              {/* Title */}
              <div className="flex-shrink-0" style={{ paddingRight: '16px' }}>
                <p
                  className="text-white text-[32px] tracking-[0.64px]"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 704, lineHeight: '1.2', paddingLeft: '12px' }}
                >
                  Ctrl.<br />merch
                </p>
              </div>

              {/* Black shirt — €19 badge */}
              <div className="relative flex-shrink-0" style={{ width: '192px', height: '192px', marginRight: '10px' }}>
                <img
                  src={imgMerch1}
                  alt="Black t-shirt"
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: '14px',
                    right: '-10px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    height: '32px',
                    background: '#1855F1',
                    borderRadius: '8px',
                    transform: 'rotate(-10deg)',
                  }}
                >
                  <span
                    className="text-white text-[16px] font-bold"
                    style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '0.5px' }}
                  >
                    sale
                  </span>
                </div>
              </div>

              {/* Pink cap */}
              <div className="relative flex-shrink-0" style={{ width: '129px', height: '129px', marginLeft: '0px', marginRight: '0px' }}>
                <img
                  src={imgMerch2}
                  alt="Cap"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* White shirt — €35 badge */}
              <div className="relative flex-shrink-0" style={{ width: '192px', height: '192px' }}>
                <img
                  src={imgMerch3}
                  alt="White t-shirt"
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute" style={{ bottom: '10px', left: '-16px', width: '74px', height: '74px' }}>
                  <svg viewBox="0 0 74 74" className="absolute inset-0 w-full h-full" aria-hidden="true">
                    <polygon
                      points="37,2 42,18 57,10 52,26 70,27 58,38 70,50 52,50 57,66 42,57 37,72 32,57 17,66 22,50 4,50 16,38 4,27 22,26 17,10 32,18"
                      fill="#DBFF00"
                    />
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[20px] font-bold text-black"
                    style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '-1px' }}
                  >
                    €35
                  </span>
                </div>
              </div>

              {/* See all merch */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-[20px]"
                style={{ width: '261px', height: '192px', background: '#DBFF00', marginLeft: '16px' }}
              >
                <p
                  className="text-black text-[24px] font-bold"
                  style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.5px' }}
                >
                  See all merch
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── FIXED BOTTOM NAV ── */}
      <BottomNav
        activeTab="Home"
        onTabChange={(tab) => {
          if (tab === 'Home') onBack();
          else onTabChange?.(tab);
        }}
      />

    </div>
  );
}
