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
    <div className="relative min-h-screen w-full flex justify-center items-center bg-[#fafafa] overflow-hidden">
      {/* Background blobs only visible on md+ */}
      <div
        className="hidden md:block absolute top-[-5%] right-[-5%] w-[100%] h-[100%] rounded-full blur-[120px] opacity-40 animate-pulse"
        style={{ backgroundColor: "#FFC988" }}
      />
      <div
        className="hidden md:block absolute bottom-[-5%] left-[-5%] w-[100%] h-[100%] rounded-full blur-[120px] opacity-40 animate-pulse"
        style={{ backgroundColor: "#E288F9" }}
      />

      {/* Phone wrapper */}
      <div className="
        relative w-full 
        md:max-w-[400px] 
        bg-background 
        md:shadow-lg md:rounded-[2.5rem] 
        z-10 flex flex-col
      ">
        <main className={showNav && user ? 'pb-20' : ''}>
          {children}
        </main>
        {showNav && user && <BottomNav />}
      </div>
    </div>
  );
};


export default MobileLayout;
