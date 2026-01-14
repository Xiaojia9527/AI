import React from 'react';
import { MarketIndex, MarketTrend } from '../types';
import { INDICES_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Anchor } from 'lucide-react';

const categoryMap: Record<string, string> = {
  'Main': '主要指数',
  'Scale': '规模指数',
  'Industry': '行业指数',
  'Linkage': '联动指数'
};

const MarketAnalysis: React.FC = () => {
  const positiveIndices = INDICES_DATA.filter(i => i.changePercent > 0).length;
  const marketScore = Math.min(10, Math.max(-10, (positiveIndices - INDICES_DATA.length / 2) * 1.5 + 4));
  
  let trend: MarketTrend = MarketTrend.RangeBound;
  let trendColor = "text-yellow-500";
  if (marketScore >= 8) { trend = MarketTrend.StrongBull; trendColor = "text-green-500"; }
  else if (marketScore >= 5) { trend = MarketTrend.MildBull; trendColor = "text-green-400"; }
  else if (marketScore <= -2) { trend = MarketTrend.DeepCorrection; trendColor = "text-red-600"; }
  else if (marketScore <= 1) { trend = MarketTrend.WeakBear; trendColor = "text-red-400"; }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-full">
      {/* Top Section: Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl shadow-lg">
          <h3 className="text-slate-400 text-xs md:text-sm font-semibold mb-2">市场趋势研判</h3>
          <div className="flex items-end gap-3">
             <span className={`text-2xl md:text-3xl font-bold ${trendColor}`}>{trend}</span>
             <span className="text-slate-500 mb-1 text-xs md:text-sm">评分: {marketScore.toFixed(1)}/10</span>
          </div>
          <div className="mt-4 flex gap-2 text-[10px] md:text-xs">
             <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">技术面: 40%</span>
             <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">政策面: 30%</span>
             <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">资金面: 20%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl shadow-lg">
          <h3 className="text-slate-400 text-xs md:text-sm font-semibold mb-2">建议仓位</h3>
          <div className="flex items-center gap-4">
             <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle cx="50%" cy="50%" r="40%" stroke="#fbbf24" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.7)} />
                </svg>
                <span className="absolute text-lg md:text-xl font-bold text-white">70%</span>
             </div>
             <div className="text-xs md:text-sm text-slate-300">
               <p>策略: <span className="text-gold-400 font-bold">进取型</span></p>
               <p className="mt-1">重点: <span className="text-white">成长与科技</span></p>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl shadow-lg flex flex-col justify-between">
           <div>
            <h3 className="text-slate-400 text-xs md:text-sm font-semibold mb-1">核心驱动因素</h3>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center gap-2 text-xs md:text-sm text-green-400"><TrendingUp size={16} /> 新能源政策支持</li>
              <li className="flex items-center gap-2 text-xs md:text-sm text-green-400"><Activity size={16} /> 北向资金流入</li>
              <li className="flex items-center gap-2 text-xs md:text-sm text-red-400"><Anchor size={16} /> 全球利率压力</li>
            </ul>
           </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl shadow-lg">
        <h3 className="text-slate-200 text-base md:text-lg font-bold mb-4">23个指数概览</h3>
        <div className="h-48 md:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INDICES_DATA} margin={{top: 5, right: 10, left: 0, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                cursor={{fill: '#1e293b'}}
              />
              <ReferenceLine y={0} stroke="#64748b" />
              <Bar dataKey="changePercent" fill="#fbbf24">
                {INDICES_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.changePercent >= 0 ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-200 text-sm md:text-base">指数详细数据</h3>
            <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition">刷新</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-slate-800">
                <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">指数名称</th>
                <th className="px-4 py-3 font-medium uppercase text-right whitespace-nowrap">点位</th>
                <th className="px-4 py-3 font-medium uppercase text-right whitespace-nowrap">涨跌幅</th>
                <th className="px-4 py-3 font-medium uppercase text-center whitespace-nowrap">技术评分</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm">
              {INDICES_DATA.map((index, i) => (
                <tr key={index.code} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                      {index.name}
                      <div className="text-[10px] text-slate-500">{index.code}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-200 whitespace-nowrap">{index.value.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {index.changePercent > 0 ? '+' : ''}{index.changePercent}%
                  </td>
                  <td className="px-4 py-3 text-center">
                     <div className="flex gap-0.5 justify-center">
                        {[1,2,3,4,5].map(star => (
                            <div key={star} className={`w-1 md:w-1.5 h-3 md:h-4 rounded-sm ${Math.random() > 0.4 ? 'bg-gold-500' : 'bg-slate-700'}`}></div>
                        ))}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;