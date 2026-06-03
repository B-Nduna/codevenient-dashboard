"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderSync,     
  Receipt,        
  TrendingUp, 
  Settings, 
  Search, 
  Bell, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  FileText 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const clientDistribution = [
  { name: 'Web Dev', value: 5, color: '#a855f7' },      
  { name: 'Consulting', value: 3, color: '#06b6d4' },   
  { name: 'Tech Support', value: 2, color: '#10b981' }, 
];

const recentActivity = [
  { id: 1, type: 'lead', title: 'Lead: New Tech Project inquiry', time: '13 minutes ago', status: 'pending' },
  { id: 2, type: 'update', title: "Project Update: 'Client X' kickoff", time: '15 minutes ago', status: 'done' },
  { id: 3, type: 'invoice', title: 'Invoice #102 Sent to Client Y', time: '18 minutes ago', status: 'invoice' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('All');
  
  // State to hold your live performance metrics from Google
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ views: 0, searches: 0 });

  // Fetch the data from your API route on component mount
  useEffect(() => {
    async function fetchLiveMetrics() {
      try {
        const response = await fetch('/api/performance');
        const result = await response.json();

        if (result.success && result.metrics) {
          // --- PARSE GOOGLE DATA ---
          // Google API returns multiDailyMetricsTimeSeries. This maps it into Recharts format:
          // [{ name: 'Jan', views: 240, searches: 42 }, ...]
          const formattedData = transformGoogleMetrics(result.metrics);
          setPerformanceData(formattedData);
          
          // Calculate overall totals dynamically for your cards
          const totalViews = formattedData.reduce((acc, curr) => acc + curr.views, 0);
          const totalSearches = formattedData.reduce((acc, curr) => acc + curr.searches, 0);
          setTotals({ views: totalViews, searches: totalSearches });
        } else {
          // Fallback to demo data if the API isn't fully configured/linked yet
          useFallbackData();
        }
      } catch (err) {
        console.error("Failed fetching live metrics, utilizing local fallback:", err);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    }

    function useFallbackData() {
      setPerformanceData([
        { name: 'Dec', views: 180, searches: 30 },
        { name: 'Jan', views: 240, searches: 42 },
        { name: 'Feb', views: 290, searches: 38 },
        { name: 'Mar', views: 310, searches: 45 },
        { name: 'Apr', views: 332, searches: 50 },
        { name: 'May', views: 305, searches: 48 },
      ]);
      setTotals({ views: 332, searches: 50 });
    }

    fetchLiveMetrics();
  }, []);

  // Helper parser to format Google's structural time-series data array into simple key-values
  function transformGoogleMetrics(googleData: any) {
    if (!googleData.multiDailyMetricTimeSeries) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap: { [key: string]: { views: number; searches: number } } = {};

    googleData.multiDailyMetricTimeSeries.forEach((series: any) => {
      const metricName = series.dailyMetric; // e.g. BUSINESS_IMPRESSIONS_DESKTOP_SEARCH
      
      series.dailyMetricTimeSeries.forEach((point: any) => {
        const dateObj = point.date; // { year: 2026, month: 5, day: 20 }
        if (!dateObj) return;
        
        const key = `${dateObj.year}-${dateObj.month}`;
        if (!monthlyMap[key]) {
          monthlyMap[key] = { views: 0, searches: 0 };
        }

        const value = parseInt(point.value || 0, 10);
        if (metricName.includes('SEARCH')) {
          monthlyMap[key].searches += value;
        } else {
          monthlyMap[key].views += value;
        }
      });
    });

    return Object.entries(monthlyMap).map(([key, val]) => {
      const [_, monthNum] = key.split('-');
      return {
        name: months[parseInt(monthNum, 10) - 1] || key,
        views: val.views,
        searches: val.searches
      };
    }).slice(-6); // Grab last 6 months
  }

  return (
    <div className="min-h-screen bg-[#061414] text-slate-100 font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#030b0b]/60 border-r border-teal-950/40 backdrop-blur-md flex flex-col justify-between p-4 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
              {"</>"}
            </div>
            <div>
              <h1 className="font-bold tracking-wide text-sm bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Codevenient
              </h1>
              <p className="text-[10px] text-teal-500 font-medium tracking-widest uppercase">Consulting</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-cyan-400 text-sm font-medium transition-all">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-teal-950/20 text-sm font-medium transition-all">
              <Users size={18} />
              <span>CRM</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-teal-950/20 text-sm font-medium transition-all">
              <FolderSync size={18} />
              <span>Projects</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-teal-950/20 text-sm font-medium transition-all">
              <Receipt size={18} />
              <span>Invoicing</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-teal-950/20 text-sm font-medium transition-all">
              <TrendingUp size={18} />
              <span>Performance</span>
            </a>
          </nav>
        </div>

        <div className="border-t border-teal-950/40 pt-4">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-teal-950/20 text-sm font-medium transition-all">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full space-y-6">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-teal-950/30 pb-5">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search projects, leads..." 
              className="w-full bg-[#091a1a]/80 border border-teal-950/60 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-slate-200 placeholder-slate-500"
            />
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <button className="p-2.5 rounded-xl bg-[#091a1a]/80 border border-teal-950/60 text-slate-400 hover:text-slate-200 relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 bg-[#091a1a]/40 px-3 py-1.5 rounded-xl border border-teal-950/30">
              <div className="text-right">
                <p className="text-xs text-slate-400">Hi Bongani!</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-[#061414] rounded-[10px] flex items-center justify-center text-xs font-bold text-teal-400">
                  BN
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- SUBHEADER TABS --- */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-white">My Dashboard</h2>
          <div className="flex bg-[#040e0e] p-1 rounded-xl border border-teal-950/50">
            {['All', 'Withdrawal', 'Savings', 'Deposit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-teal-500/20 text-cyan-400 border border-teal-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* MAIN CHART CARD */}
            <div className="bg-[#040e0e]/60 border border-teal-950/40 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-300">
                    Performance History {loading && <span className="text-xs text-teal-500 animate-pulse ml-2">(Syncing live API...)</span>}
                  </h3>
                  <p className="text-xs text-slate-500">views vs. searches</p>
                </div>
                <span className="text-[11px] text-slate-400 bg-teal-950/30 px-2.5 py-1 rounded-md border border-teal-900/40">
                  Live Stream
                </span>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#115e59" fontSize={11} tickLine={false} />
                    <YAxis stroke="#115e59" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#040e0e', borderColor: '#115e59', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b slate-400' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="searches" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSearches)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DONUT CHART */}
              <div className="bg-[#040e0e]/60 border border-teal-950/40 rounded-2xl p-5 flex flex-col justify-between">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Client Distribution</h3>
                <div className="flex items-center justify-between h-40">
                  <div className="w-1/2 h-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientDistribution}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {clientDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <p className="text-xl font-bold text-white">10</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Active Clients</p>
                    </div>
                  </div>
                  <div className="w-1/2 space-y-2.5 pl-4">
                    {clientDistribution.map((client, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: client.color }}></span>
                          <span className="text-slate-400">{client.name}</span>
                        </div>
                        <span className="font-semibold text-slate-200">{client.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STAT GROWTH BLOCK */}
              <div className="bg-[#040e0e]/60 border border-teal-950/40 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <h3 className="text-sm font-medium text-slate-300">Projected Performance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Calculated metric value</p>
                </div>
                <div className="my-4">
                  <div className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200">
                    +15%
                  </div>
                  <p className="text-xs text-teal-400 font-medium flex items-center gap-1 mt-1">
                    Expected views conversion MoM
                  </p>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] text-teal-950/10 pointer-events-none">
                  <TrendingUp size={140} />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN BLOCKS */}
          <div className="space-y-6">
            
            {/* DYNAMIC GOOGLE PROFILE METRICS CARD */}
            <div className="bg-[#040e0e]/60 border border-teal-950/40 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-slate-300">Key Performance Metrics</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#061414] border border-teal-950/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Strength</p>
                  <p className="text-lg font-bold text-cyan-400 mt-1">82%</p>
                </div>
                <div className="bg-[#061414] border border-teal-950/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Interactions</p>
                  <p className="text-lg font-bold text-purple-400 mt-1">1</p>
                </div>
                <div className="bg-[#061414] border border-teal-950/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Searches</p>
                  <p className="text-lg font-bold text-emerald-400 mt-1">{totals.searches}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-950/30 to-purple-950/20 border border-teal-900/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total System Views</p>
                  <p className="text-xl font-bold text-white mt-0.5">{totals.views}</p>
                </div>
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY & CRM ACTIONS */}
            <div className="bg-[#040e0e]/60 border border-teal-950/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Recent Activity / Leads</h3>
                <a href="#" className="text-xs text-cyan-400 hover:underline">View All</a>
              </div>

              <div className="space-y-3">
                {recentActivity.map((act) => (
                  <div key={act.id} className="group relative bg-[#061414]/80 border border-teal-950/50 p-3 rounded-xl flex items-start gap-3 hover:border-teal-500/30 transition-all">
                    <div className="mt-0.5">
                      {act.status === 'done' && <CheckCircle2 size={15} className="text-emerald-400" />}
                      {act.status === 'pending' && <Clock size={15} className="text-amber-400 animate-pulse" />}
                      {act.status === 'invoice' && <FileText size={15} className="text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{act.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{act.time}</p>
                    </div>

                    {act.type === 'lead' && (
                      <div className="hidden group-hover:flex absolute right-2 top-2 bg-[#040e0e] border border-teal-800 rounded-lg p-1 shadow-xl gap-1">
                        <button className="text-[9px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40 hover:bg-emerald-900">
                          Accept
                        </button>
                        <button className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 hover:bg-slate-800">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TEAM CONTRIBUTORS CARD */}
            <div className="bg-[#040e0e]/60 border border-teal-950/40 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-medium text-slate-300">Team / Contributors</h3>
              <p className="text-xs text-slate-500">Manage your consulting network team.</p>
              
              <div className="flex items-center gap-2 pt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#040e0e] bg-purple-600 flex items-center justify-center font-bold text-[10px] text-white">JD</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#040e0e] bg-cyan-600 flex items-center justify-center font-bold text-[10px] text-white">AM</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#040e0e] bg-emerald-600 flex items-center justify-center font-bold text-[10px] text-white">TL</div>
                </div>
                <button className="text-xs text-slate-400 hover:text-cyan-400 ml-2 border border-dashed border-teal-900/60 hover:border-teal-500/40 px-2.5 py-1 rounded-lg transition-all">
                  + Invite Partner
                </button>
              </div>
            </div>

          </div>
        </div>

        <footer className="w-full bg-gradient-to-r from-teal-950/40 to-transparent border border-teal-950/70 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-400">
          <p>
            <span className="text-cyan-400 font-medium">Recommended Action:</span> Update services descriptions to optimize high intent local search discovery metrics.
          </p>
          <button className="text-teal-400 hover:text-teal-300 font-medium underline shrink-0 hidden sm:block">
            Optimize Profile
          </button>
        </footer>

      </main>
    </div>
  );
}