import React, { useState, useEffect } from 'react';
import { Search, Activity, Zap, BarChart2, Crosshair, Clock, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import { MOCK_ETFS } from '../constants';
import { EtfIntradayPoint, EtfStrategy } from '../types';

const EtfTradingMonitor: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('512480');
    const [selectedEtf, setSelectedEtf] = useState(MOCK_ETFS[0]);
    const [intradayData, setIntradayData] = useState<EtfIntradayPoint[]>([]);
    const [liveInfo, setLiveInfo] = useState<string[]>([]);
    const [strategy, setStrategy] = useState<EtfStrategy | null>(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    
    useEffect(() => {
        const generateData = () => {
            const data: EtfIntradayPoint[] = [];
            let price = selectedEtf.price * 0.98;
            let avgPrice = price;
            
            for (let i = 0; i < 120; i++) { 
                const time = new Date(new Date().setHours(9, 30 + i)).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
                const change = (Math.random() - 0.48) * 0.005; 
                price = price + change;
                avgPrice = (avgPrice * i + price) / (i + 1);
                
                data.push({
                    time,
                    price: parseFloat(price.toFixed(3)),
                    avgPrice: parseFloat(avgPrice.toFixed(3)),
                    volume: Math.floor(Math.random() * 50000) + 5000
                });
            }
            return data;
        };

        setIntradayData(generateData());
        setIsMonitoring(true);
        generateStrategy(selectedEtf.name);
    }, [selectedEtf]);

    // Live update simulation
    useEffect(() => {
        if (!isMonitoring) return;
        const interval = setInterval(() => {
            setIntradayData(prev => {
                const last = prev[prev.length - 1];
                const newPrice = last.price + (Math.random() - 0.5) * 0.003;
                const newTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
                const newPoint = {
                    time: newTime,
                    price: parseFloat(newPrice.toFixed(3)),
                    avgPrice: (last.avgPrice * prev.length + newPrice) / (prev.length + 1),
                    volume: Math.floor(Math.random() * 80000) 
                };
                return [...prev.slice(1), newPoint];
            });

            if (Math.random() > 0.7) {
                const infos = [
                    "主力大单买入 5000 手",
                    "板块指数拉升 0.5%",
                    "全网热度激增",
                    "卖一出现压单"
                ];
                setLiveInfo(prev => [infos[Math.floor(Math.random() * infos.length)], ...prev].slice(0, 5));
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [isMonitoring]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = MOCK_ETFS.find(etf => etf.code === searchTerm || etf.name.includes(searchTerm));
        if (found) setSelectedEtf(found);
    };

    const generateStrategy = (name: string) => {
        const isBullish = Math.random() > 0.4;
        setStrategy({
            type: 'Intraday-T',
            direction: isBullish ? 'Buy' : 'Sell',
            pricePoint: isBullish ? (selectedEtf.price * 0.995).toFixed(3) : (selectedEtf.price * 1.005).toFixed(3),
            timeWindow: '14:30 - 14:45',
            confidence: 88,
            reasoning: [
                "分时图'W底'形态确认，量能放大。",
                "资金净流入排名前三。",
                "MACD 1分钟底背离。"
            ],
            riskControl: isBullish ? "跌破 " + (selectedEtf.price * 0.985).toFixed(3) + " 止损" : "突破 " + (selectedEtf.price * 1.015).toFixed(3) + " 止损"
        });
    };

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-gold-500" />
                        ETF 实战 (T+0)
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">实时高频监控 • 机构级分时策略</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white pl-8 pr-4 py-2 rounded-lg text-sm focus:border-gold-500 outline-none w-full md:w-48"
                            placeholder="代码 51xxxx"
                        />
                        <Search size={14} className="absolute left-2.5 top-3 text-slate-500" />
                    </div>
                    <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-gold-400 px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
                        监控
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left: Chart & Info */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    {/* ETF Info Card */}
                    <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl flex justify-between items-center">
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
                                {selectedEtf.name} 
                                <span className="text-xs md:text-sm font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">{selectedEtf.code}</span>
                            </h3>
                            <div className="flex gap-2 md:gap-4 mt-2 text-sm">
                                <span className={`font-mono font-bold text-lg md:text-xl ${intradayData[intradayData.length-1]?.price >= intradayData[0]?.price ? 'text-green-500' : 'text-red-500'}`}>
                                    {intradayData[intradayData.length-1]?.price.toFixed(3)}
                                </span>
                                <span className="text-slate-400 flex items-center gap-1 text-xs md:text-sm">
                                    <BarChart2 size={14} /> 
                                    量比 <span className="text-gold-400">1.85</span>
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] md:text-xs text-slate-500 mb-1">实时趋势</div>
                             <div className="flex items-center gap-1 text-green-400 font-bold text-sm md:text-base">
                                <Zap size={16} fill="currentColor" />
                                强势
                             </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="bg-slate-900 border border-slate-800 p-3 md:p-4 rounded-xl shadow-lg">
                        <div className="h-[200px] md:h-[300px] w-full mb-2">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={intradayData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#475569" fontSize={10} minTickGap={30} tickFormatter={(val) => val.split(':')[0] + ':' + val.split(':')[1]}/>
                                    <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} tickFormatter={(val) => val.toFixed(3)} width={35} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                                    <Area type="monotone" dataKey="avgPrice" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" fill="transparent" isAnimationActive={false} />
                                    <ReferenceLine y={intradayData[0]?.price} stroke="#64748b" strokeDasharray="3 3" />
                                </AreaChart>
                             </ResponsiveContainer>
                        </div>
                        {/* Volume Chart */}
                        <div className="h-[60px] md:h-[100px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={intradayData}>
                                    <Bar dataKey="volume" isAnimationActive={false}>
                                        {intradayData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index > 0 && entry.price >= intradayData[index-1].price ? '#22c55e' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Live Info Stream */}
                    <div className="bg-slate-900 border border-slate-800 p-3 md:p-4 rounded-xl">
                        <h4 className="text-slate-400 text-xs font-bold mb-3 uppercase flex items-center gap-2">
                            <Activity size={14} className="animate-pulse text-green-500" />
                            实时监控情报
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-hidden relative">
                            {liveInfo.map((info, i) => (
                                <div key={i} className="text-sm flex items-center gap-2 animate-in slide-in-from-right duration-300">
                                    <span className="text-slate-600 text-[10px] md:text-xs font-mono">{new Date().toLocaleTimeString()}</span>
                                    <span className="text-slate-300 text-xs md:text-sm line-clamp-1">{info}</span>
                                </div>
                            ))}
                            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Right: Strategy & Advice */}
                <div className="space-y-4 md:space-y-6">
                    {/* Strategy Card */}
                    {strategy && (
                        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-4 md:p-6 rounded-xl shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gold-500/10 rounded-full group-hover:bg-gold-500/20 transition-colors"></div>
                            
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Crosshair className="text-gold-500" />
                                策略建议
                            </h3>

                            <div className="space-y-4 md:space-y-6">
                                {/* Action Banner */}
                                <div className={`p-4 rounded-lg border flex justify-between items-center ${strategy.direction === 'Buy' ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                                    <div>
                                        <div className={`text-xl md:text-2xl font-bold ${strategy.direction === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                                            {strategy.direction === 'Buy' ? '买入做T' : '卖出做T'}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{strategy.type === 'Intraday-T' ? '日内超短' : '隔夜波段'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs md:text-sm text-slate-400">建议点位</div>
                                        <div className="text-lg md:text-xl font-mono font-bold text-white">{strategy.pricePoint}</div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                        <span className="text-slate-400 flex items-center gap-1"><Clock size={14}/> 最佳时机</span>
                                        <span className="text-white font-mono">{strategy.timeWindow}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                        <span className="text-slate-400 flex items-center gap-1"><Shield size={14}/> 胜率预估</span>
                                        <span className="text-gold-400 font-bold">{strategy.confidence}%</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">风控止损</span>
                                        <span className="text-red-400 font-mono text-xs">{strategy.riskControl}</span>
                                    </div>
                                </div>

                                {/* Reasoning */}
                                <div>
                                    <h4 className="text-slate-400 text-xs font-bold mb-2 uppercase">决策逻辑核心</h4>
                                    <ul className="space-y-2">
                                        {strategy.reasoning.map((r, i) => (
                                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                                <span className="text-gold-500 mt-0.5">•</span>
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-slate-700">
                                <button className="w-full bg-gold-600 hover:bg-gold-500 text-slate-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                                    确认执行信号
                                </button>
                                <p className="text-[10px] text-slate-500 text-center mt-2">
                                    *优先保证高胜率而非交易频率。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EtfTradingMonitor;
