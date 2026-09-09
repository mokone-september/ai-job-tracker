"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

type Preparation = {
  overview: string;
  questions: { question: string; whyItMatters: string; answerGuidance: string }[];
  talkingPoints: string[];
};

export default function InterviewPrepPage() {
  const { user } = useAuth();
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [preparation, setPreparation] = useState<Preparation | null>(null);
  const [error, setError] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPreparation(null);
    setIsPreparing(true);

    try {
      const response = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Preparation failed.");
      setPreparation(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Preparation failed.");
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <main className="analysis-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>Interview preparation</h1>
          <p className="analysis-subtitle">Turn your experience into clear, confident stories for the conversation ahead.</p>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      <div className="analysis-layout">
        <form className="analysis-form" onSubmit={handleSubmit}>
          <label>
            Your CV text
            <textarea required minLength={80} value={cvText} onChange={(event) => setCvText(event.target.value)} placeholder="Paste your CV text here..." rows={16} />
          </label>
          <label>
            Target job description <span>(optional)</span>
            <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the role description for more targeted questions..." rows={8} />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={isPreparing}>{isPreparing ? "Building your guide..." : "Prepare me"}</button>
        </form>

        <section className="analysis-result" aria-live="polite">
          {!preparation && !isPreparing && <div className="analysis-empty"><span className="analysis-mark">✦</span><h2>Your preparation guide will appear here</h2><p>Get role-specific questions, answer guidance, and the talking points worth rehearsing.</p></div>}
          {isPreparing && <p className="analysis-loading">Turning your experience into interview stories...</p>}
          {preparation && <div className="analysis-content">
            <p className="analysis-summary">{preparation.overview}</p>
            <div className="analysis-group"><h3>Questions to rehearse</h3><div className="question-list">{preparation.questions.map((item) => <article className="question-item" key={item.question}><h4>{item.question}</h4><p><strong>Why it matters:</strong> {item.whyItMatters}</p><p><strong>Answer guidance:</strong> {item.answerGuidance}</p></article>)}</div></div>
            <div className="analysis-group"><h3>Talking points</h3><ul>{preparation.talkingPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>
          </div>}
        </section>
      </div>
    </main>
  );
}