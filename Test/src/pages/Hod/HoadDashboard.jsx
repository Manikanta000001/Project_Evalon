import React, { useState, useMemo,useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Search, 
  User, 
  Filter, 
  RefreshCcw,
  Calendar,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * HOD Approval Dashboard
 * Integrated with useOutletContext for theme management.
 * Uses isDarkMode boolean directly for conditional styling.
 */

const HoadDashboard = () => {
  // Theme state from parent layout
  const { dark: isDarkMode } = useOutletContext() || {};

const [documents, setDocuments] = useState([]);
const [stats, setStats] = useState({});
const statusLabelMap = {
  SUBMITTED: "Submitted",
  HOD_APPROVED: "Approved",
  HOD_REJECTED: "Rejected",
  PAPER_GENERATED: "Paper Generated"
};
const statusFilters = [
  { label: "All", value: "All" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Approved", value: "HOD_APPROVED" },
  { label: "Rejected", value: "HOD_REJECTED" }
];
useEffect(() => {

  const fetchDashboard = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/dashboard/hod",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setDocuments(res.data.questionBanks);
    setStats(res.data.stats);
  };

  fetchDashboard();

}, []);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');



  const chartData = [
    { name: 'Approved', value: stats.approved, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === 'All' || doc.status === filter;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.uploadedBy?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

const getStatusColor = (status) => {

  if (isDarkMode) {

    switch(status){

      case "HOD_APPROVED":
        return "bg-emerald-900/20 text-emerald-400 border-emerald-800";

      case "HOD_REJECTED":
        return "bg-rose-900/20 text-rose-400 border-rose-800";

      case "SUBMITTED":
        return "bg-amber-900/20 text-amber-400 border-amber-800";

      case "PAPER_GENERATED":
        return "bg-blue-900/20 text-blue-400 border-blue-800";

      default:
        return "";
    }

  }

  switch(status){

    case "HOD_APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "HOD_REJECTED":
      return "bg-rose-50 text-rose-700 border-rose-200";

    case "SUBMITTED":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "PAPER_GENERATED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    default:
      return "";
  }

};

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <nav className={`fixed left-0 top-0 h-full w-64 border-r hidden lg:block z-10 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>EduApprove</span>
          </div>
          <ul className="space-y-2">
            <li className={`p-3 rounded-lg font-medium flex items-center gap-3 cursor-pointer ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
              <Clock className="w-5 h-5" /> Dashboard
            </li>
            <li className={`p-3 rounded-lg font-medium flex items-center gap-3 cursor-pointer transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
              <BarChart2 className="w-5 h-5" /> Analytics
            </li>
            <li className={`p-3 rounded-lg font-medium flex items-center gap-3 cursor-pointer transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
              <User className="w-5 h-5" /> Faculty
            </li>
          </ul>
        </div>
      </nav>

      <main className="lg:mb-4  ">


        {/* Top Row: Stats & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-blue-600', bg: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100' },
              { label: 'Pending Action', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-100' },
              { label: 'Approval Rate', value: `${Math.round(((stats.approved || 0) / (stats.total || 1)) * 100)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-100' },
              { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-600', bg: isDarkMode ? 'bg-rose-900/20' : 'bg-rose-100' },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <div className={`${item.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.value}</p>
                <p className="text-sm text-slate-500 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
             
            className={`p-6 rounded-2xl border shadow-sm flex flex-col transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              <BarChart2 className="w-4 h-4 text-blue-600" /> Approval Distribution
            </h3>
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDarkMode ? '#64748b' : '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDarkMode ? '#64748b' : '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#0f172a' : '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      color: isDarkMode ? '#fff' : '#000'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Filters and List */}
        <div className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row gap-4 items-center  shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {statusFilters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filter === item.value 
                    ? (isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                    : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50')
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80  ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  <th className="px-6 py-4">Document Details</th>
                  <th className="px-6 py-4">Faculty Member</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Subject</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
             
                  {filteredDocs.map((doc) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={doc._id} 
                      className={`transition-colors cursor-default group ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                            <FileText className="w-5 h-5 transition-colors" />
                          </div>
                          <div>
                            <p className={`font-bold line-clamp-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{doc.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {doc._id} </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{doc.uploadedBy?.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${getStatusColor(doc.status)}`}>
                          {statusLabelMap[doc.status] || doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            doc.priority === 'High' ? 'bg-rose-500 animate-pulse' : doc.priority === 'Medium' ? 'bg-amber-500' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-300')
                          }`} />
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{doc.subject}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HoadDashboard;