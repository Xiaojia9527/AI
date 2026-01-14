import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, ArrowRight, DollarSign, Loader2, Lock, Activity, TrendingUp } from 'lucide-react';
import { MOCK_FUNDS } from '../constants';
import { Fund } from '../types';

const recommendationMap: Record<string, string> = {
  'Buy': '买入',
  'Hold': '持有',
  'Sell': '卖出',
  'Avoid': '观望'
};

const recommendationColorMap: Record<string, string> = {
  'Buy': 'bg-green-600 text-white border-green-500',
  'Hold': 'bg-yellow-600 text-white border-yellow-500',
  'Sell': 'bg-red-600 text-white border-red-500',
  'Avoid': 'bg-slate-700 text-slate-300 border-slate-600'
};

const FundSelection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setSelectedFund(null);

    // Simulate Network Request Analysis
    setTimeout(() => {
        let fund = MOCK_FUNDS.find(f => f.code === searchTerm || f.name.includes(searchTerm));

        // Fallback: If code looks like a fund code (6 digits) but not in mock list, generate a dynamic mock for demo purposes
        if (!fund && /^\d{6}$/.test(searchTerm)) {
            const randomScore = parseFloat((Math.random() * 10).toFixed(1));
            const randomChange = parseFloat((Math.random() * 4 - 2).toFixed(2));
            const canAllot = Math.random() > 0.3; // 70% chance tradable
            
            // Logic for recommendation
            let rec: 'Buy' | 'Hold' | 'Sell' | 'Avoid' = 'Hold';
            if (!canAllot) rec = 'Avoid';
            else if (randomScore > 7.5) rec = 'Buy';
            else if (randomScore < 4.0) rec = 'Sell';

            fund = {
                code: searchTerm,
                name: `模拟基金-${searchTerm}`,
                nav: parseFloat((Math.random() * 3 + 0.5).toFixed(3)),
                dayChange: randomChange,
                canAllot: canAllot,
                score: randomScore,
                sector: "综合成长",
                recommendation: rec
            };
        }

        setSelectedFund(fund || null);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">基金筛选与验证</h2>
            <p className="text-slate-400">输入基金代码（如 005538），系统将实时验证支付宝可交易性并提供AI投顾建议。</p>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl relative z-10">
            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-slate-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="输入 6 位基金代码 (系统支持任意代码模拟)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-slate-600"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gold-600 hover:bg-gold-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 min-w-[120px] justify-center"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : '智能分析'}
                </button>
            </form>
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in">
                <Loader2 size={48} className="text-gold-500 animate-spin mb-4" />
                <p className="text-slate-400 text-sm animate-pulse">正在连接交易所接口...</p>
                <p className="text-slate-500 text-xs mt-1">验证 canAllot 状态 | 计算技术评分</p>
            </div>
        )}

        {/* Result Area */}
        {!isLoading && selectedFund && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl">
                {/* Fund Header Info */}
                <div className="bg-slate-800/50 p-6 border-b border-slate-800 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-bold text-white">{selectedFund.name}</h3>
                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-mono">{selectedFund.code}</span>
                        </div>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                            <Activity size={14} className="text-blue-400" />
                            {selectedFund.sector}板块 
                            <span className="text-slate-600">|</span> 
                            风险等级: R3
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-400 mb-1">预估净值</div>
                        <div className="text-3xl font-bold text-white font-mono">{selectedFund.nav.toFixed(4)}</div>
                        <div className={`text-sm font-medium flex items-center justify-end gap-1 ${selectedFund.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {selectedFund.dayChange > 0 ? <TrendingUp size={14}/> : <TrendingUp size={14} className="rotate-180"/>}
                            {selectedFund.dayChange > 0 ? '+' : ''}{selectedFund.dayChange}%
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1. Alipay Trade Validation */}
                    <div className={`border rounded-xl p-5 flex flex-col items-center justify-center text-center transition-colors ${selectedFund.canAllot ? 'border-green-900/50 bg-green-900/10' : 'border-red-900/50 bg-red-900/10'}`}>
                        {selectedFund.canAllot ? (
                            <>
                                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-3">
                                    <ShieldCheck size={28} className="text-green-500" />
                                </div>
                                <h4 className="text-green-400 font-bold text-lg">支付宝可申购</h4>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600/70 bg-green-900/20 px-2 py-1 rounded">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    canAllot: true 已验证
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-3">
                                    <Lock size={28} className="text-red-500" />
                                </div>
                                <h4 className="text-red-400 font-bold text-lg">渠道交易受限</h4>
                                <div className="mt-2 text-xs text-red-400/70 bg-red-900/20 px-2 py-1 rounded">
                                    该基金在支付宝端暂停申购或未代销
                                </div>
                            </>
                        )}
                    </div>

                    {/* 2. Technical Score */}
                    <div className="border border-slate-700 bg-slate-950/30 rounded-xl p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                             <span className="text-slate-400 text-sm">技术面评分</span>
                             <span className={`text-2xl font-bold font-mono ${selectedFund.score >= 7 ? 'text-gold-400' : 'text-slate-200'}`}>{selectedFund.score}</span>
                        </div>
                        
                        <div className="space-y-3">
                             {/* Score Bar */}
                             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${selectedFund.score >= 7 ? 'bg-gradient-to-r from-gold-600 to-gold-400' : 'bg-slate-600'}`}
                                    style={{ width: `${selectedFund.score * 10}%` }}
                                ></div>
                             </div>
                             
                             <div className="text-xs text-slate-500 space-y-1">
                                <div className="flex justify-between">
                                    <span>趋势强度</span>
                                    <span className={selectedFund.score > 5 ? 'text-green-500' : 'text-slate-500'}>{selectedFund.score > 5 ? '强势' : '一般'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>主力资金</span>
                                    <span className={selectedFund.score > 7 ? 'text-red-400' : 'text-slate-500'}>{selectedFund.score > 7 ? '流入' : '观望'}</span>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* 3. Advisor Recommendation */}
                    <div className="border border-slate-700 bg-slate-950/30 rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={80} />
                        </div>
                        
                        <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-3">AlphaPrime 投顾建议</h4>
                        
                        <div className={`px-6 py-2 rounded-lg font-bold text-xl border-2 mb-3 shadow-lg ${recommendationColorMap[selectedFund.recommendation]}`}>
                            {recommendationMap[selectedFund.recommendation].toUpperCase()}
                        </div>
                        
                        <p className="text-xs text-slate-400 max-w-[80%]">
                            {selectedFund.recommendation === 'Buy' && "技术面金叉 + 政策共振，建议右侧建仓"}
                            {selectedFund.recommendation === 'Hold' && "趋势未坏，但上涨动能减弱，建议持仓观察"}
                            {selectedFund.recommendation === 'Sell' && "触及止损位，技术面破位，建议规避风险"}
                            {selectedFund.recommendation === 'Avoid' && "非可交易标的或缺乏操作机会"}
                        </p>
                    </div>
                </div>

                {/* Action Bar */}
                {selectedFund.canAllot && selectedFund.recommendation === 'Buy' && (
                     <div className="px-6 pb-6 pt-2">
                        <button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 group transition-all shadow-lg hover:shadow-gold-900/20">
                            <div className="bg-gold-500 text-slate-900 p-1 rounded-full">
                                <DollarSign size={16} className="font-bold"/>
                            </div>
                            <span className="font-semibold tracking-wide">生成模拟买入指令单</span>
                            <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 group-hover:text-gold-400 transition-all" />
                        </button>
                     </div>
                )}
            </div>
        )}

        {/* Empty State */}
        {!isLoading && !selectedFund && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <Search size={32} className="text-slate-500" />
                </div>
                <p className="text-lg font-medium text-slate-400">等待指令</p>
                <p className="text-sm mt-1">请输入基金代码开始全维诊断</p>
                <div className="flex gap-2 mt-4 text-xs">
                    <span className="bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono">005538</span>
                    <span className="bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono">110011</span>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default FundSelection;
