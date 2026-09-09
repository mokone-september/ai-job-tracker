"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const storageKey = "ai-job-tracker-resume";

type Resume = {
  name: string;
  headline: string;
  contact: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
};

const emptyResume: Resume = { name: "", headline: "", contact: "", summary: "", experience: "", education: "", skills: "" };

export default function ResumePage() {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume>(emptyResume);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setResume({ ...emptyResume, ...JSON.parse(stored) });
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  function updateField(field: keyof Resume, value: string) {
    setResume((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function saveResume() {
    window.localStorage.setItem(storageKey, JSON.stringify(resume));
    setSaved(true);
  }

  function clearResume() {
    window.localStorage.removeItem(storageKey);
    setResume(emptyResume);
    setSaved(false);
  }

  const cvText = [
    resume.name, resume.headline, resume.contact, resume.summary,
    resume.experience ? `Experience\n${resume.experience}` : "",
    resume.education ? `Education\n${resume.education}` : "",
    resume.skills ? `Skills\n${resume.skills}` : "",
  ].filter(Boolean).join("\n\n");

  return (
    <main className="resume-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>Resume manager</h1>
          <p className="analysis-subtitle">Keep one polished working draft ready for every application.</p>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      <div className="resume-layout">
        <form className="resume-form" onSubmit={(event) => { event.preventDefault(); saveResume(); }}>
          <div className="resume-form-heading"><div><h2>Resume details</h2><p>Your draft is stored in this browser.</p></div>{saved && <span className="save-status" role="status">Saved</span>}</div>
          <div className="resume-form-grid">
            <ResumeField label="Name" value={resume.name} onChange={(value) => updateField("name", value)} />
            <ResumeField label="Professional headline" value={resume.headline} onChange={(value) => updateField("headline", value)} placeholder="Frontend developer | React specialist" />
          </div>
          <ResumeField label="Contact details" value={resume.contact} onChange={(value) => updateField("contact", value)} placeholder="Email, phone, LinkedIn, location" />
          <ResumeField label="Professional summary" value={resume.summary} onChange={(value) => updateField("summary", value)} rows={5} placeholder="A concise summary of your experience and direction..." />
          <ResumeField label="Experience" value={resume.experience} onChange={(value) => updateField("experience", value)} rows={9} placeholder="Role, company, dates, achievements, and measurable results..." />
          <ResumeField label="Education" value={resume.education} onChange={(value) => updateField("education", value)} rows={4} placeholder="Qualification, institution, and dates..." />
          <ResumeField label="Skills" value={resume.skills} onChange={(value) => updateField("skills", value)} rows={4} placeholder="Separate skills with commas or line breaks..." />
          <div className="resume-actions"><button type="submit">Save resume</button><button type="button" className="secondary-button" onClick={() => window.print()}>Print / PDF</button><button type="button" className="quiet-button" onClick={clearResume}>Clear draft</button></div>
        </form>

        <section className="resume-preview" aria-label="Resume preview">
          <div className="preview-heading"><span>Live preview</span><span>{cvText.length} characters</span></div>
          <article className="resume-paper">
            <h2>{resume.name || "Your name"}</h2><p className="resume-headline">{resume.headline || "Your professional headline"}</p><p className="resume-contact">{resume.contact || "Contact details"}</p>
            <PreviewSection title="Profile" text={resume.summary} /><PreviewSection title="Experience" text={resume.experience} /><PreviewSection title="Education" text={resume.education} /><PreviewSection title="Skills" text={resume.skills} />
          </article>
          <div className="resume-links"><Link href="/cv-analysis">Analyze this resume →</Link><Link href="/interview-prep">Prepare for interviews →</Link></div>
        </section>
      </div>
    </main>
  );
}

function ResumeField({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }) {
  return <label className="resume-field">{label}{rows ? <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}</label>;
}

function PreviewSection({ title, text }: { title: string; text: string }) {
  return <section className="preview-section"><h3>{title}</h3><p>{text || "Add details in the editor to build this section."}</p></section>;
}