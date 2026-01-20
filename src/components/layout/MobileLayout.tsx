import React from 'react';
import BottomNav from './BottomNav';
import { useAuth } from '../../hooks/use-auth';

interface MobileLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showNav = true }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <main className={showNav && user ? 'pb-20' : ''}>
        {children}
      </main>
      {showNav && user && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
