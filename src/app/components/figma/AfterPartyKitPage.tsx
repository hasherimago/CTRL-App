import svgPaths from '../../../imports/svg-9phyw3y14s';
import imgHero from '../../../assets/After-Party Kit.png';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface AfterPartyKitPageProps {
  onBack: () => void;
  onSearchOpen?: () => void;
  onTabChange?: (tab: NavTab) => void;
}

export function AfterPartyKitPage({ onBack, onSearchOpen, onTabChange }: AfterPartyKitPageProps) {
  return (
    <div className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">

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
            background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="relative h-full flex items-center justify-between px-4 z-10">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center" aria-label="Go back">
            <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
              <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
            </svg>
          </button>
          <p className="text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">After-Party Kit</p>
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
        {/* Hero — image only */}
        <div className="relative w-full" style={{ height: '397px' }}>
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '43px', width: '385px', height: '385px' }}>
            <img
              src={imgHero}
              alt="After-Party Kit"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>

        {/* Product card */}
        <div
          className="relative mx-2 -mt-[31px] rounded-[16px] overflow-hidden"
          style={{
            backgroundColor: '#171717',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex flex-col gap-10 px-4 pt-6" style={{ paddingBottom: `${LAYOUT.CONTENT_BOTTOM_PADDING}px` }}>

            {/* Title + Price */}
            <div className="flex items-end justify-between w-full">
              <p
                className="text-[#F1F1F1] text-[24px] tracking-[0.24px]"
                style={{ fontFamily: 'TT Travels Next Trial Variable, sans-serif', fontWeight: 704 }}
              >
                After-Party Kit
              </p>
              <p
                className="text-[#F1F1F1] text-[32px] tracking-[0.64px]"
                style={{ fontFamily: 'TT Travels Next Trial Variable, sans-serif', fontWeight: 704 }}
              >
                €20
              </p>
            </div>

            {/* Description */}
            <div
              className="text-[#F1F1F1] text-[16px] leading-[1.3] tracking-[0.32px] w-full"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
            >
              <p className="mb-0">CTRL. After-Party Kit</p>
              <p>
                Come down clean.
                <br /><br />
                The night's over. Now take care of yourself. The After-Party Kit is designed to help your body and mind recover after a night out — whether that's replenishing what you've lost, calming your nervous system, or just giving yourself the tools to get through the morning-after without it wrecking your week.
              </p>
            </div>

            {/* What's inside label */}
            <p
              className="text-[#F1F1F1] text-[18px] leading-[1.5] tracking-[0.36px] w-full"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
            >
              What's inside:
            </p>

            {/* Bullet list */}
            <ul
              className="list-disc text-[#F1F1F1] text-[16px] leading-[1.3] tracking-[0.32px] w-full"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, paddingLeft: '24px' }}
            >
              <li className="mb-1">Electrolyte sachets — replenish fast</li>
              <li className="mb-1">Comedown support guide with actionable steps</li>
              <li className="mb-1">Sleep and mood recovery tips</li>
              <li className="mb-1">Harm journal sheet — track how you feel, spot patterns</li>
              <li>Gentle reminder cards: drink water, eat something, rest</li>
            </ul>

            {/* Closing lines */}
            <div
              className="text-[#F1F1F1] text-[16px] leading-[1.3] tracking-[0.32px] w-full"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
            >
              <p className="mb-0">The night is done.</p>
              <p className="mb-0">The recovery starts now.</p>
              <p>You've earned it.</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 w-full">
              <button className="flex-1 h-[61px] bg-[#AAFF00] rounded-[8px] flex items-center justify-center">
                <span
                  className="text-[#0D0D0D] text-[18px] tracking-[0.36px]"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
                >
                  Get this Kit
                </span>
              </button>
              <button className="flex-1 h-[61px] bg-[#F1F1F1] rounded-[8px] flex items-center justify-center gap-2">
                <svg width="13" height="16" viewBox="0 0 13.0084 16" fill="none">
                  <path d={svgPaths.p3147340} fill="#0D0D0D" />
                </svg>
                <span
                  className="text-[#0D0D0D] text-[18px] tracking-[0.36px]"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
                >
                  Pay
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── FIXED BOTTOM NAV ── */}
      <BottomNav
        onTabChange={(tab) => onTabChange ? onTabChange(tab) : onBack()}
      />

    </div>
  );
}
