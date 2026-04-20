import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LAYOUT } from '../../constants/layout';
import svgPaths from '../../../imports/svg-srcobnd1q5';
import svgPathsNav from '../../../imports/svg-9phyw3y14s';
import proBg from 'figma:asset/b0891f744249fc9bb461ad6a1ac607c6e8e2c669.png';
import { db } from '../../../db';
import { AuthBottomSheet } from './AuthBottomSheet';

type SubPage = 'editProfile' | 'subscription' | 'language' | 'helpSupport' | 'privacyPolicy' | null;

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function ChevronRight({ color = '#F1F1F1' }: { color?: string }) {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path d="M8 5L13 10L8 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrow({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{ background: 'none', border: 'none', cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
      aria-label="Go back"
    >
      <svg width="22" height="21" viewBox="0 0 22 20.5677" fill="none">
        <path d={svgPathsNav.pb6bc280} fill="#F1F1F1" />
      </svg>
    </button>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      style={{ background: 'none', border: 'none', cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
      aria-label="Close profile"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 2L16 16M16 2L2 16" stroke="#F1F1F1" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

// NOTE: Uses position:absolute (not fixed) — ProfilePage has transform which breaks fixed positioning
function PageHeader({ title, left, right }: { title: string; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '56px', zIndex: 20 }}>
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
        {left}
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F1F1F1', letterSpacing: '0.36px', lineHeight: 1 }}>{title}</span>
        {right}
      </div>
    </div>
  );
}

function SettingsRow({ label, right, color = '#F1F1F1', onClick }: { label: string; right: React.ReactNode; color?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '20px', cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color, letterSpacing: '0.32px', lineHeight: 1.3 }}>{label}</span>
      {right}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} aria-pressed={on} style={{ width: '34px', height: '22px', borderRadius: '4594px', background: on ? '#8C5CFE' : '#030303', border: '1px solid #333', position: 'relative', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'background 0.2s ease' }}>
      <div style={{ position: 'absolute', top: '50%', transform: `translateY(-50%) translateX(${on ? '14px' : '2px'})`, width: '18px', height: '18px', borderRadius: '50%', background: '#F1F1F1', transition: 'transform 0.2s ease' }} />
    </button>
  );
}

