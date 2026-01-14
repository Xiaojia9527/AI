import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import { McpToolLog } from '../types';
import { MCP_LOG_INIT } from '../constants';

interface McpLogProps {
  activeServerName?: string;
}

const McpLog: React.FC<McpLogProps> = ({ activeServerName }) => {
  const [logs, setLogs] = useState<McpToolLog[]>(MCP_LOG_INIT);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const tools = ['GetLatestQuotations', 'SearchHotTopic', 'searchRealtimeAiAnalysis', 'BatchGetFundTradeLimit', 'mcp_tavily-search'];
        const randomTool = tools[Math.floor(Math.random() * tools.length)];
        const newLog: McpToolLog = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          toolName: randomTool,
          status: Math.random() > 0.1 ? 'Success' : 'Failed',
          message: '自动刷新周期执行中...'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 10));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border-t border-slate-800 h-48 flex flex-col font-mono text-xs">
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={14} />
          <span className="font-bold">MCP 工具执行日志</span>
        </div>
        <div className="flex gap-2">
            <span className="flex items-center gap-1 text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 
                {activeServerName ? `已连接: ${activeServerName}` : '系统运行中'}
            </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center gap-3 hover:bg-slate-900 p-1 rounded transition-colors">
            <span className="text-slate-500 min-w-[70px]">{log.timestamp}</span>
            <span className={`min-w-[200px] font-semibold ${log.toolName.includes('tavily') ? 'text-blue-400' : 'text-purple-400'}`}>
              {log.toolName}
            </span>
            <span className="min-w-[24px]">
               {log.status === 'Success' && <CheckCircle2 size={12} className="text-green-500" />}
               {log.status === 'Running' && <CircleDashed size={12} className="text-yellow-500 animate-spin" />}
               {log.status === 'Failed' && <XCircle size={12} className="text-red-500" />}
            </span>
            <span className="text-slate-300 truncate">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default McpLog;
