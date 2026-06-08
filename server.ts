import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to protect against crash on missing keys
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiInstance;
}

// Comprehensive professional data of Suhama Mustafa
const SUHAMA_RESUME_INFO = `
SUHAMA MUSTAFA
Full Stack Developer | AI-Driven Development
Email: suhamamustafa1@gmail.com
Phone: +92 344 1272583
Location: Rawalpindi, Pakistan
LinkedIn: linkedin.com/in/suhama-mustafa-b58a152a5
GitHub: github.com/suhama101
LeetCode: leetcode.com/u/suhama

SUMMARY:
Full Stack Developer with production experience building AI-powered web applications for live government clients. Proficient in Next.js, React, Node.js, and LLM integration, with end-to-end ownership of SaaS and ML projects from design to deployment. Hackathon participant with experience applying AI solutions under real-world constraints. Currently pursuing MS Software Engineering at NUST while contributing to client projects at Inotech Solutions.

WORK EXPERIENCE:
1. Software Engineer at Inotech Solutions (Rawalpindi, Pakistan) | Sept 2025 – May 2026
 - Built and delivered a full-stack prototype to government client ISSB using Next.js, Node.js, and Aiven Cloud (MySQL), independently contributing to 80%+ of the application alongside senior engineers.
 - Developed and deployed 3+ live modules on PAGB (pagb.org.pk), a live government production platform, collaborating in an Agile team via Git workflows and code reviews.
 - Designed and built an HTML5/CSS/JavaScript dashboard prototype for FPCDL submitted to client stakeholders for design approval.
 - Developed responsive UI/UX components and integrated REST APIs across multiple client projects, improving reusability and reducing frontend delivery time.
 - Independently built the Hardware and Software sections of the Inotech company website using HTML, CSS, and JavaScript.

2. Freelance UI/UX & Frontend Designer (Remote) | March 2025 – July 2025
 - Designed branded social media content for Vriopi, strengthening online visual identity and engagement.
 - Created interactive, age-appropriate digital templates for Cedar School (Dubai) to improve classroom engagement.

EDUCATION:
- MS Software Engineering at NUST Military College of Signals, Rawalpindi | Sept 2025 – Present | CGPA: 3.37 / 4.0
  Relevant Coursework: Data Mining, Computer Vision, Cloud Computing, Advanced Software Engineering, Software Quality Engineering, Software System Design & Architecture, Research Methodology, Software Project Management, Software Requirements Engineering.
- BS Information Technology at University of Sargodha | 2021 – 2025 | CGPA: 3.1 / 4.0

TECHNICAL SKILLS:
- Frontend: React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Python, REST APIs, JWT Authentication
- Databases: Supabase (PostgreSQL), MySQL, Aiven Cloud
- AI / ML: LLM Integration (Gemini, Groq), Prompt Engineering, Model Fine-tuning, NLP, Machine Learning, Streamlit, n8n AI Workflows
- Tools: Git, GitHub, Vercel, Railway, Figma, Canva, GitHub Copilot, Windsurf, n8n

KEY PROJECTS (PROFESSIONAL & INDEPENDENT):
1. ISSB Website (Government Client) [issb-sand.vercel.app | issb.gov.pk]: Delivered a fully functional, production-ready application to Inter Services Selection Board (ISSB) Pakistan — contributing to 80% of the build including REST APIs, dynamic UI, database schema design, schedule management, candidate portal, and contact modules. Application approved by client and domain acquired at issb.gov.pk. Currently in final production hosting configuration — staging deployment live at issb-sand.vercel.app. Full deployment to issb.gov.pk will go live upon hosting and IP configuration completion. Developed on Next.js, Node.js, Aiven Cloud (MySQL).
2. PAGB Website (Pakistan Army Green Book) [pagb.org.pk]: Designed and deployed a fully responsive, production-grade UI/UX for a live government platform for Pakistan Army research. Developed 3+ modules on Next.js, Node.js in an Agile team.
3. FPCDL Dashboard (Government Client) [fpsc-eight.vercel.app]: Designed and built a dashboard prototype incorporating branding and role-specific UI flows for administration.
4. SmartHire AI (AI-Powered Hiring SaaS) [smarthire-ai-lrq8.vercel.app]: End-to-end SaaS hiring platform. Includes PDF resume parsing, Gemini LLM structured outputs, JWT authentications, and candidate fit scoring.
5. AI Data Dashboard [fullstackai-datadashboard.streamlit.app]: Deployed a live Python, Streamlit ML analytics panel with interactive visualizer.
6. Research Cycles/ML Models: Image classification model fine-tuned using transfer learning; News Classification automation using n8n workflows; and LLM benchmarker POCs.

RESEARCH & PUBLICATIONS:
1. "Improving Floyd's Algorithm for Efficient Cycle Detection" | Under Review at Mehran University Research Journal of Engineering & Technology. Analyzed list sizes, cycle lengths, developed a predictive step estimator model.
2. "Food Distribution Application" (Research Paper) | Springer Journal (In Progress). Geolocation routing and ARIMA-based forecasting with lower error than SARIMA, LSTM, etc.

ACHIEVEMENTS:
- Evorozen Innovators Hackathon Participant (June 2026)
- AI Hackathon NUST Military College of Signals (February 2026) - Presented prototype under constraint.
- LeetCode Active solver (leetcode.com/u/suhama)
`;

