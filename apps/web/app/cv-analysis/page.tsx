"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

type Analysis = {
  summary: string;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keywords: string[];
};

export default function CvAnalysisPage() {
  const { user } = useAuth();
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Analysis failed.");
      setAnalysis(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="analysis-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>CV analysis</h1>
          <p className="analysis-subtitle">
            Turn a draft CV into a sharper, more targeted application.
          </p>
          <Link className="analysis-tool-link" href="/interview-prep">Prepare for an interview →</Link>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      <div className="analysis-layout">
        <form className="analysis-form" onSubmit={handleSubmit}>
          <label>
            Your CV text
            <textarea
              required
              minLength={80}
              value={cvText}
              onChange={(event) => setCvText(event.target.value)}
              placeholder="Paste your CV text here..."
              rows={16}
            />
          </label>
          <label>
            Target job description <span>(optional)</span>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste a job description to identify missing keywords..."
              rows={8}
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? "Reviewing your CV..." : "Analyze my CV"}
          </button>
        </form>

        <section className="analysis-result" aria-live="polite">
          {!analysis && !isAnalyzing && (
            <div className="analysis-empty">
              <span className="analysis-mark">✦</span>
              <h2>Your review will appear here</h2>
              <p>Paste your CV and an optional role description to get a focused score, strengths, gaps, and next edits.</p>
            </div>
          )}
          {isAnalyzing && <p className="analysis-loading">Reading your experience and looking for evidence...</p>}
          {analysis && (
            <div className="analysis-content">
              <div className="score-row">
                <div>
                  <p className="eyebrow">Match score</p>
                  <strong>{analysis.score}<small>/100</small></strong>
                </div>
                <div className="score-bar"><span style={{ width: `${analysis.score}%` }} /></div>
              </div>
              <p className="analysis-summary">{analysis.summary}</p>
              <AnalysisGroup title="What is working" items={analysis.strengths} />
              <AnalysisGroup title="What to improve" items={analysis.gaps} />
              <AnalysisGroup title="Recommended edits" items={analysis.recommendations} />
              {analysis.keywords.length > 0 && (
                <div className="keyword-group">
                  <h3>Detected keywords</h3>
                  <div className="keyword-list">{analysis.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AnalysisGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="analysis-group">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
