import { useId } from 'react';
import svgPaths from '../../../imports/svg-dddxtqm69j';

export type EmojiProps = {
  className?: string;
  face?: 'Angry' | 'Sad' | 'Neutral' | 'Happy' | 'Super';
  selected?: boolean;
  size?: number;
  /** @deprecated use selected instead */
  stage?: string;
};

// ── Shared face circle (48×48) with swappable gradient/filter ─────────────────

function FaceCircle({ fid, gid, selected }: { fid: string; gid: string; selected: boolean }) {
  return (
    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
      <g filter={`url(#${fid})`}>
        <circle cx="24" cy="24" fill={`url(#${gid})`} r="24" />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="50" id={fid} width="49" x="-1" y="0"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dx="-1" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          {selected
            ? <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.980183 0 0 0 0 0.920833 0 0 0 0.6 0" />
            : <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.2 0" />
          }
          <feBlend in2="shape" mode="normal" />
        </filter>
        {selected ? (
          <radialGradient cx="0" cy="0" gradientTransform="translate(39) rotate(125.293) scale(54.5206)" gradientUnits="userSpaceOnUse" id={gid} r="1">
            <stop stopColor="#FFFAEB" />
            <stop offset="0.21875" stopColor="#F5D163" />
            <stop offset="0.494792" stopColor="#FAD967" />
            <stop offset="0.791667" stopColor="#F2B456" />
            <stop offset="1" stopColor="#F78228" />
          </radialGradient>
        ) : (
          <radialGradient cx="0" cy="0" gradientTransform="translate(39) rotate(125.293) scale(54.5206)" gradientUnits="userSpaceOnUse" id={gid} r="1">
            <stop stopColor="#323D45" />
            <stop offset="0.21875" stopColor="#4B4F6B" />
            <stop offset="0.494792" stopColor="#4D5266" />
            <stop offset="0.791667" stopColor="#3E4559" />
            <stop offset="1" stopColor="#343340" />
          </radialGradient>
        )}
      </defs>
    </svg>
  );
}

// ── Blush dots (Happy & Super colored only) ───────────────────────────────────

function Blush() {
  return (
    <>
      <div className="absolute bg-[#f72859] blur-[3px] rounded-[50px] size-[5px]" style={{ left: 31, top: 27 }} />
      <div className="absolute bg-[#f72859] blur-[3px] rounded-[50px]" style={{ bottom: '33.33%', left: '25%', right: '64.58%', top: '56.25%' }} />
    </>
  );
}

// ── ANGRY features ────────────────────────────────────────────────────────────

