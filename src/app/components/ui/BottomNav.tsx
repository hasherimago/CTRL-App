import svgPaths from '../../../imports/svg-9phyw3y14s';
import HomeActiveIcon from '../../../imports/Home_active.svg';
import LibraryActiveIcon from '../../../imports/Library_active.svg';
import JournalActiveIcon from '../../../imports/Journal-active.svg';
import CheckerActiveIcon from '../../../imports/Checker-active.svg';

/**
 * BottomNav is 100px tall.
 * All pages using this component MUST set their scroll container to:
 *   bottom: LAYOUT.NAV_HEIGHT (100px)
 * And their inner content wrapper to:
 *   paddingBottom: LAYOUT.CONTENT_BOTTOM_PADDING (24px)
 *
 * Import from: src/app/constants/layout.ts
 */

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface BottomNavProps {
  activeTab?: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const tabs: { id: NavTab; label: string }[] = [
  { id: 'Home',    label: 'Home'    },
  { id: 'Checker', label: 'Checker' },
  { id: 'Scan',    label: 'Scan'    },
  { id: 'Library', label: 'Library' },
  { id: 'Journal', label: 'Journal' },
];

function NavIcon({ tab, isActive }: { tab: NavTab; isActive: boolean }) {
  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    width:  '20px',
    height: '20px',
    left:   '2px',
    top:    '2px',
  };

  if (tab === 'Home') {
    if (isActive) {
      return <img src={HomeActiveIcon} style={{ ...iconStyle, width: '24px', height: '24px', left: 0, top: 0 }} alt="" />;
    }
    return (
      <svg style={iconStyle} viewBox="0 0 20 20.1289" fill="none">
        <path d={svgPaths.p9bb4e00} fill="#F1F1F1" />
      </svg>
    );
  }
  if (tab === 'Checker') {
    if (isActive) {
      return (
        <img
          src={CheckerActiveIcon}
          style={{ ...iconStyle, width: '24px', height: '24px', left: 0, top: 0 }}
          alt=""
        />
      );
    }

    return (
      <svg style={iconStyle} viewBox="0 0 20.0541 20.1196" fill="none">
        <path d={svgPaths.p2485af00} fill="#F1F1F1" />
      </svg>
    );
  }
  if (tab === 'Scan') {
    return (
      <svg style={iconStyle} viewBox="0 0 20.1196 20.1196" fill="none">
        <path d={svgPaths.p167202c0} fill="#F1F1F1" />
        <path d={svgPaths.p3fb9f80}  fill="#F1F1F1" />
        <path d={svgPaths.p53c8580}  fill="#F1F1F1" />
        <path clipRule="evenodd" d={svgPaths.p2fed8900} fill="#F1F1F1" fillRule="evenodd" />
        <path d={svgPaths.p37fab400} fill="#F1F1F1" />
        <path d={svgPaths.p1e62a400} fill="#F1F1F1" />
      </svg>
    );
  }
  if (tab === 'Library') {
    if (isActive) {
      return <img src={LibraryActiveIcon} style={{ ...iconStyle, width: '24px', height: '24px', left: 0, top: 0 }} alt="" />;
    }
    return (
      <svg style={iconStyle} viewBox="0 0 20.1196 21.1252" fill="none">
        <path d={svgPaths.p1a1efe00} fill="#F1F1F1" />
        <path d={svgPaths.p376b9200} fill="#F1F1F1" />
      </svg>
    );
  }
  if (tab === 'Journal') {
    if (isActive) {
      return (
        <img
          src={JournalActiveIcon}
          style={{ ...iconStyle, width: '24px', height: '24px', left: 0, top: 0 }}
          alt=""
        />
      );
    }

    return (
      <svg style={iconStyle} viewBox="0 0 20.1196 20.1196" fill="none">
        <path d={svgPaths.p21779680} fill="#F1F1F1" />
      </svg>
    );
  }
}


export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: 'blur(10.06px)',
        WebkitBackdropFilter: 'blur(10.06px)',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '16px 16px 0 0',
          paddingTop: '14px',
          paddingLeft: '8px',
          paddingRight: '8px',
          height: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                width: '70px',
                height: '54px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                opacity: isActive ? 1 : 0.5,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {/* Icon wrapper */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <NavIcon tab={id} isActive={isActive} />
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  letterSpacing: '0.72px',
                  color: '#F1F1F1',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}