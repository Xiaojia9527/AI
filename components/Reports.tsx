import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { INDICES_DATA } from '../constants';

const Reports: React.FC = () => {
    const [reportType, setReportType] = useState('Morning');
    const [copied, setCopied] = useState(false);

    // Generate Dynamic Content based on current Mock Data
    const shIndex = INDICES_DATA.find(i => i.code === 'sh000001');
    const marketMood = (shIndex?.changePercent || 0) > 0 ? "温和上涨" : "震荡整理";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const typeMap: Record<string, string> = {
        'Morning': '早报',
        'Mid-Day': '午报',
        'Closing': '收盘',
        'Special': '专报'
    };

    const generateMarkdown = () => {
        return `
## 🎯 大盘走势分析

### 当前走势判断：${marketMood}

### 分析依据：
**技术面（7分）**：
- 指数形态：上证指数当前位于${shIndex?.value}点，呈现${(shIndex?.changePercent || 0) > 0 ? '多头' : '调整'}排列。
- 关键点位：支撑3000点，阻力3100点。

**政策面（8分）**：
- 货币政策：央行释放流动性，市场资金面宽松。
- 行业政策：新能源车政策延续，利好成长板块。

**资金面（6分）**：
- 北向资金：早盘净流入明显。
- 市场情绪：活跃度提升。

### 综合评分：7.0分
### 后市预判：短期震荡向上，关注3100点突破情况。
### 操作建议：仓位维持在60-70%，逢低布局新能源、科技板块。

---

## 🚨 重要免责声明
**本报告仅供参考，不构成任何投资建议或承诺**
...
`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateMarkdown());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-gold-500" />
                    报告生成器
                </h2>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {['Morning', 'Mid-Day', 'Closing', 'Special'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setReportType(type)}
                            className={`px-4 py-1.5 text-sm rounded transition-colors ${reportType === type ? 'bg-slate-700 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {typeMap[type]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                    <span className="text-xs font-mono text-slate-500">{dateStr}-{typeMap[reportType]}-Report.md</span>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 transition-colors"
                    >
                        {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                        {copied ? '已复制' : '复制 Markdown'}
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed">
                        {generateMarkdown()}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Reports;
