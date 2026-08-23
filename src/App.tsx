import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { resumeData } from "./data";

type Project = {
  title: string;
  tech: string;
  role?: string;
  links?: string[];
  description?: string;
  achievements?: string[];
  type: "professional" | "independent";
};

const primaryProjects: Project[] = [
  ...resumeData.projects.professional.slice(0, 2).map((project) => ({ ...project, type: "professional" as const })),
  ...resumeData.projects.independent.slice(0, 1).map((project) => ({ ...project, type: "independent" as const })),
  ...resumeData.projects.professional.slice(2).map((project) => ({ ...project, type: "professional" as const })),
];

function ExternalLink({ href, label }: { href: string; label: string }) {
  return <a className="text-link" href={href} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={15} /></a>;
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | "professional" | "independent">("all");
  const [skillSearch, setSkillSearch] = useState("");
  const visibleProjects = primaryProjects.filter((project) => projectFilter === "all" || project.type === projectFilter);
  const skillGroups = [
    { name: "Frontend", items: resumeData.skills.frontend, featured: true },
    { name: "Backend", items: resumeData.skills.backend, featured: true },
    { name: "Databases", items: resumeData.skills.databases, featured: true },
    { name: "AI & Automation", items: resumeData.skills.ai_ml, featured: false },
    { name: "Tools & Delivery", items: resumeData.skills.tools, featured: false },
  ];
  const otherWork = resumeData.projects.independent.find((project) => project.title.includes("AI /"));

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a className="brand" href="#about" onClick={() => setMenuOpen(false)}><span className="brand-mark">SM</span><span>Suhama Mustafa</span></a>
        <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          {[["About", "about"], ["Experience", "experience"], ["Projects", "projects"], ["Skills", "skills"], ["Research", "research"], ["Contact", "contact"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <div className="nav-socials"><a href={resumeData.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href={resumeData.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a></div>
          <a className="button button-small button-dark" href={resumeData.cvUrl} download="Suhama_Mustafa_Full_Stack_CV.pdf"><Download size={15} /> Download CV</a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="about">
          <div className="hero-copy"><div className="eyebrow hero-eyebrow"><MapPin size={14} /> Full Stack Developer · {resumeData.location}</div><h1>Building reliable full-stack products from interface to deployment.</h1><p className="hero-lede">Full Stack Developer with professional experience delivering production web applications for government clients and building SaaS and AI-integrated products using Next.js, React, Node.js, REST APIs, and SQL databases.</p><div className="hero-actions"><a className="button button-primary" href="#projects">View Selected Work <ArrowUpRight size={17} /></a><a className="button button-outline" href={resumeData.cvUrl} download="Suhama_Mustafa_Full_Stack_CV.pdf"><Download size={16} /> Download CV</a></div><div className="hero-contact"><a href={`mailto:${resumeData.email}`}><Mail size={15} /> {resumeData.email}</a><a href={resumeData.socials.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a><a href={resumeData.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a></div></div>
          <aside className="hero-aside"><span className="aside-label">Currently focused on</span><strong>Full-stack systems and AI-integrated products</strong><p>From responsive interfaces and API integration to database-backed applications and deployment.</p><span className="availability"><span /> Open to Full Stack / Software Engineering opportunities</span></aside>
        </section>

        <section className="credibility section-wrap" aria-label="Professional highlights"><div><span>Production Development</span><strong>Government & client-facing applications</strong></div><div><span>Core Stack</span><strong>Next.js · React · Node.js</strong></div><div><span>Current Education</span><strong>MS Software Engineering @ NUST</strong></div></section>

        <section className="section-wrap section-block" id="experience"><SectionHeading eyebrow="Experience" title="Professional Experience" copy="Hands-on delivery across client applications, production modules, and reusable frontend systems." /><div className="experience-list">{resumeData.experience.map((experience) => <article className="experience-item" key={`${experience.company}-${experience.period}`}><div className="experience-meta"><span>{experience.period}</span><span>{experience.location}</span></div><div className="experience-body"><h3>{experience.role}</h3><p className="company">{experience.company}</p><ul>{experience.achievements.map((achievement) => <li key={achievement}><Check size={16} />{achievement}</li>)}</ul></div></article>)}</div></section>

        <section className="section-wrap section-block projects-section" id="projects"><SectionHeading eyebrow="Selected Work" title="Projects that show the full product journey" copy="Professional production work first, followed by independent SaaS and technical exploration." /><div className="filter-row" role="group" aria-label="Filter projects">{(["all", "professional", "independent"] as const).map((filter) => <button key={filter} className={projectFilter === filter ? "filter-button active" : "filter-button"} onClick={() => setProjectFilter(filter)}>{filter === "all" ? "All Work" : filter === "professional" ? "Professional" : "Independent Work"}</button>)}</div><div className="project-grid">{visibleProjects.map((project, index) => <article className={index < 3 ? "project-card project-featured" : "project-card"} key={project.title}><div className="project-card-top"><span className="project-number">0{index + 1}</span><span className="project-badge">{project.type === "professional" ? "Production / Client Work" : "Full-Stack AI SaaS"}</span></div><h3>{project.title.replace(" — Government Client", "")}</h3><p>{project.description}</p><div className="tech-list">{project.tech.split(", ").map((technology) => <span key={technology}>{technology}</span>)}</div>{project.achievements && <ul className="project-bullets">{project.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>}<div className="project-links">{project.links?.map((link) => <ExternalLink href={link} label={link.includes("issb.gov") ? "Live Site" : "View Project"} />)}</div></article>)}</div><div className="other-work"><div><span className="eyebrow">Other Technical Work</span><h3>Experiments that extend the engineering practice</h3></div><div className="other-work-copy"><p>{otherWork?.achievements?.join(" ")}</p><div className="tech-list"><span>Machine Learning</span><span>Transfer Learning</span><span>n8n Workflows</span></div></div></div></section>

        <section className="section-wrap section-block skills-section" id="skills"><SectionHeading eyebrow="Toolkit" title="Technical Skills" copy="A practical stack for building, integrating, and shipping full-stack products." /><div className="skills-toolbar"><span>Search the stack</span><input aria-label="Search skills" value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} placeholder="e.g. Next.js, PostgreSQL, Gemini" /></div><div className="skills-grid">{skillGroups.map((group) => { const items = group.items.filter((item) => item.toLowerCase().includes(skillSearch.toLowerCase())); return <div className={group.featured ? "skill-group featured" : "skill-group"} key={group.name}><h3>{group.name}</h3><div>{items.map((item) => <span key={item}>{item}</span>)}</div></div>; })}</div></section>

        <section className="section-wrap split-section" id="research"><div><SectionHeading eyebrow="Research & Technical Exploration" title="Curiosity with technical depth" copy="Research remains a supporting strength alongside full-stack engineering." /><div className="research-list">{resumeData.research.map((item) => <article className="research-item" key={item.title}><div><span className="status">{item.status}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.publication}</small></div>{item.link && <ExternalLink href={item.link} label="Challenge site" />}</article>)}</div></div><div className="education-panel"><SectionHeading eyebrow="Education" title="Academic foundation" /><div className="education-list">{resumeData.education.map((item) => <article key={item.degree}><GraduationCap size={20} /><div><h3>{item.degree}</h3><p>{item.institution}</p><span>{item.period} · {item.cvData}</span></div></article>)}</div></div></section>

        <section className="activities section-wrap"><SectionHeading eyebrow="Additional Activities" title="Selected community and competition work" /><div className="activities-grid">{resumeData.achievements.map((item) => <article key={item.title}><div><span>{item.period}</span><h3>{item.title}</h3></div><p>{item.description}</p>{item.links?.map((link) => <ExternalLink href={link} label="Open link" />)}</article>)}</div></section>

        <section className="contact-section" id="contact"><div className="section-wrap contact-inner"><div><span className="eyebrow">Let’s build something useful.</span><h2>Open to thoughtful product engineering work.</h2><p>Open to Full Stack Developer, Software Engineer, and relevant AI-integrated product engineering opportunities in Islamabad, Rawalpindi, and suitable remote roles.</p></div><div className="contact-actions"><a className="button button-primary" href={`mailto:${resumeData.email}`}><Mail size={17} /> Email Me</a><a className="button button-light" href={resumeData.cvUrl} download="Suhama_Mustafa_Full_Stack_CV.pdf"><Download size={16} /> Download CV</a></div></div></section>
  </main>
  <footer className="footer section-wrap"><span>© {new Date().getFullYear()} Suhama Mustafa</span><div><a href={resumeData.socials.github} target="_blank" rel="noreferrer">GitHub</a><a href={resumeData.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${resumeData.email}`}>Email</a></div></footer>
  </div>
  );
}
