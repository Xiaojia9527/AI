import React, { useState, useEffect } from 'react';
import { Search, Activity, Zap, BarChart2, TrendingUp, TrendingDown, Target, ShieldAlert, Crosshair, Grid3X3, DollarSign, BrainCircuit, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import { MOCK_STOCKS } from '../constants';
import { Stock, EtfIntradayPoint, StockStrategy } from '../types';

const StockTradingMonitor: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('300308');
    const [selectedStock, setSelectedStock] = useState<Stock>(MOCK_STOCKS[0]);
    const [intradayData, setIntradayData] = useState<EtfIntradayPoint[]>([]);
    const [liveIntel, setLiveIntel] = useState<string[]>([]);
    const [strategy, setStrategy] = useState<StockStrategy | null>(null);
    const [alphaPicks, setAlphaPicks] = useState<Stock[]>([]);

    // Initialize Alpha Picks
    useEffect(() => {
        const recommendations = MOCK_STOCKS.filter(s => ['300308', '002594'].includes(s.code));
        setAlphaPicks(recommendations);
    }, []);

    // Simulate Intraday Data
    useEffect(() => {
        const generateData = () => {
            const data: EtfIntradayPoint[] = [];
            let price = selectedStock.price * 0.985;
            let avgPrice = price;
            
            for (let i = 0; i < 240; i++) {
                const hour = 9 + Math.floor((30 + i) / 60);
                const minute = (30 + i) % 60;
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                const momentum = selectedStock.changePercent > 0 ? 0.0005 : -0.0005;
                const noise = (Math.random() - 0.5) * (selectedStock.price * 0.003);
                
                let structuralBias = 0;
                if (selectedStock.code === '300308' && i > 120) structuralBias = 0.05;
                
                price = price + (price * momentum) + noise + structuralBias;
                avgPrice = (avgPrice * i + price) / (i + 1);
                
                let volume = Math.floor(Math.random() * 2000) + 500;
                if (i < 30 || i > 210) volume *= 2.5;
                if (Math.random() > 0.95) volume *= 3; 

                if (i % 5 === 0) {
                    data.push({
                        time,
                        price: parseFloat(price.toFixed(2)),
                        avgPrice: parseFloat(avgPrice.toFixed(2)),
                        volume
                    });
                }
            }
            return data;
        };
        setIntradayData(generateData());
        generateStrategy(selectedStock);
    }, [selectedStock]);

    // Live Intel
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                const messages = [
                    `主力: 3000手买单扫货`,
                    `板块: 龙头效应显著`,
                    `异动: 1分钟换手突增`,
                    `博弈: 突破VWAP`,
                    `盘口: 隐蔽吸筹`
                ];
                const msg = messages[Math.floor(Math.random() * messages.length)];
                setLiveIntel(prev => [msg, ...prev].slice(0, 6));
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [selectedStock]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = MOCK_STOCKS.find(s => s.code === searchTerm || s.name.includes(searchTerm));
        if (found) setSelectedStock(found);
    };

    const generateStrategy = (stock: Stock) => {
        let newStrategy: StockStrategy;
        
         if (stock.code === '300308') { 
            const entry = stock.price * 1.005; 
            newStrategy = {
                mode: 'Trend-T',
                action: 'Buy',
                entryPrice: parseFloat(entry.toFixed(2)),
                targetPrice: parseFloat((entry * 1.05).toFixed(2)),
                stopLossPrice: 149.50, 
                confidence: 88,
                logic: [
                    "核心逻辑: AI算力开支激增，业绩确定性强。",
                    "资金面: 主力净流入超2.5亿，阶梯式放量。",
                    "技术面: 突破平台整理区，MACD金叉。"
                ],
                risks: [
                    "情绪风险: 短期乖离率过大。",
                    "止损逻辑: 跌破149.50意味着假突破。"
                ]
            };
        } else if (stock.code === '002594') { 
            const entry = stock.price; 
            newStrategy = {
                mode: 'Trend-T',
                action: 'Buy',
                entryPrice: parseFloat(entry.toFixed(2)),
                targetPrice: parseFloat((entry * 1.03).toFixed(2)),
                stopLossPrice: 204.80,
                confidence: 82,
                logic: [
                    "核心逻辑: 政策利好刺激，销量预期超预期。",
                    "估值面: PE仅24倍，具备安全边际。",
                    "技术面: 站稳20日线，右侧低吸机会。"
                ],
                risks: [
                    "行业风险: 价格战压制毛利率。",
                    "止损逻辑: 跌破204.80趋势转弱。"
                ]
            };
        } else if (stock.code === '300750') { 
            const basePrice = stock.price;
            newStrategy = {
                mode: 'Grid',
                action: 'Hold',
                entryPrice: basePrice, 
                targetPrice: basePrice * 1.02,
                stopLossPrice: 178.50,
                gridRange: {
                    low: 180.00,
                    high: 190.00,
                    step: 1.50
                },
                confidence: 75,
                logic: [
                    "箱体震荡（180-190），适合网格操作。",
                    "下方180关口有护盘。",
                    "RSI指标中性。"
                ],
                risks: [
                    "系统性风险: 创业板破位。",
                    "止损逻辑: 跌破178.50网格失效。"
                ]
            };
        } else {
            const isTrending = Math.abs(stock.changePercent) > 2.0;
            const direction = stock.changePercent > 0 ? 'Buy' : 'Sell';
            const priceRef = stock.price;
            newStrategy = {
                mode: isTrending ? 'Trend-T' : 'Grid',
                action: isTrending ? direction : 'Hold',
                entryPrice: parseFloat(priceRef.toFixed(2)),
                targetPrice: parseFloat((priceRef * (isTrending ? 1.03 : 1.02)).toFixed(2)),
                stopLossPrice: parseFloat((priceRef * (isTrending ? 0.97 : 0.98)).toFixed(2)),
                confidence: 70,
                gridRange: isTrending ? undefined : {
                    low: parseFloat((priceRef * 0.98).toFixed(2)),
                    high: parseFloat((priceRef * 1.02).toFixed(2)),
                    step: parseFloat((priceRef * 0.005).toFixed(2))
                },
                logic: [
                    isTrending ? "顺势而为，跟随资金流向。" : "震荡行情，缺乏明确方向。",
                    `当前换手率 ${stock.turnoverRate}%，市场活跃度${stock.turnoverRate > 2 ? '高' : '一般'}。`
                ],
                risks: [
                    "大盘环境不确定性。",
                    `若跌破 ${(priceRef * 0.97).toFixed(2)} 则止损。`
                ]
            };
        }
        setStrategy(newStrategy);
    };

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-gold-500" fill="currentColor" />
                        A股实战 (Alpha)
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">深度基本面解析 • 机构级风控标准</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2 relative w-full md:w-auto">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="代码/名称"
                        className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:border-gold-500 outline-none w-full md:w-64 text-sm md:text-base"
                    />
                    <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-gold-400 px-3 md:px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap text-sm md:text-base">
                        分析
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                
                {/* LEFT COLUMN: Chart & Monitor */}
                <div className="xl:col-span-2 space-y-4 md:space-y-6">
                    {/* Stock Header Info */}
                    <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl shadow-lg flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedStock.name}</h3>
                                <span className={`px-2 py-1 rounded text-xs md:text-sm font-bold ${selectedStock.changePercent >= 0 ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30 text-green-500'}`}>
                                    {selectedStock.changePercent > 0 ? '+' : ''}{selectedStock.changePercent}%
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-4 mt-2 text-xs md:text-sm text-slate-400">
                                <span className="text-slate-500 font-mono bg-slate-800 px-1.5 rounded">{selectedStock.code}</span>
                                <span>当前: <b className="text-slate-200">{selectedStock.price}</b></span>
                                <span>PE: <b className="text-slate-200">{selectedStock.pe}</b></span>
                                <span className="hidden md:inline">板块: <b className="text-gold-500">{selectedStock.sector}</b></span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] md:text-xs text-slate-500 mb-1">主力净流入</div>
                            <div className={`text-lg md:text-xl font-bold ${selectedStock.mainForceInflow > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {selectedStock.mainForceInflow > 0 ? '+' : ''}{(selectedStock.mainForceInflow / 10000).toFixed(2)} 亿
                            </div>
                        </div>
                    </div>

                    {/* Intraday Chart */}
                    <div className="bg-slate-900 border border-slate-800 p-3 md:p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-2 px-1">
                             <h4 className="text-slate-400 text-xs font-bold uppercase">分时走势</h4>
                             <div className="flex gap-2 text-[10px]">
                                 <span className="flex items-center gap-1 text-gold-400"><div className="w-1.5 h-1.5 rounded-full bg-gold-400"></div> 价格</span>
                                 <span className="flex items-center gap-1 text-orange-400"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> VWAP</span>
                             </div>
                        </div>
                        <div className="h-[200px] md:h-[350px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={intradayData}>
                                    <defs>
                                        <linearGradient id="colorPriceStock" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#475569" fontSize={10} minTickGap={30} tickFormatter={(val) => val.split(':')[0] + ':' + val.split(':')[1]}/>
                                    <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} tickFormatter={(val) => val.toFixed(2)} width={35} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#fbbf24" strokeWidth={2} fill="url(#colorPriceStock)" isAnimationActive={false} />
                                    <Area type="monotone" dataKey="avgPrice" stroke="#f97316" strokeWidth={2} strokeDasharray="3 3" fill="transparent" isAnimationActive={false} />
                                    
                                    {/* Strategy Visualization Lines */}
                                    {strategy && (
                                        <>
                                            <ReferenceLine 
                                                y={strategy.stopLossPrice} 
                                                stroke="#ef4444" 
                                                strokeDasharray="4 2" 
                                                label={{ value: '🛑 止损', fill: '#ef4444', fontSize: 10, position: 'right' }} 
                                            />
                                            {strategy.mode === 'Grid' && strategy.gridRange ? (
                                                <>
                                                    <ReferenceLine 
                                                        y={strategy.gridRange.high} 
                                                        stroke="#22c55e" 
                                                        strokeDasharray="4 2" 
                                                        label={{ value: '💰 网格卖出', fill: '#22c55e', fontSize: 10, position: 'right' }} 
                                                    />
                                                    <ReferenceLine 
                                                        y={strategy.gridRange.low} 
                                                        stroke="#fbbf24" 
                                                        strokeDasharray="4 2" 
                                                        label={{ value: '🛒 网格买入', fill: '#fbbf24', fontSize: 10, position: 'right' }} 
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <ReferenceLine 
                                                        y={strategy.targetPrice} 
                                                        stroke="#22c55e" 
                                                        strokeDasharray="4 2" 
                                                        label={{ value: '🎯 目标止盈', fill: '#22c55e', fontSize: 10, position: 'right' }} 
                                                    />
                                                    <ReferenceLine 
                                                        y={strategy.entryPrice} 
                                                        stroke="#fbbf24" 
                                                        strokeDasharray="4 2" 
                                                        label={{ value: '⚡ 建议买入', fill: '#fbbf24', fontSize: 10, position: 'right' }} 
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}

                                    <ReferenceLine y={intradayData[0]?.price} stroke="#64748b" strokeDasharray="3 3" />
                                </AreaChart>
                             </ResponsiveContainer>
                        </div>
                        <div className="h-[60px] md:h-[80px] w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={intradayData}>
                                    <Bar dataKey="volume" isAnimationActive={false}>
                                        {intradayData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index > 0 && entry.price >= intradayData[index-1].price ? '#ef4444' : '#22c55e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Live Intelligence Feed - Collapsible on mobile? Or simplified */}
                    <div className="bg-slate-900 border border-slate-800 p-3 md:p-4 rounded-xl">
                        <h4 className="text-slate-400 text-xs font-bold mb-3 uppercase flex items-center gap-2">
                            <BrainCircuit size={14} className="text-blue-400" />
                            AlphaPrime 监控流
                        </h4>
                        <div className="space-y-2">
                            {liveIntel.map((msg, idx) => (
                                <div key={idx} className="flex items-center gap-2 md:gap-3 text-sm animate-in fade-in slide-in-from-right-2 duration-300">
                                    <span className="text-slate-600 font-mono text-[10px] md:text-xs">{new Date().toLocaleTimeString()}</span>
                                    <span className="text-slate-300 border-l-2 border-slate-700 pl-2 md:pl-3 text-xs md:text-sm line-clamp-1 md:line-clamp-none">{msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Strategy & Recommendations */}
                <div className="space-y-4 md:space-y-6">
                    
                    {/* 2. Strategy Engine (Active Stock) - Moved up on mobile in importance? No, keep logic flow */}
                    {strategy && (
                        <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                {strategy.mode === 'Grid' ? <Grid3X3 size={64}/> : <TrendingUp size={64}/>}
                            </div>
                            
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="text-gold-500" />
                                策略引擎
                            </h3>

                            {/* Signal Banner */}
                            <div className={`p-4 rounded-lg border mb-4 flex justify-between items-center ${strategy.action === 'Buy' ? 'bg-red-900/20 border-red-800' : strategy.action === 'Sell' ? 'bg-green-900/20 border-green-800' : 'bg-slate-800 border-slate-700'}`}>
                                <div>
                                    <div className={`text-xl font-bold ${strategy.action === 'Buy' ? 'text-red-500' : strategy.action === 'Sell' ? 'text-green-500' : 'text-slate-300'}`}>
                                        {strategy.action === 'Buy' ? '建议买入' : strategy.action === 'Sell' ? '建议卖出' : '持仓观望'}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        胜率预估: <span className="text-gold-400 font-bold">{strategy.confidence}%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500">目标价格</div>
                                    <div className="text-lg font-mono font-bold text-white">{strategy.targetPrice.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Detailed Parameters */}
                            <div className="space-y-3 text-sm mb-4">
                                {strategy.mode === 'Grid' ? (
                                    <>
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span className="text-slate-400">网格下限 (买入)</span>
                                            <span className="text-red-400 font-mono">{strategy.gridRange?.low}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span className="text-slate-400">网格上限 (卖出)</span>
                                            <span className="text-green-400 font-mono">{strategy.gridRange?.high}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between border-b border-slate-800 pb-2">
                                        <span className="text-slate-400">推荐点位</span>
                                        <span className="text-gold-400 font-mono">{strategy.entryPrice.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400 flex items-center gap-1"><Lock size={12}/> 最坏情况止损</span>
                                    <span className="text-red-500 font-bold font-mono">{strategy.stopLossPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Logic & Risks */}
                            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">核心逻辑与风险</h4>
                                <ul className="space-y-2">
                                    {strategy.logic.map((l, i) => (
                                        <li key={`l-${i}`} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                            <span className="text-gold-500 mt-0.5 min-w-[12px]">✔</span> {l}
                                        </li>
                                    ))}
                                    {strategy.risks.map((r, i) => (
                                        <li key={`r-${i}`} className="text-xs text-red-300/80 flex items-start gap-1.5 leading-relaxed">
                                            <span className="text-red-500 mt-0.5 min-w-[12px]">⚠</span> {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 hover:border-gold-500/30 text-sm md:text-base">
                                <DollarSign size={16} />
                                生成模拟指令
                            </button>
                        </div>
                    )}

                    {/* 1. Alpha Picks (Today's Recommendations) */}
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-4 md:p-5 rounded-xl">
                        <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="text-red-500" />
                            今日 Alpha 精选
                        </h3>
                        <div className="flex flex-row overflow-x-auto gap-4 pb-2 md:pb-0 md:flex-col md:overflow-visible">
                            {alphaPicks.map((stock) => (
                                <div key={stock.code} onClick={() => setSelectedStock(stock)} className={`min-w-[200px] md:min-w-0 bg-slate-950/50 border hover:border-gold-500/50 p-3 md:p-4 rounded-lg cursor-pointer transition-all group shrink-0 ${selectedStock.code === stock.code ? 'border-gold-500 bg-slate-800' : 'border-slate-700'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-bold text-white group-hover:text-gold-400 transition-colors text-sm md:text-base">{stock.name}</div>
                                            <div className="text-[10px] md:text-xs text-slate-500">{stock.code}</div>
                                        </div>
                                        <div className="text-red-500 font-mono font-bold text-sm">+{stock.changePercent}%</div>
                                    </div>
                                    <div className="text-[10px] md:text-xs text-slate-400 mb-2 line-clamp-2 h-8">
                                        {stock.code === '300308' ? "AI核心，技术面突破" : "政策利好，估值安全"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StockTradingMonitor;