export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    linkedin: string;
    github: string;
    leetcode: string;
  };
  cvUrl: string;
  summary: string;
  experience: {
    role: string;
    company: string;
    location: string;
    period: string;
    achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    cvData: string;
    coursework?: string;
  }[];
  skills: {
    frontend: string[];
    backend: string[];
    databases: string[];
    ai_ml: string[];
    tools: string[];
  };
  projects: {
    professional: {
      title: string;
      tech: string;
      role?: string;
      links: string[];
      description: string;
    }[];
    independent: {
      title: string;
      tech: string;
      role?: string;
      links?: string[];
      description?: string;
      achievements?: string[];
    }[];
  };
  research: {
    title: string;
    publication: string;
    status: string;
    description: string;
    authors: string[];
  }[];
  achievements: {
    title: string;
    period?: string;
    link?: string;
    description: string;
  }[];
}

export interface MatchResponse {
  score: number;
  summary: string;
  positives: string[];
  gaps: string[];
  questions: {
    question: string;
    response: string;
  }[];
  usingFallback?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