// Helper: fallback response if Gemini key is not set
function generateFallbackMatch(jd: string) {
  const jdLower = jd.toLowerCase();
  let score = 70; // baseline
  const matchedSkills: string[] = [];
  const suggestions: string[] = [];

  // Frontend skills checks
  if (jdLower.includes("react") || jdLower.includes("next")) {
    score += 8;
    matchedSkills.push("React.js & Next.js");
  }
  if (jdLower.includes("typescript") || jdLower.includes("javascript") || jdLower.includes("ts")) {
    score += 5;
    matchedSkills.push("TypeScript");
  }
  if (jdLower.includes("node") || jdLower.includes("express") || jdLower.includes("backend")) {
    score += 6;
    matchedSkills.push("Node.js / Express Backend");
  }
  if (jdLower.includes("ai") || jdLower.includes("llm") || jdLower.includes("gemini") || jdLower.includes("artificial intelligence")) {
    score += 8;
    matchedSkills.push("LLM & Generative AI Integration");
  }
  if (jdLower.includes("sql") || jdLower.includes("mysql") || jdLower.includes("postgres")) {
    score += 5;
    matchedSkills.push("Relational Databases (MySQL, Supabase)");
  }

  score = Math.min(score, 99); // max score is 99

  return {
    score,
    summary: "A robust matching score indicating excellent technical alignment. Suhama Mustafa has a remarkable track record of shipping full-stack applications with state clients, combined with AI/ML systems engineering.",
    positives: [
      "Substantial production-grade experience with highly secure government applications (ISSB, PAGB).",
      "Full stack competence covering React, Next.js, Node.js and modern database systems.",
      matchedSkills.length > 0 
        ? `Direct skill coverage for key requirements: ${matchedSkills.join(", ")}.`
        : "Strong alignment with modern frontend and backend paradigms.",
      "Dual focus on research (NUST MS Candidate) and field implementation (Inotech Solutions)."
    ],
    gaps: jdLower.includes("aws") || jdLower.includes("docker") || jdLower.includes("kubernetes") 
      ? ["While highly skilled in Vercel, Railway, and Aiven Cloud, she does not explicitly list AWS/Docker, though her MS cloud computing coursework directly covers these clusters."]
      : ["No critical technical gaps identified. Recommended for immediate technical screening."],
    questions: [
      {
        question: "Your project lists critical portals for ISSB and Pakistan Army. How do you handle high data-security constraints?",
        response: "I leveraged secure authentication, backend-only DB connections on Aiven Cloud, and designed restricted-access UI paths. My coursework in Software System Design at NUST also covers defensive design patterns."
      },
      {
        question: "How did you design the LLM structured JSON extraction in SmartHire AI?",
        response: "I engineered prompt pipelines using Gemini schemas to guarantee consistent JSON keys directly from OCR/PDF parsing blocks, significantly stabilizing recruiter parsing reliability."
      }
    ],
    usingFallback: true
  };
}

