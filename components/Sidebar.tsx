import React from 'react';
import { LayoutDashboard, LineChart, Newspaper, Wallet, FileText, Settings, ShieldAlert, Activity, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '指挥中心', icon: LayoutDashboard },
    { id: 'market', label: '市场分析', icon: LineChart },
    { id: 'stock', label: 'A股实战', icon: Zap },
    { id: 'etf', label: 'ETF 实战', icon: Activity },
    { id: 'news', label: '情报与政策', icon: Newspaper },
    { id: 'funds', label: '基金筛选', icon: Wallet },
    { id: 'reports', label: '报告生成', icon: FileText },
    { id: 'risk', label: '风险控制', icon: ShieldAlert },
    { id: 'settings', label: 'MCP 配置', icon: Settings },
  ];

  return (
    <div className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="w-3 h-3 bg-gold-500 rounded-full animate-pulse"></span>
          ALPHA<span className="text-gold-500">PRIME</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">投资顾问终端</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-gold-400 border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center font-bold text-slate-900 text-xs">
            JD
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">高级顾问</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              在线
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
