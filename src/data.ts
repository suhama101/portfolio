import { ResumeData } from "./types";

export const resumeData: ResumeData = {
  name: "Suhama Mustafa",
  title: "Full Stack Developer | AI-Driven Development",
  email: "suhamamustafa1@gmail.com",
  phone: "+92 344 1272583",
  location: "Rawalpindi, Pakistan",
  socials: {
    linkedin: "https://linkedin.com/in/suhama-mustafa-b58a152a5",
    github: "https://github.com/suhama101",
    leetcode: "https://leetcode.com/u/suhama",
  },
  summary:
    "Full Stack Developer with production experience building AI-powered web applications for live government clients. Proficient in Next.js, React, Node.js, and LLM integration, with end-to-end ownership of SaaS and ML projects from design to deployment. Hackathon participant with experience applying AI solutions under real-world constraints. Currently pursuing MS Software Engineering at NUST while contributing to client projects at Inotech Solutions.",
  experience: [
    {
      role: "Software Engineer",
      company: "Inotech Solutions",
      location: "Rawalpindi, Pakistan",
      period: "September 2025 – May 2026",
      achievements: [
        "Built and delivered a full-stack prototype to government client ISSB using Next.js, Node.js, and Aiven Cloud (MySQL), independently contributing to 80%+ of the application alongside senior engineers.",
        "Developed and deployed 3+ live modules on PAGB (pagb.org.pk), a live government production platform, collaborating in an Agile team via Git workflows and code reviews.",
        "Designed and built an HTML5/CSS/JavaScript dashboard prototype for FPCDL submitted to client stakeholders for design approval.",
        "Developed responsive UI/UX components and integrated REST APIs across multiple client projects, improving reusability and reducing frontend delivery time.",
        "Independently built the Hardware and Software sections of the Inotech company website using HTML, CSS, and JavaScript.",
      ],
    },
    {
      role: "Freelance UI/UX & Frontend Designer",
      company: "Remote",
      location: "Pakistan",
      period: "March 2025 – July 2025",
      achievements: [
        "Designed branded social media content for Vriopi, strengthening online visual identity and engagement.",
        "Created interactive, age-appropriate digital templates for Cedar School (Dubai) to improve classroom engagement.",
      ],
    },
  ],
  education: [
    {
      degree: "MS Software Engineering",
      institution: "NUST Military College of Signals",
      location: "Rawalpindi, Pakistan",
      period: "September 2025 – Present",
      cvData: "CGPA: 3.37 / 4.0",
      coursework:
        "Data Mining, Computer Vision, Cloud Computing, Advanced Software Engineering, Software Quality Engineering, Software System Design & Architecture, Research Methodology, Software Project Management, Software Requirements Engineering.",
    },
    {
      degree: "BS Information Technology",
      institution: "University of Sargodha",
      location: "Sargodha, Pakistan",
      period: "2021 – 2025",
      cvData: "CGPA: 3.1 / 4.0",
    },
  ],
  skills: {
    frontend: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "Python", "REST APIs", "JWT Authentication"],
    databases: ["Supabase (PostgreSQL)", "MySQL", "Aiven Cloud"],
    ai_ml: [
      "LLM Integration (Gemini, Groq)",
      "Prompt Engineering",
      "Model Fine-tuning",
      "NLP",
      "Machine Learning",
      "Streamlit",
      "n8n AI Workflows",
    ],
    tools: [
      "Git",
      "GitHub",
      "Vercel",
      "Railway",
      "Figma",
      "Canva",
      "GitHub Copilot",
      "Windsurf",
      "n8n",
    ],
  },
  projects: {
    professional: [
      {
        title: "ISSB Website — Government Client",
        tech: "Next.js, Node.js, Aiven Cloud (MySQL)",
        links: ["https://issb-sand.vercel.app", "https://issb.gov.pk"],
        description:
          "Delivered a fully functional, production-ready application to Inter Services Selection Board (ISSB) Pakistan — contributing to 80% of the full-stack build including REST APIs, dynamic UI, and database schema design. Built secure, government-grade features: dynamic schedule management, gallery, candidate portal, and contact modules. Application approved by client and domain acquired at issb.gov.pk. Currently in final production hosting configuration — staging deployment live at issb-sand.vercel.app. Full deployment to issb.gov.pk will go live upon hosting and IP configuration completion.",
      },
      {
        title: "PAGB Website — Pakistan Army Green Book",
        tech: "Next.js, Node.js, REST APIs",
        links: ["https://pagb.org.pk"],
        description:
          "Designed and deployed a fully responsive, production-grade UI/UX for pagb.org.pk — a live government platform for Pakistan Army academic and military research publications. Developed and deployed 3+ functional modules in an Agile team; platform is live and publicly accessible.",
      },
      {
        title: "FPCDL Dashboard — Government Client",
        tech: "HTML5, CSS3, JavaScript",
        links: ["https://fpsc-eight.vercel.app"],
        description:
          "Designed and built a comprehensive dashboard prototype for FPCDL incorporating branding, organizational imagery, and role-specific UI flows tailored to government administrative workflows.",
      },
      {
        title: "Inotech Solutions Website",
        tech: "HTML, CSS, JavaScript",
        links: ["https://inotech.vercel.app/hardware/hardware.html"],
        description:
          "Independently designed and developed the Hardware and Software sections of the Inotech company website, improving frontend structure, navigation, and sector-based filtering UI.",
      },
    ],
    independent: [
      {
        title: "SmartHire AI — AI-Powered Hiring Platform (SaaS)",
        tech: "Next.js, Node.js, Gemini LLM, JWT Authentication",
        links: ["https://smarthire-ai-lrq8.vercel.app"],
        description:
          "Built an end-to-end AI hiring platform with resume parsing, Gemini LLM integration, JWT authentication, and candidate fit scoring — demonstrating full SaaS product ownership from design to deployment. Engineered structured prompt pipelines for JSON extraction from unstructured PDF text; integrated batch candidate ranking and job description matching for recruiters.",
      },
      {
        title: "AI Data Dashboard",
        tech: "Python, Streamlit, Machine Learning",
        links: ["https://fullstackai-datadashboard.streamlit.app"],
        description:
          "Built an ML-powered analytics dashboard with live data visualization and integrated ML-based insights; deployed live on Streamlit Cloud.",
      },
      {
        title: "AI / Machine Learning Projects",
        tech: "Transfer Learning, Deep Learning, n8n Workflows",
        achievements: [
          "Image Classification: Fine-tuned a deep learning model for multi-class image classification using transfer learning, improving prediction accuracy across test sets.",
          "News Classification (n8n Workflow): Built an automated news categorization pipeline integrating AI models into an n8n workflow for real-time processing.",
          "AI Model POCs & Testing: Conducted structured experiments on LLM and ML models; produced performance benchmarking reports comparing model outputs.",
        ],
      },
    ],
  },
  research: [
    {
      title: "Improving Floyd's Algorithm for Efficient Cycle Detection",
      publication: "Mehran University Research Journal of Engineering & Technology",
      status: "Under Review",
      description:
        "Analyzed effect of list size, cycle length, and start position on Floyd's algorithm; developed a predictive model to estimate detection steps with applications in graph theory and real-time systems.",
      authors: ["Suhama Mustafa", "Hikmat Ullah Khann", "Irshad Ali", "Hadia Abu Bakar", "Anam Naz"],
    },
    {
      title: "Food Distribution Application — Research Paper",
      publication: "Springer Journal",
      status: "In Progress | MCS, NUST",
      description:
        "Co-developing a mobile-first food redistribution platform with real-time geolocation matching and ARIMA-based surplus forecasting; achieved lowest error (MAE: 4.1, MAPE: 5.8%) vs. SARIMA, Prophet, and LSTM.",
      authors: ["Suhama Mustafa", "Aamir Yousaf", "Muhammad Ali", "Dr. Nazia Bibi", "Shafa-at Ali Sheikh"],
    },
  ],
  achievements: [
    {
      title: "Evorozen Innovators Hackathon",
      period: "June 2026",
      link: "https://evorozen-innovators-hackathon.devpost.com",
      description:
        "Participated in the Evorozen Innovators Hackathon — an online competitive event focused on building innovative AI and software solutions under time constraints.",
    },
    {
      title: "AI Hackathon | NUST Military College of Signals",
      period: "February 2026",
      description:
        "Participated in an AI Hackathon organised by NUST MCS — built and presented an AI-powered solution under time constraints, collaborating with a team to prototype and demo a working product.",
    },
    {
      title: "DSA Problem Solving | LeetCode",
      link: "https://leetcode.com/u/suhama",
      description:
        "Actively solving Data Structures and Algorithms problems on LeetCode — strengthening problem-solving and computational thinking skills.",
    },
  ],
};
