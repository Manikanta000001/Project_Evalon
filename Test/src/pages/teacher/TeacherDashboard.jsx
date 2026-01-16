// src/pages/teacher/TeacherDashboard.jsx

import React from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import Card from "../../components/Card";
import StatCard from "../../components/StatCard";

import { performanceData, gradeDistribution, COLORS } from "../../data/mockData";

import { useOutletContext } from "react-router-dom";

export default function TeacherDashboard() {

  // 🔥 get dark mode value from DashboardLayout
  const { dark: isDarkMode, setActiveTab } = useOutletContext() || {};


  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ---------- Top Statistic Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value="1,248" trend="+12%" trendUp isDarkMode={isDarkMode} />
        <StatCard icon={CheckCircle} label="Exams Completed" value="854" trend="+5%" trendUp isDarkMode={isDarkMode} />
        <StatCard icon={Clock} label="Avg. Time spent" value="45m" trend="-2m" trendUp={false} isDarkMode={isDarkMode} />
        <StatCard icon={GraduationCap} label="Success Rate" value="92%" trend="+3%" trendUp isDarkMode={isDarkMode} />
      </div>


      {/* ---------- Charts Row ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card title="Student Performance Over Time" subtitle="Class average vs Engagement level" isDarkMode={isDarkMode}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false}
                    stroke={isDarkMode ? '#334155' : '#f1f5f9'} />

                  <XAxis dataKey="name" />
                  <YAxis />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#020617' : '#ffffff',
                      borderRadius: 12,
                      border: 'none'
                    }}
                  />

                  <Area type="monotone" dataKey="average" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAvg)" strokeWidth={3}/>
                  <Area type="monotone" dataKey="participation" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>


        {/* Grade Distribution Pie */}
        <div>
          <Card title="Grade Distribution" subtitle="Last Semester Results" isDarkMode={isDarkMode}>
            <div className="h-80 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={gradeDistribution} innerRadius={60} outerRadius={80} dataKey="value">
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {gradeDistribution.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span>{g.name}: {g.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

      </div>


      {/* ---------- Recent Exams & Question Bank ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Exam Activity */}
        <Card title="Recent Exam Activity" isDarkMode={isDarkMode}>
          <div className="space-y-4">
            {[
              { name: "Final Calculus Quiz", status: "Active", students: 120, time: "2h left" },
              { name: "World War II History", status: "Closed", students: 95, time: "Yesterday" },
              { name: "Organic Chemistry", status: "Draft", students: 0, time: "Last edited 1h ago" }
            ].map((exam, i) => (
              <div key={i} className="flex justify-between p-3 rounded-lg">
                <div className="flex gap-3">
                  <FileText size={18} />
                  <div>
                    <div>{exam.name}</div>
                    <div className="text-xs text-slate-500">{exam.students} students</div>
                  </div>
                </div>
                <div className="text-xs">{exam.time}</div>
              </div>
            ))}
          </div>
        </Card>


        {/* Question Bank Summary */}
        <Card title="Question Bank Status" isDarkMode={isDarkMode}>
          <div className="text-center grid grid-cols-3">

            <div>
              <p className="text-2xl font-bold text-brandBlue-500">420</p>
              <p className="text-xs">MCQs</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-brandBlue-500">150</p>
              <p className="text-xs">Essays</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-brandBlue-500">28</p>
              <p className="text-xs">Categories</p>
            </div>
          </div>

          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-brandBlue-600 text-white py-2 rounded-lg">
            Manage Repository
            <ChevronRight size={16} />
          </button>
        </Card>

      </div>

    </div>
  );
}
