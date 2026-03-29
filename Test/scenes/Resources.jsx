import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Wrench, 
  Zap, 
  ArrowRight, 
  Moon, 
  Sun, 
  Layout, 
  Code2, 
  Server, 
  Globe,
  Monitor,
  CheckCircle2,
  FileCode2,
  GitBranch,
  Terminal,
  Activity
} from 'lucide-react';

// --- Custom Components ---

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2 rounded-lg bg-[#155dfc1a] text-[#155dfc]">
      <Icon size={20} />
    </div>
    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const TechCard = ({ title, desc, tag, icon: Icon, delay }) => (
  <div 
    className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl hover:shadow-xl hover:shadow-[#155dfc0a] transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#155dfc] group-hover:text-white transition-colors duration-300">
        <Icon size={20} />
      </div>
      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#155dfc1a] text-[#155dfc]">
        {tag}
      </span>
    </div>
    <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
      {desc}
    </p>
  </div>
);

const ArchitectureStep = ({ number, title, desc, icon: Icon }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="relative mb-4">
      <div className="w-14 h-14 rounded-full bg-[#155dfc] text-white flex items-center justify-center shadow-lg shadow-[#155dfc33]">
        <Icon size={24} />
      </div>
      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center">
        {number}
      </div>
    </div>
    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{title}</h4>
    <p className="text-[11px] text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

export default function Resources() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[30%] bg-[#155dfc08] blur-[100px]" />
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform"
      >
        {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
      </button>

      <main className="relative max-w-6xl mx-auto px-8 py-16">
        
        {/* --- REFINED HERO SECTION --- */}
        <section className="mb-24 pt-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#155dfc1a] text-[#155dfc] text-[11px] font-bold uppercase tracking-widest mb-6">
            <Cpu size={12} />
            <span>Stack Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Technologies Behind Evalon
          </h1>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              A precise selection of industry-standard tools and frameworks engineered to deliver a high-performance examination experience.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed pt-1 border-l border-slate-200 dark:border-slate-800 pl-6">
              Evalon leverages a decoupled full-stack architecture. We prioritize type-safety, asynchronous processing, and low-latency data retrieval to ensure 24/7 reliability for global academic institutions.
            </p>
          </div>
        </section>

        {/* --- FRONTEND --- */}
        <section className="mb-24">
          <SectionTitle icon={Layout}>Frontend Stack</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TechCard 
              icon={Code2} 
              title="React.js" 
              tag="Engine" 
              desc="Component-based UI logic for maintaining complex application states."
            />
            <TechCard 
              icon={Zap} 
              title="Vite" 
              tag="Tooling" 
              desc="Lightning-fast build engine for optimized asset delivery."
            />
            <TechCard 
              icon={Layers} 
              title="Tailwind CSS" 
              tag="Styling" 
              desc="Utility-first styling system for consistent, responsive interfaces."
            />
            <TechCard 
              icon={Globe} 
              title="Modern Web" 
              tag="Core" 
              desc="ES6+ and semantic HTML5 for broad browser compatibility."
            />
          </div>
        </section>

        {/* --- BACKEND --- */}
        <section className="mb-24">
          <SectionTitle icon={Server}>Backend Architecture</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard 
              icon={Activity} 
              title="Node.js" 
              tag="Runtime" 
              desc="Event-driven I/O for handling high-concurrency exam traffic."
            />
            <TechCard 
              icon={FileCode2} 
              title="Express.js" 
              tag="Middleware" 
              desc="Modular routing and API structure for scalable services."
            />
            <TechCard 
              icon={ArrowRight} 
              title="RESTful Services" 
              tag="Protocol" 
              desc="Secure communication layer for frontend-to-backend data sync."
            />
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <span className="text-[#155dfc] font-bold text-xs uppercase tracking-widest block mb-2">Security</span>
                <p className="text-xs text-slate-500">Stateless JWT authentication with encrypted payloads and Bcrypt password salting.</p>
              </div>
              <div>
                <span className="text-[#155dfc] font-bold text-xs uppercase tracking-widest block mb-2">Routing</span>
                <p className="text-xs text-slate-500">Express-powered middleware for request validation and role-based access control.</p>
              </div>
              <div>
                <span className="text-[#155dfc] font-bold text-xs uppercase tracking-widest block mb-2">Processing</span>
                <p className="text-xs text-slate-500">Asynchronous handling of student submissions to prevent server bottlenecks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- DATABASE & AUTH --- */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <section>
            <SectionTitle icon={Database}>Data Management</SectionTitle>
            <div className="space-y-4">
              <TechCard 
                icon={Database} 
                title="MongoDB" 
                tag="Storage" 
                desc="Distributed NoSQL database for flexible exam schema management."
              />
              <TechCard 
                icon={Layers} 
                title="Mongoose" 
                tag="ODM" 
                desc="Object modeling for enforced data integrity and validation."
              />
            </div>
          </section>

          <section>
            <SectionTitle icon={ShieldCheck}>Access Control</SectionTitle>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ul className="space-y-3">
                {[
                  "Role-based Access Control (RBAC)",
                  "Multi-tier Teacher/Student hierarchy",
                  "Secure session management via JWT",
                  "Cross-Origin Resource Sharing (CORS) protection"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={16} className="text-[#155dfc] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* --- SYSTEM ARCHITECTURE --- */}
        <section className="mb-24 py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">System Infrastructure</h2>
            <p className="text-sm text-slate-500">End-to-end data lifecycle</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between max-w-3xl mx-auto gap-8 md:gap-2">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800 -translate-y-8" />
            
            <ArchitectureStep number="1" title="Client" desc="React Application" icon={Monitor} />
            <ArchitectureStep number="2" title="API Gateway" desc="Node/Express Server" icon={Terminal} />
            <ArchitectureStep number="3" title="Persistence" desc="MongoDB Cluster" icon={Database} />
            <ArchitectureStep number="4" title="Deployment" desc="Render / Cloud" icon={Cloud} />
          </div>
        </section>

        {/* --- PERFORMANCE --- */}
        <section className="mb-24 grid md:grid-cols-2 gap-8 items-center bg-slate-900 dark:bg-black rounded-3xl p-10 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-4">Scalability Metrics</h2>
            <p className="text-slate-400 text-sm mb-6">Our tech stack is optimized for high-stakes environments where latency and downtime are not options.</p>
            <div className="flex gap-8">
              <div>
                <span className="text-2xl font-bold text-[#155dfc]">99.9%</span>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Uptime</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#155dfc]">&lt;200ms</span>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">API Latency</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Zap size={16} className="mx-auto mb-2 text-[#155dfc]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vite Speed</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Activity size={16} className="mx-auto mb-2 text-[#155dfc]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Real-time</span>
            </div>
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="text-center py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold mb-6">Ready to Scale?</h2>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2.5 bg-[#155dfc] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
              View Features
            </button>
            <button className="px-6 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
              Source Code
            </button>
          </div>
        </section>

      </main>

      <footer className="max-w-6xl mx-auto px-8 py-10 text-center border-t border-slate-100 dark:border-slate-900">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Evalon Engineering Platform 2024</p>
      </footer>
    </div>
  );
}