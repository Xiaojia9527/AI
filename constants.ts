import { MarketIndex, NewsItem, Fund, MarketTrend, McpServerConfig, Stock, McpToolLog } from './types';

export const INDICES_DATA: MarketIndex[] = [
  // Main
  { code: "sh000001", name: "上证指数", value: 3050.23, change: 15.4, changePercent: 0.51, category: "Main" },
  { code: "sz399001", name: "深证成指", value: 9500.12, change: 89.2, changePercent: 0.94, category: "Main" },
  { code: "sh000300", name: "沪深300", value: 3560.88, change: 20.1, changePercent: 0.57, category: "Main" },
  { code: "sh000688", name: "科创50", value: 820.45, change: 12.5, changePercent: 1.55, category: "Main" },
  // Scale
  { code: "sh000016", name: "上证50", value: 2400.10, change: 5.2, changePercent: 0.22, category: "Scale" },
  { code: "sh000905", name: "中证500", value: 5400.33, change: 45.1, changePercent: 0.84, category: "Scale" },
  { code: "sh000852", name: "中证1000", value: 5800.56, change: 60.2, changePercent: 1.05, category: "Scale" },
  { code: "sz399006", name: "创业板指", value: 1850.67, change: 30.4, changePercent: 1.67, category: "Scale" },
  // Industry (Subset)
  { code: "sh000932", name: "中证消费", value: 22000.1, change: -120.5, changePercent: -0.54, category: "Industry" },
  { code: "sh930997", name: "中证新能源", value: 1800.4, change: 45.3, changePercent: 2.58, category: "Industry" },
  { code: "sh000974", name: "中证银行", value: 5600.2, change: 10.1, changePercent: 0.18, category: "Industry" },
  { code: "sh399967", name: "中证军工", value: 10500.6, change: 150.2, changePercent: 1.45, category: "Industry" },
  // Linkage
  { code: "hk00011", name: "恒生指数", value: 16500.4, change: 200.5, changePercent: 1.23, category: "Linkage" },
  { code: "sh000012", name: "上证国债", value: 198.5, change: 0.02, changePercent: 0.01, category: "Linkage" },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: "1", title: "央行宣布下调存款准备金率0.5个百分点", source: "财新网", time: "08:30", impact: "High", sentiment: "Positive", tags: ["货币政策", "流动性"] },
  { id: "2", title: "新能源汽车购置税减免政策延续至2027年", source: "发改委", time: "09:15", impact: "High", sentiment: "Positive", tags: ["行业政策", "新能源车"] },
  { id: "3", title: "北向资金早盘净流入超50亿元", source: "Wind", time: "10:30", impact: "Medium", sentiment: "Positive", tags: ["资金流向"] },
  { id: "4", title: "美联储会议纪要暗示维持高利率更长时间", source: "Bloomberg", time: "07:00", impact: "Medium", sentiment: "Negative", tags: ["外围市场", "美联储"] },
];

export const MOCK_FUNDS: Fund[] = [
  { code: "005538", name: "信澳新能源精选混合", nav: 2.145, dayChange: 2.3, canAllot: true, score: 8.5, sector: "新能源", recommendation: "Buy" },
  { code: "110011", name: "易方达中小盘混合", nav: 3.560, dayChange: 0.5, canAllot: true, score: 6.2, sector: "消费", recommendation: "Hold" },
  { code: "000001", name: "华夏成长混合", nav: 1.050, dayChange: -0.8, canAllot: true, score: 4.1, sector: "混合", recommendation: "Sell" },
  { code: "510300", name: "华泰柏瑞沪深300ETF", nav: 3.890, dayChange: 0.6, canAllot: false, score: 7.0, sector: "指数", recommendation: "Avoid" }, // ETF usually false for direct Alipay simple buy
];

export const MOCK_STOCKS: Stock[] = [
    { code: "300308", name: "中际旭创", price: 156.80, changePercent: 4.5, volume: 85000, turnoverRate: 3.2, pe: 65.4, sector: "CPO/光模块", mainForceInflow: 25000 },
    { code: "601138", name: "工业富联", price: 22.45, changePercent: 1.2, volume: 150000, turnoverRate: 1.1, pe: 18.5, sector: "AI服务器", mainForceInflow: 5000 },
    { code: "300750", name: "宁德时代", price: 185.20, changePercent: -0.8, volume: 45000, turnoverRate: 0.9, pe: 22.1, sector: "锂电池", mainForceInflow: -8000 },
    { code: "600519", name: "贵州茅台", price: 1680.00, changePercent: 0.2, volume: 3000, turnoverRate: 0.1, pe: 28.5, sector: "白酒", mainForceInflow: 1200 },
    { code: "002594", name: "比亚迪", price: 210.50, changePercent: 2.1, volume: 60000, turnoverRate: 1.5, pe: 24.0, sector: "新能源车", mainForceInflow: 15000 },
];

export const MCP_LOG_INIT: McpToolLog[] = [
  { id: "1", timestamp: "08:30:01", toolName: "GetCurrentTime", status: "Success", message: "2024-05-20T08:30:01+08:00" },
  { id: "2", timestamp: "08:30:02", toolName: "mcp_stock-market-data_get_market_overview", status: "Success", message: "Market overview data fetched." },
  { id: "3", timestamp: "08:30:05", toolName: "SearchFinancialNews", status: "Success", message: "Found 15 relevant policy articles." },
];

export const DEFAULT_MCP_SERVERS: McpServerConfig[] = [
  { id: '1', name: 'AlphaPrime Core', url: 'http://localhost:3000/sse', status: 'Connected', type: 'SSE', latency: 45 },
  { id: '2', name: 'Tavily Search Agent', url: 'http://localhost:3001/sse', status: 'Disconnected', type: 'SSE' },
  { id: '3', name: 'Stock Data Connector', url: 'stdio:stock-server', status: 'Disconnected', type: 'Stdio' },
];

export const MOCK_ETFS = [
    { code: '512480', name: '半导体ETF', price: 0.685, change: 1.25 },
    { code: '512010', name: '医药ETF', price: 0.354, change: -0.56 },
    { code: '512880', name: '证券ETF', price: 0.892, change: 0.88 },
    { code: '515030', name: '新能源车ETF', price: 1.120, change: 2.10 },
    { code: '513100', name: '纳指ETF', price: 1.450, change: -0.20 },
];