// API: Match Job Description
app.post("/api/match-jd", async (req, res) => {
  const { jd } = req.body;
  if (!jd || typeof jd !== "string") {
    res.status(400).json({ error: "Job description is required" });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback if no API Key is configured yet
    const fallback = generateFallbackMatch(jd);
    res.json(fallback);
    return;
  }

  try {
    const prompt = `
You are a top-tier Technical Recruiter and Headhunter specializing in the Islamabad/Rawalpindi tech hub.
Your task is to analyze how the candidate, SUHAMA MUSTAFA, fits the following Job Description (JD).

Here is Suhama's Resume Profile:
${SUHAMA_RESUME_INFO}

Analyze her profile relative to the JD and respond with a clean, parsed JSON object containing EXACTLY these keys. Do not include any markdown format blocks outside the JSON, just the pure JSON.

JSON Structure:
{
  "score": number (0 to 100 representing how well she aligns),
  "summary": "Short 2-3 sentence overview highlighting her fit relative to the job position",
  "positives": ["Point 1 of alignment", "Point 2 of alignment", "Point 3 of alignment", "Point 4 of alignment"],
  "gaps": ["Any technical requirements in the JD that she has less explicitly stated in her CV", "Suggestions for bridging"],
  "questions": [
    {
       "question": "An actual high-impact interview question they'd ask Suhama about her projects to test her fit",
       "response": "A highly professional response she can give based on her actual achievements and research"
    },
    {
       "question": "Another professional interview question tailored to her work at ISSB/PAGB",
       "response": "Her specific professional answer"
    }
  ]
}

Ensure the response satisfies "application/json" and has proper escape characters. Make sure the score is grounded in her matching credentials.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ ...parsedData, usingFallback: false });
  } catch (error: any) {
    console.error("Gemini match API Error:", error);
    // Graceful fallback on API error
    const fallback = generateFallbackMatch(jd);
    res.json(fallback);
  }
});

// API: Recruiter Interactive Chatbot Assistant
app.post("/api/chat-recruiter", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Intelligent fallback responder
    const fallbackAnswers: { keywords: string[]; text: string }[] = [
      {
        keywords: ["government", "security", "issb", "army", "pagb", "defense", "military"],
        text: "Suhama Mustafa has remarkable experience with high-security state clients. Her contributions include building 80% of the Next.js full-stack prototype for the Inter Services Selection Board (ISSB) Pakistan, including dynamic schedule management and candidate portals, as well as delivering 3+ live production modules for the Pakistan Army Green Book (PAGB) platform.",
      },
      {
        keywords: ["skills", "technologies", "tech", "react", "next", "node", "python"],
        text: "Suhama is proficient in Full-Stack web engineering: Next.js, React, TypeScript, and Node.js/Express. For databases, she commands Supabase, MySQL, and Aiven Cloud. On the AI front, she integrates Gemini LLMs, designs prompt engineering pipelines, builds n8n workflows, and uses Python with Streamlit.",
      },
      {
        keywords: ["education", "nust", "university", "gpa", "sargodha"],
        text: "She is currently pursuing her MS in Software Engineering from NUST Military College of Signals in Rawalpindi, holding a 3.37 CGPA. Previously, she completed her BS in Information Technology from the University of Sargodha with a 3.1 CGPA.",
      },
      {
        keywords: ["contact", "hire", "email", "phone", "linkedin"],
        text: "You can reach Suhama directly via email at suhamamustafa1@gmail.com, or phone at +92 344 1272583. Her LinkedIn handles are available right at the top header of her portfolio dashboard!",
      },
      {
        keywords: ["research", "publication", "paper", "floyd", "arima", "springer"],
        text: "She has two core publications/research files: 'Improving Floyd's Algorithm for Efficient Cycle Detection' (currently under review at Mehran University Research Journal), and a Springer Journal research paper (in progress) co-developing an ARIMA-based food redistribution system at MCS NUST.",
      }
    ];

    const lowerMsg = message.toLowerCase();
    let reply = "That's an excellent question! Suhama Mustafa is a motivated Full Stack Developer based in the Islamabad-Rawalpindi area with expertise in React, Next.js, Node.js, and LLM integrations. She is an exceptional fit for multi-national firms looking for agile and technical software engineers.";

    for (const item of fallbackAnswers) {
      if (item.keywords.some(kw => lowerMsg.includes(kw))) {
        reply = item.text;
        break;
      }
    }

    res.json({ text: reply, usingFallback: true });
    return;
  }

  try {
    const systemPrompt = `
You are the interactive AI Career Agent representing SUHAMA MUSTAFA, a premier Full Stack & AI Developer based in Rawalpindi/Islamabad, Pakistan.
Your audience constraints: Technical Recruiters, HR Leads, and Tech Executives from elite multinational software houses in Islamabad, Rawalpindi, and international hubs.
Your objective: Charm them, respond to their queries with perfect compliance with Suhama's real credentials, and prove why she's a world-class prospective hire.

Here is Suhama's full professional resume context:
${SUHAMA_RESUME_INFO}

Rules:
- Speak in a highly polished, professional, confident, and warm tone.
- Base ALL responses strictly on her actual experience. Never fabricate or invent arbitrary projects or credentials.
- Be concise (aim for 2-4 sentences unless explaining a complex technical architecture).
- Explicitly emphasize her government client experience (ISSB, Pakistan Army Green Book PAGB) when asked about enterprise systems, security, or robustness.
- Proactively offer contact details (Email: suhamamustafa1@gmail.com, Phone: +92 344 1272583) to finalize interviews.
    `;

    // Process history if present to fit Gemini contents format
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content || h.text }],
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text || "I'm sorry, I couldn't process that response.", usingFallback: false });
  } catch (error) {
    console.error("Gemini chat API Error:", error);
    res.json({ text: "Suhama is an expert in React, Node.js, and LLM integrations. For instant communication, please contact her directly at suhamamustafa1@gmail.com or +92 344 1272583.", usingFallback: true });
  }
});

// Serve static elements in production, and dev server in dev mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
