export enum MarketTrend {
  StrongBull = "强势上涨",
  MildBull = "温和上涨",
  RangeBound = "震荡整理",
  WeakBear = "弱势下跌",
  DeepCorrection = "深度调整"
}

export interface MarketIndex {
  code: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  category: 'Main' | 'Scale' | 'Industry' | 'Linkage';
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  impact: 'High' | 'Medium' | 'Low';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  tags: string[];
}

export interface Fund {
  code: string;
  name: string;
  nav: number;
  dayChange: number;
  canAllot: boolean; // Alipay purchase check
  score: number;
  sector: string;
  recommendation: 'Buy' | 'Hold' | 'Sell' | 'Avoid';
}

export interface Stock {
    code: string;
    name: string;
    price: number;
    changePercent: number;
    volume: number; // in hands
    turnoverRate: number; // 换手率
    pe: number;
    sector: string;
    mainForceInflow: number; // 主力净流入 (万)
}

export interface StockStrategy {
    mode: 'Grid' | 'Trend-T' | 'Wait';
    action: 'Buy' | 'Sell' | 'Hold';
    entryPrice: number;
    targetPrice: number;
    stopLossPrice: number;
    gridRange?: { low: number; high: number; step: number };
    confidence: number;
    logic: string[];
    risks: string[];
}

export interface McpToolLog {
  id: string;
  timestamp: string;
  toolName: string;
  status: 'Running' | 'Success' | 'Failed';
  message: string;
}

export interface McpServerConfig {
  id: string;
  name: string;
  url: string;
  status: 'Connected' | 'Disconnected' | 'Checking' | 'Error';
  type?: 'Stdio' | 'SSE';
  latency?: number;
}

export interface EtfIntradayPoint {
  time: string;
  price: number;
  volume: number;
  avgPrice: number;
}

export interface EtfStrategy {
  type: 'Intraday-T' | 'Overnight-T' | 'Wait';
  direction: 'Buy' | 'Sell' | 'None';
  pricePoint: string;
  timeWindow: string;
  confidence: number; // 0-100
  reasoning: string[];
  riskControl: string;
}
