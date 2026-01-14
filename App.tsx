import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import McpLog from './components/McpLog';
import MarketAnalysis from './components/MarketAnalysis';
import FundSelection from './components/FundSelection';
import Reports from './components/Reports';
import McpManager from './components/McpManager';
import EtfTradingMonitor from './components/EtfTradingMonitor';
import StockTradingMonitor from './components/StockTradingMonitor';
import { MOCK_NEWS, DEFAULT_MCP_SERVERS } from './constants';
import { TrendingUp, AlertCircle, RefreshCw, ArrowRight, X, Newspaper, Wallet, FileText, Settings, ShieldAlert } from 'lucide-react';
import { McpServerConfig } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mcpServers, setMcpServers] = useState<McpServerConfig[]>(DEFAULT_MCP_SERVERS);
  const [activeMcpId, setActiveMcpId] = useState<string>('1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const titleMap: Record<string, string> = {
    'dashboard': '指挥中心',
    'market': '市场分析',
    'stock': 'A股实战',
    'etf': 'ETF 实战',
    'news': '情报与政策',
    'funds': '基金筛选',
    'reports': '报告生成',
    'risk': '风险控制',
    'settings': 'MCP 配置'
  };

  const moreMenuItems = [
    { id: 'news', label: '情报与政策', icon: Newspaper },
    { id: 'funds', label: '基金筛选', icon: Wallet },
    { id: 'reports', label: '报告生成', icon: FileText },
    { id: 'risk', label: '风险控制', icon: ShieldAlert },
    { id: 'settings', label: 'MCP 配置', icon: Settings },
  ];

  // Simple Tab Router
  const renderContent = () => {
    switch(activeTab) {
      case 'market':
        return <MarketAnalysis />;
      case 'stock':
        return <StockTradingMonitor />;
      case 'etf':
        return <EtfTradingMonitor />;
      case 'funds':
        return <FundSelection />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <McpManager servers={mcpServers} setServers={setMcpServers} activeId={activeMcpId} setActiveId={setActiveMcpId} />;
      case 'risk':
      case 'news':
         // Placeholder for tabs without specific complex components in this demo
         return <Dashboard setActiveTab={setActiveTab} />; 
      case 'dashboard':
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const activeServer = mcpServers.find(s => s.id === activeMcpId);

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-gold-500/30 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Header */}
          <header className="h-14 md:h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 backdrop-blur-md shrink-0">
            <h2 className="font-semibold text-slate-100 text-sm md:text-base truncate">{titleMap[activeTab] || activeTab}</h2>
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-[10px] md:text-xs font-mono text-slate-500">{new Date().toLocaleDateString('zh-CN')}</span>
              <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <RefreshCw size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative pb-20 md:pb-0 scroll-smooth">
            {renderContent()}
          </main>

          {/* MCP Log Terminal - Hidden on mobile by default to save space */}
          <div className="hidden md:block shrink-0">
             <McpLog activeServerName={activeServer?.name} />
          </div>

          {/* Mobile Navigation */}
          <MobileNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenMenu={() => setIsMobileMenuOpen(true)} 
          />

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[60] md:hidden">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl p-6 border-t border-slate-700 animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">更多功能</h3>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {moreMenuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl ${activeTab === item.id ? 'bg-slate-800 text-gold-400' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`}
                                >
                                    <div className={`p-3 rounded-full ${activeTab === item.id ? 'bg-gold-500/10' : 'bg-slate-800'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-xs">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-600">
                        AlphaPrime Mobile v1.0
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </HashRouter>
  );
};

// Dashboard Sub-component
const Dashboard: React.FC<{setActiveTab: (tab: string) => void}> = ({ setActiveTab }) => {
  const impactMap: Record<string, string> = { 'High': '高', 'Medium': '中', 'Low': '低' };

  return (
    <div className="p-4 md:p-6 h-full">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
         <div className="col-span-1 md:col-span-3">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">早上好，顾问。</h1>
                    <p className="text-slate-400 max-w-xl text-sm md:text-base">市场情绪为 <span className="text-green-400 font-bold">温和上涨</span>。新能源板块政策驱动正在激活。建议权益仓位：<span className="text-gold-400 font-bold">70%</span>。</p>
                    <div className="mt-6 flex gap-3">
                        <button onClick={() => setActiveTab('market')} className="bg-gold-600 hover:bg-gold-500 text-slate-900 font-bold px-4 py-2 text-sm md:text-base rounded-lg transition-colors">
                            分析指数
                        </button>
                        <button onClick={() => setActiveTab('funds')} className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 text-sm md:text-base rounded-lg transition-colors">
                            基金筛选
                        </button>
                    </div>
                </div>
                {/* Decorative BG */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-gold-500/10 to-transparent pointer-events-none"></div>
            </div>
         </div>
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20"></span>
                <TrendingUp className="text-green-500" size={32} />
             </div>
             <div className="text-3xl font-bold text-white">15.4%</div>
             <p className="text-xs text-slate-500 mt-1">3个月目标进度</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* News Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-200">关键情报</h3>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">实时</span>
             </div>
             <div className="space-y-4">
                {MOCK_NEWS.map(news => (
                    <div key={news.id} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0 group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-gold-500 font-mono">{news.time}</span>
                            <span className={`text-[10px] px-1.5 rounded border ${news.impact === 'High' ? 'border-red-500/50 text-red-400' : 'border-slate-600 text-slate-500'}`}>
                                {impactMap[news.impact] || news.impact}
                            </span>
                        </div>
                        <h4 className="text-sm text-slate-300 group-hover:text-gold-400 transition-colors line-clamp-2">{news.title}</h4>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {news.tags.map(tag => (
                                <span key={tag} className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Quick Stats / Risk */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
                <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-400" />
                    组合风险快照
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">最大回撤控制</span>
                            <span className="text-green-400">-4.2% / -12%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[35%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">板块集中度 (新能源)</span>
                            <span className="text-yellow-400">38% / 40%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[95%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">现金仓位</span>
                            <span className="text-slate-200">25%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[25%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 md:p-6 flex justify-between items-center">
                 <div>
                    <h4 className="text-sm text-slate-400">今日重点</h4>
                    <p className="font-bold text-white text-lg">检查技术面突破</p>
                 </div>
                 <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition">
                    <ArrowRight size={20} className="text-slate-300"/>
                 </button>
            </div>
          </div>
       </div>
    </div>
  );
}

export default App;
