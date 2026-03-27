import svgPaths from '../../../imports/svg-9phyw3y14s';
import imgBoxKit32 from 'figma:asset/3540376fb624c022b5c0acc0baca73f0f03c7230.png';
import { BottomNav } from '../ui/BottomNav';
import { LAYOUT } from '../../constants/layout';

interface ShopPageProps {
  onBack: () => void;
  onSearchOpen?: () => void;
}

export function ShopPage({ onBack, onSearchOpen }: ShopPageProps) {
  return (
    <div className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">

      {/* ── FIXED HEADER ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[56px]">
        {/* Layer 1: blur + mask */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          }}
        />
        {/* Layer 2: solid → transparent gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #0D0D0D 30%, rgba(13,13,13,0) 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Layer 3: content */}
        <div className="relative h-full flex flex-col z-10">
          {/* Nav row: back ← | Shop | search */}
          <div className="h-[56px] flex items-center justify-between px-4">
            {/* Back button */}
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="Go back"
            >
              <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
                <path d={svgPaths.pb6bc280} fill="#F1F1F1" />
              </svg>
            </button>

            {/* Title */}
            <p className="text-[#F1F1F1] text-[18px] font-bold tracking-[0.36px]">Shop</p>

            {/* Search icon */}
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
        {/* Hero image area — 397px tall, image sits 43px from top */}
        <div className="relative w-full" style={{ height: '397px' }}>
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '43px', width: '385px', height: '385px' }}>
            <img
              src={imgBoxKit32}
              alt="Testing Kit"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>

        {/* Product card — overlaps image by ~31px */}
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
                Testing Kit
              </p>
              <p
                className="text-[#F1F1F1] text-[32px] tracking-[0.64px]"
                style={{ fontFamily: 'TT Travels Next Trial Variable, sans-serif', fontWeight: 704 }}
              >
                €30
              </p>
            </div>

            {/* Description */}
            <div
              className="text-[#F1F1F1] text-[16px] leading-[1.3] tracking-[0.32px] w-full"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
            >
              <p className="mb-0">CTRL. Drug Checking Kit</p>
              <p>
                Know what you're taking — before you take it.
                <br /><br />
                Whether you're heading to a rave, hosting a house party, or just staying curious, the ctrl. kit gives you the tools to test and verify substances quickly and discreetly. Packed with essential reagents, step-by-step guides, and no-BS harm reduction tips, it's designed to help you stay safe without killing the vibe.
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
              <li className="mb-1">Reagents for the most common club substances</li>
              <li className="mb-1">Spill-proof vials and single-use tools</li>
              <li className="mb-1">Fast guides + QR access to deeper info</li>
              <li>Gloves, wipes, and everything you need to test on the go</li>
            </ul>

            {/* Closing lines */}
            <div
              className="text-[#F1F1F1] text-[16px] leading-[1.3] tracking-[0.32px] w-full"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
            >
              <p className="mb-0">Built for real life.</p>
              <p className="mb-0">Pocket-sized.</p>
              <p className="mb-0">Party-proof.</p>
              <p>And judgment-free.</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 w-full">
              <button className="flex-1 h-[61px] bg-[#8C5CFE] rounded-[8px] flex items-center justify-center">
                <span
                  className="text-[#F1F1F1] text-[18px] tracking-[0.36px]"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
                >
                  Get this Kit
                </span>
              </button>
              <button className="flex-1 h-[61px] bg-[#F1F1F1] rounded-[8px] flex items-center justify-center gap-2">
                {/* Apple logo */}
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
        onTabChange={(tab) => {
          if (tab === 'Home') onBack();
        }}
      />

    </div>
  );
}