import scanVideo from '../../../assets/drug scanner video.mp4';
import { BottomNav } from '../ui/BottomNav';

type NavTab = 'Home' | 'Checker' | 'Scan' | 'Library' | 'Journal';

interface ScanPageProps {
  onTabChange: (tab: NavTab) => void;
}

export function ScanPage({ onTabChange }: ScanPageProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D0D0D', overflow: 'hidden' }}>
      <video
        src={scanVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <BottomNav activeTab="Scan" onTabChange={onTabChange} />
    </div>
  );
}
