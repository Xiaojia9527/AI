import React from 'react';
import { LayoutDashboard, LineChart, Zap, Activity, Menu } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMenu: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onOpenMenu }) => {
  const navItems = [
    { id: 'dashboard', label: '中心', icon: LayoutDashboard },
    { id: 'market', label: '市场', icon: LineChart },
    { id: 'stock', label: 'Alpha', icon: Zap },
    { id: 'etf', label: 'ETF', icon: Activity },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-between px-6 py-3 z-50 backdrop-blur-md bg-opacity-90 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-gold-400 transform scale-105' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
      <button
        onClick={onOpenMenu}
        className={`flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-all`}
      >
        <Menu size={24} />
        <span className="text-[10px] font-medium">更多</span>
      </button>
    </div>
  );
};

export default MobileNav;