function AngryFeatures({ selected }: { selected: boolean }) {
  const ms = selected ? '#DE6102' : '#232333';
  return (
    <>
      {/* Mouth */}
      <div className="absolute" style={{ height: 7.5, left: 17, top: 26, width: 15 }}>
        <div className="absolute" style={{ top: '34.18%', right: '-5%', bottom: '-10%', left: '-5%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 5.68629">
            <path d={svgPaths.p1e0cd300} stroke={ms} strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* L Brow */}
      <div className="absolute" style={{ height: 3, left: 11, top: 16, width: 8 }}>
        <div className="absolute" style={{ top: '-25.01%', right: '-9.38%', bottom: '-25.01%', left: '-9.38%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.50041 4.50041">
            <path d={svgPaths.p4f23880} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* R Brow */}
      <div className="absolute" style={{ height: 3, left: 28, top: 16, width: 8 }}>
        <div className="absolute" style={{ top: '-25.01%', right: '-9.38%', bottom: '-25.01%', left: '-9.38%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.50041 4.50041">
            <path d={svgPaths.p90ac00} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* L Eye */}
      <div className="absolute" style={{ height: 2.5, left: 14, top: 23, width: 5 }}>
        <div className="absolute" style={{ top: '-30%', right: '-15%', bottom: '19.71%', left: '-15%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 2.75736">
            <path d={svgPaths.p16b64a00} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* R Eye */}
      <div className="absolute" style={{ height: 2.5, left: 29, top: 23, width: 5 }}>
        <div className="absolute" style={{ top: '-30%', right: '-15%', bottom: '19.71%', left: '-15%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 2.75736">
            <path d={svgPaths.p16b64a00} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </>
  );
}

// ── SAD features ──────────────────────────────────────────────────────────────

function SadFeatures({ selected }: { selected: boolean }) {
  const ms = selected ? '#DE6102' : '#232333';
  return (
    <>
      {/* Mouth */}
      <div className="absolute" style={{ height: 7.5, left: 19, top: 26, width: 11 }}>
        <div className="absolute" style={{ top: '52.84%', right: '-6.82%', bottom: '-10%', left: '-6.82%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5001 4.28711">
            <path d={svgPaths.p16522b80} stroke={ms} strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* L Eye */}
      <div className="absolute" style={{ height: 2.5, left: 13, top: 23, width: 7 }}>
        <div className="absolute" style={{ top: '-30%', right: '-10.72%', bottom: '15.78%', left: '-10.72%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.50012 2.85554">
            <path d={svgPaths.p33682cd0} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* R Eye */}
      <div className="absolute" style={{ height: 2.5, left: 29, top: 23, width: 7 }}>
        <div className="absolute" style={{ top: '-30%', right: '-10.72%', bottom: '15.78%', left: '-10.72%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.50012 2.85554">
            <path d={svgPaths.p33682cd0} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </>
  );
}

// ── NEUTRAL features ──────────────────────────────────────────────────────────

function NeutralFeatures({ selected }: { selected: boolean }) {
  const ms = selected ? '#DE6102' : '#232333';
  const dotFill = '#232333';
  return (
    <>
      {/* Mouth (flat line) */}
      <div className="absolute" style={{ height: 0, left: 19, top: 33.5, width: 11 }}>
        <div className="absolute" style={{ top: -0.75, right: '-6.82%', bottom: -0.75, left: '-6.82%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 1.5">
            <path d="M0.75 0.75H6.25H11.75" stroke={ms} strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* R Eye dot */}
      <div className="absolute" style={{ left: 30, top: 22, width: 4, height: 4 }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill={dotFill} r="2" />
        </svg>
      </div>
      {/* L Eye dot */}
      <div className="absolute" style={{ left: 15, top: 22, width: 4, height: 4 }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill={dotFill} r="2" />
        </svg>
      </div>
    </>
  );
}

// ── HAPPY features ────────────────────────────────────────────────────────────

function HappyFeatures({ selected }: { selected: boolean }) {
  const ms = selected ? '#DE6102' : '#232333';
  return (
    <>
      {/* Mouth */}
      <div className="absolute" style={{ height: 6, left: 'calc(50% + 0.5px)', top: 30.5, width: 9, transform: 'translateX(-50%)' }}>
        <div className="absolute" style={{ bottom: '50%', left: '-8.33%', right: '-8.33%', top: '-12.5%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5001 3.75004">
            <path d={svgPaths.p16e8c780} stroke={ms} strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* L Eye */}
      <div className="absolute" style={{ height: 8.5, left: 14, top: 14.5, width: 5 }}>
        <div className="absolute" style={{ top: '69.17%', right: '-15%', bottom: '-8.83%', left: '-15%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.50039 3.37079">
            <path d={svgPaths.p1d153600} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* R Eye */}
      <div className="absolute" style={{ height: 7.5, left: 29, top: 15.5, width: 5 }}>
        <div className="absolute" style={{ top: '65.97%', right: '-15%', bottom: '-10%', left: '-15%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.50041 3.3021">
            <path d={svgPaths.p24819a00} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {selected && <Blush />}
    </>
  );
}

// ── SUPER features ────────────────────────────────────────────────────────────

function SuperFeatures({ selected, starGid }: { selected: boolean; starGid: string }) {
  const mFill = selected ? '#F72859' : '#232333';
  const mStroke = selected ? '#F72859' : '#232333';
  return (
    <>
      {/* Mouth */}
      <div className="absolute" style={{ height: 7.5, left: 'calc(50% + 0.5px)', top: 30.5, width: 16, transform: 'translateX(-50%)' }}>
        <div className="absolute" style={{ top: '-11.33%', right: '-4.69%', bottom: '-10%', left: '-4.69%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 9.09959">
            <path d={svgPaths.p25515630} fill={mFill} stroke={mStroke} strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* L Eye */}
      <div className="absolute" style={{ height: 8.5, left: 12, top: 14.5, width: 7 }}>
        <div className="absolute" style={{ top: '63.6%', right: '-10.72%', bottom: '-8.83%', left: '-10.72%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.50039 3.84412">
            <path d={svgPaths.pc484700} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* R Eye */}
      <div className="absolute" style={{ height: 7.5, left: 29, top: 15.5, width: 7 }}>
        <div className="absolute" style={{ top: '60.28%', right: '-10.72%', bottom: '-10%', left: '-10.72%' }}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.50036 3.7292">
            <path d={svgPaths.p2711fb00} stroke="#232333" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {selected && (
        <>
          <Blush />
          {/* Star */}
          <div className="absolute" style={{ height: 16, left: 38, top: 8, width: 12 }}>
            <div className="absolute" style={{ top: '16.25%', right: '18.16%', bottom: '26.94%', left: '18.16%' }}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.64112 9.08993">
                <path d={svgPaths.p30abff00} fill={`url(#${starGid})`} />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id={starGid} x1="3.82056" x2="3.82056" y1="-0.0998787" y2="8.90012">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#FFFAE8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function MoodEmoji({ className, face = 'Happy', selected, size, stage }: EmojiProps) {
  // backwards-compat: treat stage '3'/'4'/'5'/'6' as selected if `selected` not passed
  const isSelected = selected !== undefined ? selected : (stage !== undefined ? stage !== '1' && stage !== '2' : false);

  const rawId = useId();
  const uid = rawId.replace(/:/g, 'x');
  const fid = `${uid}f`;
  const gid = `${uid}g`;
  const starGid = `${uid}s`;

  const renderFeatures = () => {
    switch (face) {
      case 'Angry':   return <AngryFeatures selected={isSelected} />;
      case 'Sad':     return <SadFeatures selected={isSelected} />;
      case 'Neutral': return <NeutralFeatures selected={isSelected} />;
      case 'Happy':   return <HappyFeatures selected={isSelected} />;
      case 'Super':   return <SuperFeatures selected={isSelected} starGid={starGid} />;
      default:        return null;
    }
  };

  const displaySize = size || 60;
  const scale = displaySize / 48;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: displaySize, height: displaySize, overflow: 'hidden', flexShrink: 0 }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 48, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <FaceCircle fid={fid} gid={gid} selected={isSelected} />
        {renderFeatures()}
      </div>
    </div>
  );
}