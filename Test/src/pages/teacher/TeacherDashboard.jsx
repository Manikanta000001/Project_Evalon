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
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";

// import { performanceData, gradeDistribution, COLORS } from "../../data/mockData"; check
import { COLORS } from "../../data/mockData";

import { useOutletContext } from "react-router-dom";
export default function TeacherDashboard() {
  // 🔥 get dark mode value from DashboardLayout
  const { dark: isDarkMode, setActiveTab } = useOutletContext() || {};
  const [dashboardData, setDashboardData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  // const location = useLocation();

  useEffect(() => {
  
    const fetchDashboard = async () => {
      const token = JSON.parse(localStorage.getItem("userdata"))?.token;

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/teacher",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

     
      setDashboardData(res.data);

      setTimeout(() => {
        setShowChart(true);
      }, 400); // delay animation slightly
    };

    fetchDashboard();
  }, []);



  console.log(dashboardData);
  const navigate = useNavigate();
  if (!dashboardData) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ---------- Top Statistic Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={dashboardData.totalStudents}
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={CheckCircle}
          label="Exams Completed"
          value={dashboardData.examsCompleted}
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={Clock}
          label="Avg. Score"
          value={dashboardData.avgScore}
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={GraduationCap}
          label="Success Rate"
          value={`${dashboardData.successRate}%`}
          isDarkMode={isDarkMode}
        />
      </div>


      {/* ---------- Charts Row ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card
            title="Student Performance Over Time"
            subtitle="Class average vs Engagement level"
            isDarkMode={isDarkMode}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {/* <AreaChart data={performanceData}> check */}
                {showChart && dashboardData?.performanceData?.length > 0 && (
                  <AreaChart

                    data={dashboardData?.performanceData || []}
                  >
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#4f46e5"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4f46e5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={isDarkMode ? "#334155" : "#f1f5f9"}
                    />

                    <XAxis dataKey="name" />
                    <YAxis />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#020617" : "#ffffff",
                        borderRadius: 12,
                        border: "none",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="average"
                      stroke="#4f46e5"
                      fillOpacity={1}
                      fill="url(#colorAvg)"
                      strokeWidth={3}
                      isAnimationActive={true}
                      animationDuration={1200}
                    />

                    <Area
                      type="monotone"
                      dataKey="participation"
                      stroke="#10b981"
                      fillOpacity={0}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      isAnimationActive={true}
                      animationDuration={1200}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Grade Distribution Pie */}
        <div>
          <Card
            title="Grade Distribution"
            subtitle="Last Exam Results"
            isDarkMode={isDarkMode}
          >
            <div className="h-80 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  {/* <Pie data={gradeDistribution} innerRadius={60} outerRadius={80} dataKey="value"> */}
                  {/* <Pie data={dashboardData?.gradeDistribution || []}>
                    {dashboardData?.gradeDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie> */}
                  <Pie
                    data={dashboardData?.gradeDistribution || []}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {dashboardData?.gradeDistribution?.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {dashboardData?.gradeDistribution?.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: COLORS[i] }}
                    />
                    <span>
                      {g.name}: {g.value}%
                    </span>
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
        <Card title="Teacher Actions" isDarkMode={isDarkMode}>
          <div className="space-y-4">
            {[
              {
                name: "Create Assessment",
                status: "Active",
                students: "Generate a new test or assignment",

              },
              {
                name: "Generate Question Paper",
                status: "Closed",
                students: "Auto-generate paper from question bank",
              },
              {
                name: "Upload Question Bank",
                status: "Draft",
                students: "Import questions via Excel/CSV",
              },
            ].map((exam, i) => (
              <div key={i} className="flex justify-between p-3 rounded-lg">
                <div className="flex gap-3">
                  <FileText size={18} />
                  <div>
                    <div>{exam.name}</div>
                    <div className="text-xs text-slate-500">
                      {exam.students} students
                    </div>
                  </div>
                </div>
                <div className="text-xs">{exam.time}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Question Bank Summary */}
        <Card title="Assessment Overview" isDarkMode={isDarkMode}>
          <div className="text-center grid grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-brandBlue-500">{dashboardData?.assessmentStats?.created}</p>
              <p className="text-xs">Assessments Created</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-brandBlue-500">{dashboardData?.assessmentStats?.active}</p>
              <p className="text-xs">Active Exams</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-brandBlue-500">{dashboardData?.assessmentStats?.completed}</p>
              <p className="text-xs">Completed</p>
            </div>
          </div>

          <button onClick={() => navigate("/teacher/students")} className="mt-4 w-full flex items-center justify-center gap-2 bg-brandBlue-600 text-white py-2 rounded-lg">
            View Assessments
            <ChevronRight size={16} />
          </button>
        </Card>
      </div>
    </div>
  );
}
