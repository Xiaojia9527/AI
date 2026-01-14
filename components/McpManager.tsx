import React, { useState } from 'react';
import { Server, Plus, Trash2, Activity, RefreshCw, CheckCircle2, XCircle, Power, CircleDashed } from 'lucide-react';
import { McpServerConfig } from '../types';

interface McpManagerProps {
  servers: McpServerConfig[];
  setServers: React.Dispatch<React.SetStateAction<McpServerConfig[]>>;
  activeId: string;
  setActiveId: (id: string) => void;
}

const McpManager: React.FC<McpManagerProps> = ({ servers, setServers, activeId, setActiveId }) => {
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleCheck = (id: string) => {
    setServers(prev => prev.map(s => s.id === id ? { ...s, status: 'Checking' } : s));
    
    // Simulate network request
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate mock
      const latency = Math.floor(Math.random() * 100) + 20;
      setServers(prev => prev.map(s => 
        s.id === id ? { 
          ...s, 
          status: isSuccess ? 'Connected' : 'Error',
          latency: isSuccess ? latency : undefined
        } : s
      ));
    }, 1500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl) return;
    
    const newServer: McpServerConfig = {
      id: Date.now().toString(),
      name: newName,
      url: newUrl,
      status: 'Disconnected',
      type: newUrl.startsWith('stdio') ? 'Stdio' : 'SSE'
    };
    
    setServers([...servers, newServer]);
    setNewName('');
    setNewUrl('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setServers(servers.filter(s => s.id !== id));
    if (activeId === id && servers.length > 0) {
      // If deleting active, switch to none or first
      setActiveId(''); 
    }
  };

  const handleSwitch = (id: string) => {
      setActiveId(id);
      handleCheck(id);
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="text-gold-500" />
            MCP 服务器管理
          </h2>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-slate-900 font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            添加节点
          </button>
       </div>

       {isAdding && (
         <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 animate-in slide-in-from-top-2 shadow-lg">
            <h3 className="text-slate-200 font-bold mb-4">添加新 MCP 服务器</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">名称</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-gold-500 outline-none transition-colors"
                  placeholder="例如: 自定义研报节点"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Endpoint URL / Command</label>
                <input 
                  type="text" 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-gold-500 outline-none transition-colors"
                  placeholder="http://... or stdio:..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
               <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 text-slate-400 hover:text-white transition-colors">取消</button>
               <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">保存</button>
            </div>
         </form>
       )}

       <div className="grid grid-cols-1 gap-4">
          {servers.map(server => (
            <div 
              key={server.id} 
              className={`relative border rounded-xl p-5 transition-all ${
                activeId === server.id 
                  ? 'bg-slate-900/80 border-gold-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${activeId === server.id ? 'bg-gold-500/10' : 'bg-slate-800'}`}>
                        <Server size={24} className={activeId === server.id ? 'text-gold-500' : 'text-slate-500'} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          {server.name}
                          {activeId === server.id && <span className="text-[10px] bg-gold-500 text-slate-900 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{server.url}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {activeId !== server.id && (
                        <button 
                          onClick={() => handleSwitch(server.id)}
                          className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg tooltip transition-colors"
                          title="启用此节点"
                        >
                           <Power size={18} />
                        </button>
                    )}
                    <button 
                       onClick={() => handleDelete(server.id)}
                       className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                       title="删除"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">状态:</span>
                        {server.status === 'Checking' && <span className="text-yellow-500 flex items-center gap-1 text-xs"><RefreshCw size={12} className="animate-spin"/> 检测中...</span>}
                        {server.status === 'Connected' && <span className="text-green-500 flex items-center gap-1 text-xs"><CheckCircle2 size={12}/> 已连接</span>}
                        {server.status === 'Error' && <span className="text-red-500 flex items-center gap-1 text-xs"><XCircle size={12}/> 连接失败</span>}
                        {server.status === 'Disconnected' && <span className="text-slate-500 flex items-center gap-1 text-xs"><CircleDashed size={12}/> 未连接</span>}
                     </div>
                     {server.latency && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                           <Activity size={12} />
                           {server.latency}ms
                        </div>
                     )}
                     {server.type && (
                         <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">{server.type}</span>
                     )}
                  </div>
                  
                  <button 
                    onClick={() => handleCheck(server.id)}
                    disabled={server.status === 'Checking'}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors disabled:opacity-50"
                  >
                    检测可用性
                  </button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default McpManager;