function ProfileAvatar({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, position: 'relative', flexShrink: 0 }}>
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }} fill="none" viewBox="0 0 28 28">
        <path d={svgPaths.p279b18f0} fill="#F1F1F1" />
        <path clipRule="evenodd" d={svgPaths.p1b2ab480} fill="#F1F1F1" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function AuthAvatar({ email, size = 36, photoUrl }: { email?: string; size?: number; photoUrl?: string }) {
  if (photoUrl) {
    return (
      <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  const letter = (email ?? '?')[0].toUpperCase();
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: 'linear-gradient(135deg, #8C5CFE 0%, #6B3FD4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: `${Math.round(size * 0.44)}px`, color: '#fff', lineHeight: 1 }}>
        {letter}
      </span>
    </div>
  );
}

function CardSpinner() {
  return (
    <>
      <style>{`@keyframes profile-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: '22px', height: '22px',
        border: '2px solid rgba(241,241,241,0.15)',
        borderTopColor: '#8C5CFE',
        borderRadius: '50%',
        animation: 'profile-spin 0.75s linear infinite',
      }} />
    </>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: '#2D2D2D', margin: '0 -16px' }} />;
}

// ─── Sub Page wrapper ─────────────────────────────────────────────────────────
// Slides in from the right OVER the ProfilePage. Uses position:absolute (not fixed)
// so it is unaffected by the ProfilePage's CSS transform containing block.

function SubPageSlide({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 30,
      background: '#0D0D0D',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: visible ? 'auto' : 'none',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

// ─── Sub Page 1 — Edit Profile ────────────────────────────────────────────────

function EditProfilePage({ onBack, onClose, userEmail, savedName, savedPhotoUrl, onSaveName, onSavePhoto }: {
  onBack: () => void;
  onClose: () => void;
  userEmail?: string;
  savedName: string;
  savedPhotoUrl?: string;
  onSaveName: (name: string) => void;
  onSavePhoto: (photoUrl: string) => void;
}) {
  const [name, setName] = useState(savedName);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | undefined>(savedPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync name when the $users query resolves (may arrive after mount)
  useEffect(() => { setName(savedName); }, [savedName]);
  // Sync photo when DB resolves
  useEffect(() => { setLocalPhoto(prev => prev ?? savedPhotoUrl); }, [savedPhotoUrl]);
  // Sync email whenever auth resolves
  useEffect(() => { if (userEmail) setEmail(userEmail); }, [userEmail]);

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const MAX = 400;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setLocalPhoto(canvas.toDataURL('image/jpeg', 0.82));
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
    // Reset so the same file can be re-selected
    e.target.value = '';
  }, []);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0D0D0D', border: '1px solid #2D2D2D', borderRadius: '10px',
    padding: '12px 14px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', color: '#F1F1F1',
    letterSpacing: '0.32px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#888', letterSpacing: '0.26px', marginBottom: '6px',
  };

  return (
    <>
      <PageHeader
        title="Edit Profile"
        left={<BackArrow onBack={onBack} />}
        right={<CloseButton onClose={onClose} />}
      />
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoSelect}
      />
      <div style={{ position: 'absolute', top: 0, bottom: `${LAYOUT.NAV_HEIGHT}px`, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '70px 16px 32px' }}>
          {/* Avatar — tappable to change photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', position: 'relative', width: '80px', height: '80px' }}
              aria-label="Change profile photo"
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#1E1E1E', border: '2px solid #2D2D2D', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {localPhoto ? (
                  <img src={localPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ProfileAvatar size={48} />
                )}
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderRadius: '50%', background: '#8C5CFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
            <span
              onClick={() => fileInputRef.current?.click()}
              style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#8C5CFE', letterSpacing: '0.26px', cursor: 'pointer' }}
            >
              Change Photo
            </span>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={labelStyle}>Full Name</p>
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <p style={labelStyle}>Email</p>
              <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} type="email" />
            </div>
            <div>
              <p style={labelStyle}>Phone</p>
              <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} type="tel" />
            </div>
          </div>

          <button
            onClick={() => {
              onSaveName(name.trim());
              if (localPhoto !== savedPhotoUrl) onSavePhoto(localPhoto ?? '');
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            style={{ marginTop: '32px', width: '100%', height: '52px', background: saved ? '#AAFF00' : '#8C5CFE', border: 'none', borderRadius: '14px', cursor: 'pointer', fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: saved ? '#0D0D0D' : '#F1F1F1', letterSpacing: '0.32px', transition: 'background 0.3s ease' }}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Sub Page 2 — Kit Subscription ───────────────────────────────────────────

function SubscriptionPage({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState<'monthly' | 'annual'>('monthly');

  const features = [
    { icon: '✔️', text: 'Monthly harm-reduction testing kit delivery' },
    { icon: '✔️', text: 'Priority substance alerts & batch warnings' },
    { icon: '✔️', text: 'Advanced drug interaction reports' },
    { icon: '✔️', text: 'Fentanyl & adulterant test strips included' },
  ];

  return (
    <>
      <PageHeader
        title="Kit Subscription"
        left={<BackArrow onBack={onBack} />}
        right={<CloseButton onClose={onClose} />}
      />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '70px 16px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Hero */}
          <div style={{ backgroundImage: `url(${proBg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', padding: '10px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#FFFFFF' }}>CTRL</span>
              <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid #fff', borderRadius: '99px', padding: '0px 8px', display: 'flex', paddingTop: '4px', paddingBottom: '4px' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '11px', color: '#FFFFFF' }}>PRO</span>
              </div>
            </div>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: 0 }}>
              Get monthly testing kits delivered to your door.
            </p>
          </div>

          {/* Plan selector */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['monthly', 'annual'] as const).map(plan => (
              <button
                key={plan}
                onClick={() => setSelected(plan)}
                style={{ flex: 1, background: selected === plan ? '#8C5CFE' : '#171717', border: `1.5px solid ${selected === plan ? '#8C5CFE' : '#2D2D2D'}`, borderRadius: '14px', paddingTop: '40px', paddingBottom: '40px', paddingLeft: '12px', paddingRight: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', transition: 'all 0.2s ease' }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: '#F1F1F1', textTransform: 'capitalize' }}>{plan}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '22px', fontWeight: 700, color: '#F1F1F1' }}>{plan === 'monthly' ? '€19' : '€159'}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: selected === plan ? 'rgba(255,255,255,0.75)' : '#888' }}>{plan === 'monthly' ? 'per month' : 'per year — save 30%'}</span>
                {plan === 'annual' && (
                  <div style={{ background: '#AAFF00', borderRadius: '99px', padding: '2px 8px', marginTop: '4px', display: 'flex' }}>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '10px', color: '#0D0D0D' }}>BEST VALUE</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Features */}
          <div style={{ background: '#171717', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#F1F1F1', letterSpacing: '0.3px' }}>What's included</span>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: 1.4 }}>{f.icon}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#C8C8C8', lineHeight: 1.5, letterSpacing: '0.28px' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <button style={{ width: '100%', height: '52px', background: '#8C5CFE', border: 'none', borderRadius: '14px', cursor: 'pointer', fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px' }}>
            Subscribe — {selected === 'monthly' ? '€19/mo' : '€159/year'}
          </button>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#555', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
            Cancel anytime. Auto-renews. By subscribing you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Sub Page 3 — Language ────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'nl', label: 'Dutch', native: 'Nederlands' },
  { code: 'pl', label: 'Polish', native: 'Polski' },
];

function LanguagePage({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState('en');

  return (
    <>
      <PageHeader
        title="Language"
        left={<BackArrow onBack={onBack} />}
        right={<CloseButton onClose={onClose} />}
      />
      <div style={{ position: 'absolute', top: 0, bottom: `${LAYOUT.NAV_HEIGHT}px`, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '70px 8px 32px' }}>
          <div style={{ background: '#171717', borderRadius: '16px', overflow: 'hidden' }}>
            {LANGUAGES.map((lang, i) => (
              <div key={lang.code}>
                <button
                  onClick={() => setSelected(lang.code)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', color: selected === lang.code ? '#8C5CFE' : '#F1F1F1', fontWeight: selected === lang.code ? 700 : 400, letterSpacing: '0.32px' }}>{lang.label}</span>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#777', letterSpacing: '0.26px' }}>{lang.native}</span>
                  </div>
                  {selected === lang.code && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8 14L16 6" stroke="#8C5CFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                {i < LANGUAGES.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub Page 4 — Help & Support ─────────────────────────────────────────────

const FAQS = [
  { q: 'How do I use the drug interaction checker?', a: 'Go to the Checker tab, select two or more substances, and tap "Check Interaction". Results are colour-coded — green means low risk, amber means caution, red means dangerous.' },
  { q: 'Are testing kits accurate?', a: 'Our kits use reagent and fentanyl strip technology. They detect most common adulterants but no test is 100% reliable. Always test in multiple spots and treat any uncertain result as potentially dangerous.' },
  { q: 'What does harm-reduction mean?', a: 'Harm reduction is a set of practical strategies aimed at reducing negative consequences associated with drug use. It meets people where they are without judgement.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Profile → Kit Subscription → Manage Plan. You can cancel anytime before the next billing cycle with no additional charges.' },
  { q: 'Is my data private?', a: 'All journal entries are stored locally on your device by default. We never sell your data. See our Privacy Policy for full details.' },
  { q: 'How do I report an inaccuracy?', a: 'Tap the share/flag icon on any drug page, or email us at safety@ctrl-app.io. We review reports within 24 hours.' },
];

function HelpSupportPage({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <PageHeader
        title="Help & Support"
        left={<BackArrow onBack={onBack} />}
        right={<CloseButton onClose={onClose} />}
      />
      <div style={{ position: 'absolute', top: 0, bottom: `${LAYOUT.NAV_HEIGHT}px`, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '70px 8px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contact cards */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, background: '#171717', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(140,92,254,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 4a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="#8C5CFE" strokeWidth="1.5" />
                  <path d="M2 4l7 6 7-6" stroke="#8C5CFE" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '14px', color: '#F1F1F1' }}>Email Us</span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#888', lineHeight: 1.4 }}>safety@ctrl-app.io</span>
            </div>
            <div style={{ flex: 1, background: '#171717', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(170,255,0,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3h12a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V4a1 1 0 011-1z" stroke="#AAFF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '14px', color: '#F1F1F1' }}>Live Chat</span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#888', lineHeight: 1.4 }}>Mon–Fri, 9am–6pm</span>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ background: '#171717', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 16px 12px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#F1F1F1', letterSpacing: '0.3px' }}>Frequently Asked Questions</span>
            </div>
            <Divider />
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', textAlign: 'left' }}
                >
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#F1F1F1', lineHeight: 1.5, letterSpacing: '0.28px', flex: 1 }}>{faq.q}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px', transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openIndex === i && (
                  <div style={{ padding: '0 16px 16px' }}>
                    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#888', lineHeight: 1.6, margin: 0, letterSpacing: '0.28px' }}>{faq.a}</p>
                  </div>
                )}
                {i < FAQS.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub Page 5 — Privacy Policy ─────────────────────────────────────────────

const PRIVACY_SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect only the information you voluntarily provide, including your name and email when you create an account. App usage data (anonymised) may be collected to improve the service. We do not collect any information about what substances you check or log.' },
  { title: '2. Journal & Usage Data', body: 'All journal entries are stored locally on your device by default and are never transmitted to our servers. If you enable cloud backup, entries are encrypted end-to-end before storage.' },
  { title: '3. How We Use Your Data', body: 'Account data is used solely to manage your subscription and provide customer support. We never sell, rent, or share your personal data with third parties for marketing purposes.' },
  { title: '4. Cookies & Analytics', body: 'We use privacy-respecting analytics (no third-party trackers) to understand aggregate usage patterns. You can opt out at any time in Settings → Privacy.' },
  { title: '5. Data Security', body: 'All data in transit is encrypted using TLS 1.3. Passwords are hashed with bcrypt. We follow industry-standard security practices and conduct regular audits.' },
  { title: '6. Your Rights', body: 'Under GDPR and applicable privacy laws, you have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at privacy@ctrl-app.io.' },
  { title: '7. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via in-app notification or email. Continued use of the app after changes constitutes acceptance.' },
  { title: '8. Contact', body: 'For any privacy-related questions, contact our Data Protection Officer at privacy@ctrl-app.io or write to CTRL, 42 Shoreditch High Street, London E1 6JE, UK.' },
];

function PrivacyPolicyPage({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        left={<BackArrow onBack={onBack} />}
        right={<CloseButton onClose={onClose} />}
      />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '70px 16px 32px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#666', lineHeight: 1.5, margin: '0 0 24px 0' }}>
            Last updated: 1 March 2026
          </p>
          <div style={{ background: '#171717', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {PRIVACY_SECTIONS.map((section, i) => (
              <div key={i}>
                <div style={{ padding: '20px 16px' }}>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#F1F1F1', margin: '0 0 8px 0', letterSpacing: '0.3px' }}>{section.title}</p>
                  <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#888', lineHeight: 1.65, margin: 0, letterSpacing: '0.28px' }}>{section.body}</p>
                </div>
                {i < PRIVACY_SECTIONS.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main ProfilePage ─────────────────────────────────────────────────────────

export function ProfilePage({ isOpen, onClose, onLogout }: ProfilePageProps) {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [justSignedIn, setJustSignedIn] = useState(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isLoading: authLoading, user } = db.useAuth();

  // Query $users to get the stored name field reactively
  const { data: usersData } = db.useQuery(
    user ? { $users: { $: { where: { id: user.id } } } } : null
  );
  const profile = usersData?.$users?.[0] as { name?: string; email?: string; photoUrl?: string } | undefined;
  const displayName = profile?.name?.trim()
    ? profile.name.trim()
    : user?.email?.split('@')[0] ?? '';
  const profilePhotoUrl = profile?.photoUrl ?? undefined;

  const handleSaveName = (name: string) => {
    if (user?.id) {
      db.transact((db.tx.$users[user.id] as any).update({ name }));
    }
  };

  const handleSavePhoto = (photoUrl: string) => {
    if (user?.id) {
      db.transact((db.tx.$users[user.id] as any).update({ photoUrl }));
    }
  };

  // Close the auth sheet as soon as we have a user (sign-in succeeded)
  useEffect(() => {
    if (user) setShowAuth(false);
  }, [user]);

  // After sign-in: link any unowned records to the new user
  useEffect(() => {
    if (!user || !justSignedIn) return;
    setJustSignedIn(false);
    (async () => {
      try {
        const { data } = await db.queryOnce({ tripLogs: {}, checklistItems: {}, savedDrugs: {} });
        const txs = [
          ...(data?.tripLogs ?? []).map((r: { id: string }) => db.tx.tripLogs[r.id].link({ owner: user.id })),
          ...(data?.checklistItems ?? []).map((r: { id: string }) => db.tx.checklistItems[r.id].link({ owner: user.id })),
          ...(data?.savedDrugs ?? []).map((r: { id: string }) => db.tx.savedDrugs[r.id].link({ owner: user.id })),
        ];
        if (txs.length > 0) await db.transact(txs);
      } catch {
        // migration is best-effort
      }
    })();
  }, [user, justSignedIn]);

  const handleAuthSuccess = () => {
    setJustSignedIn(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    if (logoutConfirm) {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setLogoutConfirm(false);
      db.auth.signOut();
      onClose();
      onLogout?.();
    } else {
      setLogoutConfirm(true);
      logoutTimerRef.current = setTimeout(() => setLogoutConfirm(false), 3000);
    }
  };

  const openSub = (page: SubPage) => setSubPage(page);
  const closeSub = () => setSubPage(null);

  // Close everything: dismiss subpage first (instant), then slide out the overlay
  const closeAll = () => {
    setSubPage(null);
    onClose();
  };

  return (
    // ProfilePage: position:fixed covers viewport. CSS transform creates a new containing block,
    // so ALL children use position:absolute to avoid the fixed-inside-transform bug.
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: '#0D0D0D',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── MAIN PROFILE HEADER — back arrow closes overlay, X also closes overlay ── */}
      <PageHeader
        title="Profile"
        left={<BackArrow onBack={onClose} />}
        right={<CloseButton onClose={onClose} />}
      />

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ position: 'absolute', top: 0, bottom: `${LAYOUT.NAV_HEIGHT}px`, left: 0, right: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: `70px 8px ${LAYOUT.CONTENT_BOTTOM_PADDING}px`, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* User card — three states: loading / logged-in / logged-out */}
          {authLoading ? (
            <div style={{ background: '#171717', borderRadius: '12px', padding: '16px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <CardSpinner />
            </div>
          ) : user ? (
            <button
              onClick={() => openSub('editProfile')}
              style={{ background: '#171717', borderRadius: '12px', padding: '16px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AuthAvatar email={user.email} size={36} photoUrl={profilePhotoUrl} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3 }}>
                    {displayName || 'Account'}
                  </span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', color: '#888', letterSpacing: '0.26px', lineHeight: 1.3 }}>
                    {user.email}
                  </span>
                </div>
              </div>
              <ChevronRight />
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{ background: '#171717', borderRadius: '16px', padding: '16px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', border: '1px solid #2A2A2A', cursor: 'pointer', width: '100%', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#242424', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ProfileAvatar size={20} />
                </div>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3 }}>
                  Sign In / Create Account
                </span>
              </div>
              <ChevronRight />
            </button>
          )}

          {/* PRO banner */}
          <button
            onClick={() => openSub('subscription')}
            style={{ backgroundImage: `url(${proBg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', height: '45px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FFFFFF', letterSpacing: '0.32px', lineHeight: 1.3 }}>
              Buy a monthly subscription to our Kits
            </span>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #FFFFFF', borderRadius: '99px', padding: '1px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '8px' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '11px', color: '#FFFFFF', letterSpacing: '0.22px', lineHeight: 1.4, whiteSpace: 'nowrap' }}>PRO</span>
            </div>
          </button>

          {/* Settings card */}
          <div style={{ background: '#171717', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SettingsRow label="Notifications" right={<Toggle on={notificationsOn} onChange={() => setNotificationsOn(v => !v)} />} />
            <Divider />
            <SettingsRow label="Vibrate" right={<Toggle on={vibrateOn} onChange={() => setVibrateOn(v => !v)} />} />
            <Divider />
            <SettingsRow
              label="Language"
              onClick={() => openSub('language')}
              right={<span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#F1F1F1', letterSpacing: '0.32px', lineHeight: 1.3 }}>English &rsaquo;</span>}
            />
          </div>

          {/* Support card */}
          <div style={{ background: '#171717', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SettingsRow label="Help & Support" onClick={() => openSub('helpSupport')} right={<ChevronRight />} />
            <Divider />
            <SettingsRow label="Privacy Policy" onClick={() => openSub('privacyPolicy')} right={<ChevronRight />} />
            <Divider />
            <SettingsRow label="Rate App" right={<ChevronRight />} />
          </div>

          {/* Logout card — only shown when signed in, double-tap to confirm */}
          {user && (
            <div style={{ background: '#171717', borderRadius: '12px', padding: '16px' }}>
              <SettingsRow
                label={logoutConfirm ? 'Tap again to confirm' : 'Logout'}
                color={logoutConfirm ? '#FF5545' : '#FF9999'}
                onClick={handleLogout}
                right={<ChevronRight color={logoutConfirm ? '#FF5545' : '#FF9999'} />}
              />
            </div>
          )}

        </div>
      </div>

      {/* ── SUBPAGES — slide over the profile using position:absolute ── */}
      <SubPageSlide visible={subPage === 'editProfile'}>
        <EditProfilePage onBack={closeSub} onClose={closeAll} userEmail={user?.email} savedName={displayName} savedPhotoUrl={profilePhotoUrl} onSaveName={handleSaveName} onSavePhoto={handleSavePhoto} />
      </SubPageSlide>

      <SubPageSlide visible={subPage === 'subscription'}>
        <SubscriptionPage onBack={closeSub} onClose={closeAll} />
      </SubPageSlide>

      <SubPageSlide visible={subPage === 'language'}>
        <LanguagePage onBack={closeSub} onClose={closeAll} />
      </SubPageSlide>

      <SubPageSlide visible={subPage === 'helpSupport'}>
        <HelpSupportPage onBack={closeSub} onClose={closeAll} />
      </SubPageSlide>

      <SubPageSlide visible={subPage === 'privacyPolicy'}>
        <PrivacyPolicyPage onBack={closeSub} onClose={closeAll} />
      </SubPageSlide>

      {/* Auth bottom sheet — portalled into document.body to escape ProfilePage's
          CSS transform, which would otherwise break position:fixed descendants */}
      {createPortal(
        <AuthBottomSheet
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />,
        document.body
      )}

    </div>
  );
}