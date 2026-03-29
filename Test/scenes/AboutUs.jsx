import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Crown, 
  Linkedin, 
  Github, 
  UserCheck, 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  Eye, 
  Twitter, 
  Instagram 
} from 'lucide-react';

const AboutUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  // Theme Toggler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-element');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const revealClass = (id) => 
    `transition-all duration-1000 transform ${
      isVisible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`;

  const brandBlue = "#155dfc";
  const brandBlueSoft = "#155dfc1a";

  return (
    <div className={`${isDarkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-white text-gray-900'} min-h-screen transition-colors duration-500 font-sans`}>
      
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
        >
          {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-blue-600" />}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-6 lg:px-24 overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10 -z-10" style={{ backgroundImage: `radial-gradient(${brandBlue} 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
        
        <div id="hero" className={`reveal-element max-w-4xl ${revealClass('hero')}`}>
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider uppercase rounded-full" style={{ backgroundColor: brandBlueSoft, color: brandBlue }}>
            Project Evalon
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-left leading-tight">
            Meet the Team Behind Evalon
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-4 font-medium text-left">
            A passionate group of Computer Science engineers building a smarter way to conduct examinations.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl text-left">
            Developed as a final year project, Evalon aims to transform traditional examination systems into a seamless digital experience.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-6 lg:px-24 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl">
          <h2 id="who-title" className={`reveal-element text-4xl font-bold mb-8 text-left ${revealClass('who-title')}`}>Who We Are</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div id="who-text" className={`reveal-element ${revealClass('who-text')}`}>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                We are a team of <span className="font-semibold" style={{ color: brandBlue }}>Computer Science Engineering</span> students from <span className="font-semibold">Narayana Engineering College</span>, graduating in <span className="font-semibold" style={{ color: brandBlue }}>2026</span>.
              </p>
              <p className="text-lg mt-6 leading-relaxed text-slate-600 dark:text-slate-300">
                As part of our final year project, we collaborated to design and develop <span className="font-bold">Evalon</span>, an AI-assisted examination platform that simplifies exam creation, evaluation, and analysis for educational institutions.
              </p>
            </div>
            <div id="who-stats" className={`reveal-element grid grid-cols-2 gap-4 ${revealClass('who-stats')}`}>
              <div className="h-32 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30" style={{ backgroundColor: brandBlueSoft }}>
                <div className="text-center">
                  <span className="block text-3xl font-bold" style={{ color: brandBlue }}>2026</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Graduating Year</span>
                </div>
              </div>
              <div className="h-32 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30" style={{ backgroundColor: brandBlueSoft }}>
                <div className="text-center">
                  <span className="block text-3xl font-bold" style={{ color: brandBlue }}>CSE</span>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Department</span>
                </div>
              </div>
              <div className="col-span-2 h-32 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <div className="text-center text-white">
                  <span className="block text-3xl font-bold">Innovation</span>
                  <span className="text-xs uppercase tracking-widest opacity-80">Driven by Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 px-6 lg:px-24">
        <h2 id="team-title" className={`reveal-element text-4xl font-bold mb-16 text-left ${revealClass('team-title')}`}>Our Team</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "V. Manikanta",
              role: "Team Lead • Backend Developer",
              desc: "Leads the overall development of Evalon and is responsible for designing and implementing the backend architecture.",
              lead: true,
              seed: "Manikanta"
            },
            {
              name: "Manodai",
              role: "Frontend Developer",
              desc: "Responsible for crafting the user interface and user experience of Evalon using modern frontend technologies.",
              seed: "Manodai"
            },
            {
              name: "Samuel",
              role: "Backend Developer",
              desc: "Supports backend development by working on APIs, server logic, and ensuring smooth system integration.",
              seed: "Samuel"
            },
            {
              name: "Sheren",
              role: "Database Manager",
              desc: "Manages the database design and structure. Ensures efficient data storage and integrity across the platform.",
              seed: "Sheren"
            }
          ].map((member, idx) => (
            <div 
              key={idx}
              id={`member-${idx}`}
              className={`reveal-element flex flex-col items-center text-center p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${revealClass(`member-${idx}`)} ${
                member.lead ? 'border-2 border-blue-500/20 ring-4 ring-blue-500/5' : 'border border-gray-100 dark:border-gray-800'
              } ${isDarkMode ? 'bg-gray-900/40' : 'bg-white/70 backdrop-blur-md'}`}
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 border-4 border-white dark:border-gray-800 shadow-md">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {member.lead && (
                  <div className="absolute -bottom-2 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <Crown className="w-4 h-4" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold mb-4 uppercase tracking-wider" style={{ backgroundColor: brandBlueSoft, color: brandBlue }}>
                {member.role}
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">
                {member.desc}
              </p>
              <div className="flex space-x-4">
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-slate-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evalon Features */}
      <section className="py-24 px-6 lg:px-24 bg-slate-50 dark:bg-slate-900/50">
        <h2 id="evalon-title" className={`reveal-element text-4xl font-bold mb-12 text-left ${revealClass('evalon-title')}`}>About Evalon</h2>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div id="evalon-content" className={`reveal-element ${revealClass('evalon-content')}`}>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Evalon is an AI-assisted examination platform designed to streamline the entire examination workflow — from question bank creation to final result analysis.
            </p>
            <div className="space-y-6">
              {[
                { icon: UserCheck, title: "Comprehensive Roles", text: "Tailored dashboards for Students, Teachers, HODs, and Principals." },
                { icon: BarChart3, title: "Advanced Analytics", text: "Automated evaluation and deep performance insights for institutions." },
                { icon: ShieldCheck, title: "Security & Fairness", text: "AI-driven proctoring to ensure the integrity of academic evaluations." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 group">
                  <div className="p-3 rounded-xl transition-colors bg-blue-600/10 group-hover:bg-blue-600">
                    <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div id="evalon-visual" className={`reveal-element ${revealClass('evalon-visual')}`}>
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-blue-100 shadow-xl'}`}>
              <div className="flex justify-between items-center mb-6">
                <h5 className="font-bold">Institutional Dashboard</h5>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">LIVE SYSTEM</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 rounded-xl" style={{ backgroundColor: brandBlueSoft }}></div>
                  <div className="h-20 rounded-xl" style={{ backgroundColor: brandBlueSoft }}></div>
                  <div className="h-20 rounded-xl" style={{ backgroundColor: brandBlueSoft }}></div>
                </div>
                <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 lg:px-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div id="mission" className={`reveal-element p-10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/20 ${revealClass('mission')}`} style={{ backgroundColor: brandBlueSoft }}>
            <div className="mb-6 inline-flex p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-left">Our Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              To simplify and modernize the examination process by leveraging technology, ensuring fairness, transparency, and efficiency for educational institutions.
            </p>
          </div>
          <div id="vision" className={`reveal-element p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800 ${revealClass('vision')}`}>
            <div className="mb-6 inline-flex p-4 bg-slate-800 rounded-2xl shadow-sm">
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white text-left">Our Vision</h2>
            <p className="text-lg text-slate-400">
              To become a smart, scalable, and AI-driven examination platform used across institutions for seamless academic evaluation worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-24 border-t border-slate-100 dark:border-slate-800 text-center">
        <h2 id="footer-title" className={`reveal-element text-3xl font-bold mb-8 ${revealClass('footer-title')}`}>Let's Build the Future of Examinations Together</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Contact Us
          </button>
          <button className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Explore Platform
          </button>
        </div>
        <div className="flex justify-center space-x-6 mb-8">
          <Twitter className="w-6 h-6 text-slate-400 hover:text-blue-600 cursor-pointer" />
          <Instagram className="w-6 h-6 text-slate-400 hover:text-blue-600 cursor-pointer" />
          <Linkedin className="w-6 h-6 text-slate-400 hover:text-blue-600 cursor-pointer" />
        </div>
        <p className="text-slate-400 text-sm">© 2026 Evalon Project Team. Narayana Engineering College.</p>
      </footer>
    </div>
  );
};

export default AboutUs;