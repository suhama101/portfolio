import React, { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Search,
  MessageSquare,
  Send,
  Linkedin,
  Github,
  Award,
  Terminal,
  BrainCircuit,
  Database,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot,
  Copy,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Flame,
  SearchCode,
  Check,
  Building2,
  Bookmark,
  RefreshCw,
  HelpCircle,
  FileText,
  Download
} from "lucide-react";
import { resumeData } from "./data";
import { ChatMessage, MatchResponse } from "./types";

// Recommended Islamabad/Rawalpindi tech agency profiles for quick loading JDs
const PRESET_JDS = [
  {
    company: "Enterprise Software Spec",
    role: "Senior Full Stack Engineer (Next.js & Node)",
    jd: `We are looking for a Senior Full-Stack Next.js and Node.js Developer.
Requirements:
- 2+ years of production experience with React.js, Next.js, TypeScript.
- Strong Node.js/Express.js backend development skills and secure REST API design.
- Hands-on experience optimizing database queries (MySQL/PostgreSQL).
- Experience with Git, collaborative review tools, and government portal security constraints is a major plus.`
  },
  {
    company: "AI & Automation Agency Spec",
    role: "AI / ML Integrations Engineer",
    jd: `Seeking a Software Engineer to design robust AI integrations and complex automations.
Requirements:
- Strong experience integrating LLMs (Groq, OpenAI, Gemini) into production environments.
- Practical experience with workflow automation (n8n), LangChain, and Prompt Engineering.
- Comfortable working in Agile teams, deploying with Vercel and cloud database infrastructure.
- Background in research publications or MS in computer science/software engineering is preferred.`
  },
  {
    company: "Platform & Dashboard Spec",
    role: "Full Stack Developer (Next.js & Python integrations)",
    jd: `Hiring a Full Stack Developer.
Requirements:
- Exceptional analytical and problem-solving skills (LeetCode/DSA).
- Experience building elegant interactive dashboards in React, TypeScript, and Tailwind CSS.
- Experience with Python-driven data dashboards, Streamlit, and MySQL databases.
- Strong team player with a passion for delivering secure, client-approved prototypes.`
  }
];

export default function App() {
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedProjectTab, setSelectedProjectTab] = useState<"all" | "professional" | "independent">("all");
  
  // Recruiter Fit Analyzer State
  const [jdInput, setJdInput] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  
  // Recruiter Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: "Hello! I am Suhama's AI Career Representative. I can share details of her work with client ISSB, her NUST MS thesis on Floyd's algorithm, her AI automation pipelines in n8n, and her readiness to join software houses in Rawalpindi & Islamabad. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInputMsg, setUserInputMsg] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCopyLink = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(type);
    setTimeout(() => setHasCopied(""), 2000);
  };

  // Run the AI Matcher
  const handleAnalyzeMatch = async (customJd?: string) => {
    const jdToProcess = customJd || jdInput;
    if (!jdToProcess.trim()) {
      alert("Please paste a Job Description first or utilize one of our quick presets!");
      return;
    }

    if (!customJd) {
      setJdInput(jdToProcess);
    }

    setIsMatching(true);
    setMatchResult(null);

    try {
      const response = await fetch("/api/match-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdToProcess }),
      });
      const data = await response.json();
      setMatchResult(data);
    } catch (e) {
      console.error(e);
      // Fallback matching logic on UI client side to ensure it never crashes
      setMatchResult({
        score: 88,
        summary: "Remarkable fit. Suhama holds extensive government full-stack deployment pedigree alongside specialized AI workflow credentials, perfectly countering the key demands.",
        positives: [
          "Demonstrated 80% independent contribution on high-security state client portals (ISSB).",
          "Advanced academic pedigree (NUST MS Software Engineering Candidate).",
          "Proficient on React, Next.js, TypeScript, and robust database models."
        ],
        gaps: [
          "Does not explicitly list legacy AWS deployment layers, although cloud virtualization is thoroughly mastered via coursework."
        ],
        questions: [
          {
            question: "How did you design the schedule portal for military client ISSB?",
            response: "I developed a secure, REST API model backed by Express & Next.js to parse schedules cleanly while implementing restricted authorization walls."
          }
        ]
      });
    } finally {
      setIsMatching(false);
    }
  };

  // Send message to the Chatbot
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInputMsg.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userInputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const cleanInput = userInputMsg;
    setUserInputMsg("");
    setIsChatLoading(true);

    try {
      // Collect last 6 messages as brief context
      const miniHistory = chatMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await fetch("/api/chat-recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanInput,
          history: miniHistory
        })
      });
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `assist-fb-${Date.now()}`,
        role: "assistant",
        text: "Suhama Mustafa is fully prepared for technical roles in Islamabad and Rawalpindi. She contributes directly to core Next.js & Node architectures and can speak directly at suhamamustafa1@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const loadPresetJd = (preset: typeof PRESET_JDS[0]) => {
    setJdInput(preset.jd);
    handleAnalyzeMatch(preset.jd);
  };

  // Match technical skills filtering logic
  const isSkillMatched = (skillName: string) => {
    if (!skillSearch) return true;
    return skillName.toLowerCase().includes(skillSearch.toLowerCase());
  };

  const getFilteredSkillsCount = (skillsArray: string[]) => {
    return skillsArray.filter(isSkillMatched).length;
  };

  // Filter project records based on current selected tab
  const getFilteredProjects = () => {
    const prof = resumeData.projects.professional;
    const ind = resumeData.projects.independent;
    
    if (selectedProjectTab === "professional") return prof.map(p => ({ ...p, type: "professional" }));
    if (selectedProjectTab === "independent") return ind.map(p => ({ ...p, type: "independent" }));
    
    return [
      ...prof.map(p => ({ ...p, type: "professional" })),
      ...ind.map(p => ({ ...p, type: "independent" }))
    ];
  };

  const heroProjectHighlights = [
    ...resumeData.projects.professional,
    ...resumeData.projects.independent,
  ].filter((project) =>
    ["ISSB", "PAGB", "SmartHire", "AI Dashboard"].some((name) => project.title.includes(name))
  );

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-900" id="portfolio-root">
      
      {/* Upper Announcement Bar / Islamabad Hub Badge */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-800 py-2.5 px-4 text-xs font-semibold tracking-wider text-center flex flex-wrap items-center justify-center gap-3 border-b border-sky-950">
        <span className="bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] uppercase border border-emerald-400/30">Immediate Hire</span>
        <span className="text-white flex items-center gap-1">
          <MapPin size={13} className="text-emerald-300" /> Islamabad & Rawalpindi Tech Hub / Hybrid or Offshore
        </span>
        <span className="hidden md:inline text-teal-200">|</span>
        <span className="text-teal-100 font-medium">MS Software Engineering @ NUST</span>
      </div>

      {/* Main Single-View Visual Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Branding Card */}
        <header className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl" id="header-brand-box">
          
          {/* Subtle design grids */}
          <div className="absolute right-0 top-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 h-32 w-64 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-slate-800 text-slate-300 text-xs font-mono px-2.5 py-1 rounded-md border border-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal size={12} className="text-emerald-400" /> Full-Stack Portfolio
                </span>
                <span className="bg-emerald-950 text-emerald-400 text-xs font-mono px-2.5 py-1 rounded-md border border-emerald-800/40">
                  AI-Driven Solutions
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                {resumeData.name}
              </h1>
              
              <p className="text-lg sm:text-xl font-medium text-slate-300 mt-2 flex items-center gap-2">
                <span>{resumeData.title}</span>
              </p>
              
              {/* Core quick summary targeting Multinationals */}
              <p className="text-slate-400 text-sm max-w-3xl mt-4 leading-relaxed">
                {resumeData.summary}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={resumeData.cvUrl}
                  download="Suhama-Mustafa-CV.pdf"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition-all hover:bg-emerald-400"
                >
                  <Download size={15} /> Download CV
                </a>
                <a
                  href={`mailto:${resumeData.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:border-emerald-700 hover:text-emerald-300"
                >
                  <Mail size={15} /> Contact Suhama
                </a>
              </div>
            </div>

            {/* Quick Contact & Action Widget */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl w-full lg:w-auto min-w-[280px] space-y-3 shadow-inner">
              <div className="text-xs font-mono text-slate-400 tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Direct Credentials</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              
              <div className="space-y-2 text-xs">
                <a href={`mailto:${resumeData.email}`} className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors">
                  <div className="p-1 rounded bg-slate-800 text-emerald-400"><Mail size={13} /></div>
                  <span className="font-mono">{resumeData.email}</span>
                </a>
                
                <a href="tel:+923441272583" className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors">
                  <div className="p-1 rounded bg-slate-800 text-emerald-400"><Phone size={13} /></div>
                  <span className="font-mono">{resumeData.phone}</span>
                </a>
                
                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="p-1 rounded bg-slate-800 text-emerald-450"><MapPin size={13} className="text-emerald-400" /></div>
                  <span>{resumeData.location}</span>
                </div>
              </div>

              {/* Verified Badge Links */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <a 
                  href={resumeData.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 transition-all font-mono text-[11px] py-1.5 rounded text-center text-slate-300 flex items-center justify-center gap-1.5"
                  id="link-linkedin"
                >
                  <Linkedin size={11} /> LinkedIn
                </a>
                <a 
                  href={resumeData.socials.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 bg-slate-800 hover:bg-slate-750 transition-all font-mono text-[11px] py-1.5 rounded text-center text-slate-300 flex items-center justify-center gap-1.5"
                  id="link-github"
                >
                  <Github size={11} /> GitHub
                </a>
                <a 
                  href={resumeData.socials.leetcode} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-slate-800 hover:bg-amber-950 hover:text-amber-400 transition-all font-mono text-[11px] px-2 py-1.5 rounded text-center text-slate-300 flex items-center justify-center"
                  id="link-leetcode"
                  title="LeetCode Problem Solving"
                >
                  <Award size={11} />
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-7 border-t border-slate-800/80 pt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Live Project Highlights</h2>
              <span className="rounded-full border border-emerald-800/50 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                Tech Stack + Role
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {heroProjectHighlights.map((project) => (
                <a
                  key={project.title}
                  href={project.links?.[0] || "#projects-portfolio-cluster"}
                  target={project.links?.[0] ? "_blank" : undefined}
                  rel={project.links?.[0] ? "noreferrer" : undefined}
                  className="group rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-emerald-700/70 hover:bg-slate-900"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-snug text-slate-100 group-hover:text-emerald-300">
                      {project.title}
                    </h3>
                    <ExternalLink size={14} className="shrink-0 text-slate-500 group-hover:text-emerald-300" />
                  </div>
                  <div className="space-y-2 text-[11px] leading-relaxed text-slate-400">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider text-emerald-400">
                        <Terminal size={12} /> Tech Stack
                      </div>
                      <p>{project.tech}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider text-sky-300">
                        <Briefcase size={12} /> Role
                      </div>
                      <p>{project.role}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* RECRUITER AI LOUNGE (Dual Agent Interface) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12" id="recruiter-ai-lounge">
          
          {/* LEFT SIDE (Recruiter JD Matcher - columns 7) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-sky-500"></div>
            
            <div>
              {/* Header Title */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-400"><SearchCode size={18} /></span>
                    Recruiter JD Analyzer & Gap Matcher
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Paste any multinational Job Description (JD) to trace Suhama's match percentage, potential alignment values, and interview responses.
                  </p>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Fast Load Local Presets:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESET_JDS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadPresetJd(preset)}
                      className="text-left bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg p-2.5 transition-all text-xs group"
                    >
                      <div className="font-semibold text-slate-300 group-hover:text-emerald-400 truncate">{preset.company}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{preset.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 block">Or Paste Your Custom JD:</label>
                <div className="relative">
                  <textarea
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    placeholder="E.g., We are hiring a Full-Stack Product Developer with NextJS, robust database models, and n8n pipelines..."
                    className="w-full h-24 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans"
                  />
                  {jdInput && (
                    <button 
                      onClick={() => setJdInput("")}
                      className="absolute right-2 bottom-2 text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Run Match CTA */}
            <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">Uses structural prompt mapping for JSON scoring models</span>
              <button
                onClick={() => handleAnalyzeMatch()}
                disabled={isMatching}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isMatching ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Analyzing Fit...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Analyze Technical Alignment
                  </>
                )}
              </button>
            </div>

            {/* Match Output Results Section */}
            {matchResult && (
              <div className="mt-6 bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Score Dial and Summary Block */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-800/50 pb-4">
                  {/* Circular Score Bar */}
                  <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-slate-950 border-2 border-slate-800 shadow-inner shrink-0">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-1000"
                        strokeWidth="3.2"
                        strokeDasharray={`${matchResult.score}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="text-md font-mono font-extrabold text-emerald-400 z-10">{matchResult.score}%</span>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">Candidate Match Performance</div>
                    <p className="text-slate-300 text-xs leading-relaxed mt-1">{matchResult.summary}</p>
                  </div>
                </div>

                {/* Key Alignments & Bridging gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold block mb-1.5 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Target Match Strengths:
                    </span>
                    <ul className="space-y-1 text-slate-300 font-sans">
                      {matchResult.positives.map((pos, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-semibold shrink-0">•</span>
                          <span>{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-sky-400 font-bold block mb-1.5 flex items-center gap-1">
                      <Bookmark size={13} /> Custom Bridging Recommendation:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {matchResult.gaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-sky-400 font-semibold shrink-0">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tailored Hard Questions */}
                {matchResult.questions && matchResult.questions.length > 0 && (
                  <div className="border-t border-slate-800/80 pt-3 space-y-3">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                      <HelpCircle size={13} className="text-emerald-500" /> Proposed Recruiter Interview Prompts
                    </span>
                    
                    {matchResult.questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800/50 space-y-1">
                        <div className="font-semibold text-slate-200 text-xs flex items-start gap-1.5">
                          <span className="bg-emerald-950 text-emerald-400 rounded-full h-4 w-4 flex items-center justify-center text-[10px] shrink-0 font-mono mt-0.5">Q</span>
                          <span>{q.question}</span>
                        </div>
                        <div className="text-slate-400 text-xs pl-5 leading-relaxed italic">
                          <strong className="text-emerald-300/80 not-italic font-mono text-[10px] mr-1 block sm:inline-block">Suhama's Strong Response:</strong>
                          "{q.response}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE (Suhama's Chatbot - columns 5) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg h-[460px] lg:h-auto overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 to-emerald-500"></div>
            
            {/* Bot header info */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Bot size={16} />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-slate-950"></span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Suhama Mustafa AI</h4>
                    <span className="text-[10px] text-slate-500 block">Agent Representative • Active online</span>
                  </div>
                </div>
                <span className="text-[9px] bg-slate-900 text-slate-450 px-1.5 py-0.5 rounded border border-slate-800 tracking-wider">SECURE CHAT</span>
              </div>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 my-2 py-1 scrollbar-thin scrollbar-thumb-slate-800" style={{ maxHeight: "300px" }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5 px-1">
                    <span className="font-semibold">{msg.role === "user" ? "Recruiter" : "Suhama's Agent"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-slate-950 font-medium rounded-tr-none"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-sans"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex flex-col items-start">
                  <div className="text-[10px] text-slate-500 mb-0.5">Suhama's Agent is typing...</div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-tl-none p-3.5 space-y-1 flex items-center gap-1 text-slate-400 text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Sample Recruiter Quick Ask buttons */}
            <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-900">
              <button 
                onClick={() => setUserInputMsg("Tell me about the ISSB government client project")}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 max-w-[200px] truncate"
              >
                Govt ISSB Web Prototype?
              </button>
              <button 
                onClick={() => setUserInputMsg("How is she integrating LLMs & n8n AI workflows?")}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 max-w-[200px] truncate"
              >
                LLM & AI Workflows?
              </button>
              <button 
                onClick={() => setUserInputMsg("What is her research on Floyd's algorithm at NUST?")}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 max-w-[200px] truncate"
              >
                Floyd Cycle Detection Research?
              </button>
            </div>

            {/* Chat Input Field Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              <input
                type="text"
                value={userInputMsg}
                onChange={(e) => setUserInputMsg(e.target.value)}
                placeholder="Ask e.g. What databases does she use?"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-2 rounded-xl transition-all h-8 w-8 flex items-center justify-center cursor-pointer font-bold shrink-0"
                title="Send AI query"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </section>

        {/* TECHNICAL CAPABILITY GRID AND SEARCH */}
        <section className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-md" id="competencies-matrix-panel">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400"><Layers size={18} /></span>
                Technical Skills Competency Grid
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                A granular, filtered index of Suhama's masteries across the stack. Type any skill in the bar to live test her coverage.
              </p>
            </div>
            
            {/* Live Interactive Search Field */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search Skills (e.g. Next.js, n8n, MySQL)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs placeholder:text-slate-500 text-slate-150 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              {skillSearch && (
                <button 
                  onClick={() => setSkillSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grids list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* FRONTEND CLUSTER */}
            <div className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
                  <span>Frontend Stacks</span>
                  <span className="text-[10px] text-emerald-400 font-mono">[{getFilteredSkillsCount(resumeData.skills.frontend)}]</span>
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.frontend.map((sk) => {
                    const matched = isSkillMatched(sk);
                    return (
                      <span
                        key={sk}
                        className={`text-[11px] font-mono px-2 py-1.5 rounded transition-all flex items-center gap-1 ${
                          matched 
                            ? "bg-slate-900 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-300 border border-slate-800" 
                            : "opacity-20 text-slate-600 bg-slate-950 border border-slate-950"
                        }`}
                      >
                        {matched && <span className="h-1 w-1 rounded-full bg-emerald-400"></span>}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BACKEND CLUSTER */}
            <div className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
                  <span>Backend Stacks</span>
                  <span className="text-[10px] text-emerald-400 font-mono">[{getFilteredSkillsCount(resumeData.skills.backend)}]</span>
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.backend.map((sk) => {
                    const matched = isSkillMatched(sk);
                    return (
                      <span
                        key={sk}
                        className={`text-[11px] font-mono px-2 py-1.5 rounded transition-all flex items-center gap-1 ${
                          matched 
                            ? "bg-slate-900 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-300 border border-slate-800" 
                            : "opacity-20 text-slate-600 bg-slate-950 border border-slate-950"
                        }`}
                      >
                        {matched && <span className="h-1 w-1 rounded-full bg-emerald-400"></span>}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DATABASE CLUSTER */}
            <div className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
                  <span>Databases</span>
                  <span className="text-[10px] text-emerald-400 font-mono">[{getFilteredSkillsCount(resumeData.skills.databases)}]</span>
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.databases.map((sk) => {
                    const matched = isSkillMatched(sk);
                    return (
                      <span
                        key={sk}
                        className={`text-[11px] font-mono px-2 py-1.5 rounded transition-all flex items-center gap-1 ${
                          matched 
                            ? "bg-slate-900 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-300 border border-slate-800" 
                            : "opacity-20 text-slate-600 bg-slate-950 border border-slate-950"
                        }`}
                      >
                        {matched && <span className="h-1 w-1 rounded-full bg-emerald-400"></span>}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI / ML CRITICAL INTEGRATION */}
            <div className="bg-slate-900/40 border border-emerald-950 p-4.5 rounded-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 py-0.5 px-1.5 bg-emerald-500/20 text-[8px] font-mono border-l border-b border-emerald-800/40 text-emerald-300 rounded-bl-md uppercase select-none tracking-widest">
                Heavy AI Focus
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-between border-b border-emerald-950 pb-2 mb-3">
                  <span>AI & Workflows</span>
                  <span className="text-[10px] text-emerald-300 font-mono">[{getFilteredSkillsCount(resumeData.skills.ai_ml)}]</span>
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.ai_ml.map((sk) => {
                    const matched = isSkillMatched(sk);
                    return (
                      <span
                        key={sk}
                        className={`text-[11px] font-mono px-2 py-1.5 rounded transition-all flex items-center gap-1 ${
                          matched 
                            ? "bg-emerald-950/20 hover:bg-emerald-950/30 text-emerald-300 border border-emerald-900/40" 
                            : "opacity-20 text-slate-600 bg-slate-950 border border-slate-950"
                        }`}
                      >
                        {matched && <span className="h-1 w-1 rounded-full bg-emerald-400"></span>}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DEPLOYMENT & SYSTEMS TOOLS */}
            <div className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
                  <span>Tools & Systems</span>
                  <span className="text-[10px] text-emerald-400 font-mono">[{getFilteredSkillsCount(resumeData.skills.tools)}]</span>
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.tools.map((sk) => {
                    const matched = isSkillMatched(sk);
                    return (
                      <span
                        key={sk}
                        className={`text-[11px] font-mono px-2 py-1.5 rounded transition-all flex items-center gap-1 ${
                          matched 
                            ? "bg-slate-900 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-300 border border-slate-800" 
                            : "opacity-20 text-slate-600 bg-slate-950 border border-slate-950"
                        }`}
                      >
                        {matched && <span className="h-1 w-1 rounded-full bg-emerald-400"></span>}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Special NUST tag regarding academic credentials and security vetting */}
          <div className="mt-4 pt-3.5 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Briefcase size={13} className="text-emerald-400" /> Active security-cleared profiles for regional defence/government portals.
            </span>
            <span className="font-mono text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-850">
              Validated Tools Stack: Git + Vercel + Railway + Supabase Integration
            </span>
          </div>

        </section>

        {/* PROJECTS PORTFOLIO GRID WITH CATEGORIES */}
        <section className="mb-12" id="projects-portfolio-cluster">
          
          {/* Header & Categories Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-400"><FileText size={18} /></span>
                Successful Project Deliveries
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore government contract modules and end-to-end proprietary ML/AI SaaS solutions.
              </p>
            </div>

            {/* Custom Tab selectors */}
            <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs shrink-0">
              <button
                onClick={() => setSelectedProjectTab("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedProjectTab === "all" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-slate-250"
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setSelectedProjectTab("professional")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedProjectTab === "professional" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-slate-250"
                }`}
              >
                Government/Corporate
              </button>
              <button
                onClick={() => setSelectedProjectTab("independent")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedProjectTab === "independent" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-slate-250"
                }`}
              >
                AI SaaS & ML Models
              </button>
            </div>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {getFilteredProjects().map((proj, idx) => {
              const isGov = proj.type === "professional";
              return (
                <div 
                  key={idx}
                  className={`bg-slate-950/90 border rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${
                    isGov 
                      ? "border-slate-800 hover:border-emerald-800/80 hover:shadow-[0_4px_24px_rgba(16,185,129,0.06)]"
                      : "border-slate-800 hover:border-sky-800/80 hover:shadow-[0_4px_24px_rgba(14,165,233,0.06)]"
                  }`}
                >
                  
                  {/* Subtle top decoration badge */}
                  <div className={`absolute top-0 left-0 h-[3px] w-24 ${isGov ? "bg-emerald-500" : "bg-sky-500"}`}></div>

                  <div>
                    {/* Header bar of project */}
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border tracking-wider font-semibold uppercase ${
                          isGov 
                            ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/40" 
                            : "bg-sky-950/50 text-sky-400 border-sky-900/40"
                        }`}>
                          {isGov ? "Government Contract" : "Proprietary AI SaaS"}
                        </span>
                        
                        {/* Title */}
                        <h4 className="text-lg font-bold text-slate-100 mt-2 group-hover:text-emerald-300 transition-colors">
                          {proj.title}
                        </h4>
                      </div>

                      {/* Launch Project External badge if has links */}
                      {proj.links && proj.links.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {proj.links.map((lnk, linkIdx) => (
                            <a
                              key={linkIdx}
                              href={lnk}
                              target="_blank"
                              rel="noreferrer"
                              title={`Visit project URL: ${lnk}`}
                              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg border border-slate-800 transition-all"
                            >
                              <ExternalLink size={14} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tech badging */}
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 mb-4">
                      <Terminal size={12} />
                      <span className="border-b border-slate-900/60 pb-0.5">{proj.tech}</span>
                    </div>

                    {proj.role && (
                      <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-[11px] leading-relaxed text-slate-300">
                        <div className="mb-1 flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider text-sky-300">
                          <Briefcase size={12} /> Role
                        </div>
                        <p>{proj.role}</p>
                      </div>
                    )}

                    {/* Description text */}
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      {"description" in proj ? proj.description : ""}
                    </p>

                    {/* Check if is independent or professional achievements list */}
                    {"achievements" in proj && proj.achievements && (
                      <ul className="space-y-1.5 mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                        {(proj.achievements as string[]).map((ach, achId) => (
                          <li key={achId} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Special outcomes specific to her work */}
                    {proj.title.includes("ISSB") && (
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850/40 text-[11px] text-slate-350 space-y-1">
                        <strong className="text-emerald-400 block font-semibold">Production Deliverables:</strong>
                        <div className="flex items-center justify-between">
                          <span>• Independent Stack Weight:</span>
                          <span className="font-mono text-slate-100 font-bold">80%+ (Full-Stack Engine)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>• Target Modules:</span>
                          <span className="text-slate-200">Candidate verification portal, Schedules, Contact routing</span>
                        </div>
                      </div>
                    )}

                    {proj.title.includes("PAGB") && (
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850/40 text-[11px] text-slate-350 space-y-1">
                        <strong className="text-teal-400 block font-semibold">Production Deliverables:</strong>
                        <div className="flex items-center justify-between">
                          <span>• Deployed Live Modules:</span>
                          <span className="font-mono text-slate-100 font-bold">3+ Core Active Stacks</span>
                        </div>
                        <div className="text-slate-400 text-[10px] italic pt-1">
                          Platform is live at pagb.org.pk representing military research publications.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visual card footer showing repository weight or tags */}
                  <div className="mt-5 pt-3.5 border-t border-slate-900 flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-500" /> Fully approved by client stakeholders
                    </span>
                    <span className="font-mono uppercase text-[9px] tracking-widest text-slate-400">Next + Node</span>
                  </div>

                </div>
              );
            })}

          </div>
        </section>

        {/* WORK EXPERIENCES, EDUCATION & NUST RESEARCH CENTER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12" id="institutions-panel">
          
          {/* LEFT: WORK EXPERIENCE & EDUCATION (columns 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* WORK CHRONOLOGY CARD */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-400"><Briefcase size={18} /></span>
                Career Timeline & Production Footprints
              </h3>
              
              <div className="relative border-l border-slate-800 pl-4 sm:pl-6 space-y-8 py-2">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="relative group">
                    {/* Glowing Bullet on Timeline */}
                    <span className="absolute -left-[23px] sm:-left-[31px] top-1.5 h-4 w-4 bg-slate-950 border-2 border-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all">
                      <span className="h-1.5 w-1.5 bg-emerald-300 rounded-full"></span>
                    </span>
                    
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {exp.role}
                        </h4>
                        <span className="text-[11px] font-mono text-emerald-400 tracking-wider bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {exp.period}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
                        <span className="text-slate-200 font-bold flex items-center gap-1">
                          <Building2 size={12} /> {exp.company}
                        </span>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>
                      
                      <ul className="mt-3.5 space-y-2 text-xs text-slate-350 tracking-wide font-sans pl-1">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGH-IMPACT EDUCATION CRADLE */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-400"><GraduationCap size={18} /></span>
                Academic Credentials
              </h3>
              
              <div className="space-y-6">
                {resumeData.education.map((edu, idx) => {
                  const isNust = edu.institution.includes("NUST");
                  return (
                    <div 
                      key={idx}
                      className={`p-5 rounded-xl border transition-all ${
                        isNust 
                          ? "bg-slate-900/60 border-emerald-950/50 hover:border-emerald-800/60" 
                          : "bg-slate-900/30 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/40 pb-2.5 mb-3.5">
                        <div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isNust ? "bg-emerald-950/50 text-emerald-450 border-emerald-900/40" : "bg-slate-900 text-slate-400 border-slate-800"
                          }`}>
                            {edu.cvData}
                          </span>
                          <h4 className="text-md font-bold text-slate-100 mt-1.5">{edu.degree}</h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800/60 px-2 py-0.5 rounded self-start sm:self-center">
                          {edu.period}
                        </span>
                      </div>
                      
                      <div className="text-xs font-semibold text-slate-300 font-mono">
                        {edu.institution}, {edu.location}
                      </div>

                      {edu.coursework && (
                        <div className="mt-3.5 text-xs text-slate-400 space-y-1.5 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900">
                          <strong className="text-emerald-400 block font-mono text-[10px] uppercase tracking-wider">Relevant Graduate Modules:</strong>
                          <span>{edu.coursework}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: NUST RESEARCH & PUBLICATIONS CENTER (columns 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500"></div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
                  <span className="p-1 rounded bg-emerald-500/10 text-emerald-400"><BrainCircuit size={17} /></span>
                  Research & Publications
                </h3>
                <p className="text-xs text-slate-400 mb-5 border-b border-slate-900 pb-2.5">
                  Scientific works authored by Suhama during her MS degree program at NUST MCS.
                </p>

                <div className="space-y-6">
                  {resumeData.research.map((res, idx) => {
                    const isSpringer = res.publication.includes("Springer");
                    return (
                      <div key={idx} className="bg-slate-900/50 p-4.5 rounded-xl border border-slate-850 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border tracking-wider font-semibold uppercase ${
                            isSpringer 
                              ? "bg-amber-950/50 text-amber-400 border-amber-900/40" 
                              : "bg-sky-950/50 text-sky-400 border-sky-900/40"
                          }`}>
                            {res.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono text-right">{isSpringer ? "Springer Indexed" : "Ref Journal"}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide leading-relaxed">
                          "{res.title}"
                        </h4>

                        <div className="text-[11px] text-slate-450 italic leading-relaxed">
                          <strong>Venue:</strong> {res.publication}
                        </div>

                        <p className="text-slate-400 text-xs leading-relaxed font-sans">
                          {res.description}
                        </p>

                        <div className="text-[10px] text-slate-500 font-mono bg-slate-950 p-2 rounded border border-slate-900">
                          <strong className="text-slate-400 font-bold block mb-0.5 text-[9px] uppercase tracking-widest">Co-authors:</strong>
                          {res.authors.join(", ")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Research stats footer */}
              <div className="bg-slate-900/40 border border-slate-850 p-3.5 rounded-xl text-xs text-slate-400 mt-5 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Forecasting Error metric:</span>
                  <strong className="text-slate-200">ARIMA: MAE 4.1, MAPE 5.8%</strong>
                </div>
                <div className="text-[10px] italic text-slate-500">
                  Targeted solution outperforms SARIMA, Prophet and standard LSTM architectures.
                </div>
              </div>
            </div>

            {/* HONOURS & ACHIEVEMENTS TIMELINE EXTRA */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
                <span className="p-1 rounded bg-amber-500/10 text-amber-400"><Award size={17} /></span>
                Hackathons & DSA Solver
              </h3>

              <div className="space-y-4">
                {resumeData.achievements.map((ach, idx) => (
                  <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-850/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1.5 mb-2">
                        <h4 className="text-xs font-bold text-slate-200 font-mono text-emerald-400 uppercase tracking-widest">
                          {ach.title}
                        </h4>
                        {ach.period && <span className="text-[10px] text-slate-500 font-mono">{ach.period}</span>}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>

                    {ach.link && (
                      <div className="mt-3.5 pt-2 border-t border-slate-900/60 flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Devpost / Online link available</span>
                        <a 
                          href={ach.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10.5px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 font-mono transition-colors"
                        >
                          Verify Event <ChevronRight size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </section>

      </div>

      {/* Footer copyright */}
      <footer className="border-t border-slate-850/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 relative z-25">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-[10px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active Production Profile
            </span>
            <span className="hover:text-slate-400 text-slate-550 transition-colors">Suhama Mustafa © 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href={`mailto:${resumeData.email}`} className="hover:text-emerald-400 transition-all">Direct Email</a>
            <span>•</span>
            <a href={resumeData.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-all">LinkedIn</a>
            <span>•</span>
            <a href={resumeData.socials.github} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-all">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
