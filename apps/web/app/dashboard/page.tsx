"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const storageKey = "ai-job-tracker-companies";

type CompanyStatus = "Interested" | "Applied" | "Interviewing" | "Offer" | "Rejected";

type Company = {
  id: string;
  name: string;
  role: string;
  status: CompanyStatus;
  notes: string;
  url: string;
  lastContact: string;
  createdAt: string;
};

const statusOrder: CompanyStatus[] = ["Interested", "Applied", "Interviewing", "Offer", "Rejected"];

export default function DashboardPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Company[];
        if (Array.isArray(parsed)) {
          setCompanies(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const metrics = useMemo(() => {
    const counts = {
      total: companies.length,
      interested: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
    };

    for (const company of companies) {
      const key = company.status.toLowerCase() as keyof typeof counts;
      counts[key] = (counts[key] ?? 0) + 1;
    }

    return counts;
  }, [companies]);

  const recentCompanies = useMemo(
    () => [...companies].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [companies],
  );

  const stageBreakdown = statusOrder.map((status) => ({
    status,
    count: companies.filter((company) => company.status === status).length,
  }));

  return (
    <main className="dashboard-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>Job application dashboard</h1>
          <p className="analysis-subtitle">A quick overview of where every application stands.</p>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      {companies.length === 0 ? (
        <section className="dashboard-empty">
          <span className="analysis-mark">✦</span>
          <h2>No applications yet</h2>
          <p>Add a company in the tracker to start building your job pipeline.</p>
          <div className="dashboard-actions">
            <Link href="/company-tracker">Add your first company</Link>
          </div>
        </section>
      ) : (
        <div className="dashboard-content">
          <section className="dashboard-grid">
            <article className="metric-card">
              <span>Total</span>
              <strong>{metrics.total}</strong>
            </article>
            <article className="metric-card">
              <span>Applied</span>
              <strong>{metrics.applied}</strong>
            </article>
            <article className="metric-card">
              <span>Interviewing</span>
              <strong>{metrics.interviewing}</strong>
            </article>
            <article className="metric-card">
              <span>Offers</span>
              <strong>{metrics.offer}</strong>
            </article>
          </section>

          <section className="dashboard-panels">
            <div className="dashboard-panel">
              <h2>Pipeline</h2>
              <ul className="stage-list">
                {stageBreakdown.map((stage) => (
                  <li key={stage.status}>
                    <span>{stage.status}</span>
                    <strong>{stage.count}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dashboard-panel">
              <h2>Recent activity</h2>
              <ul className="activity-list">
                {recentCompanies.map((company) => (
                  <li key={company.id}>
                    <div>
                      <strong>{company.name}</strong>
                      <span>{company.role || "Role pending"}</span>
                    </div>
                    <span className={`status-badge status-${company.status.toLowerCase()}`}>{company.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="dashboard-panel wide-panel">
            <h2>Tracked companies</h2>
            <div className="company-list dashboard-company-list">
              {companies.map((company) => (
                <article key={company.id} className="company-card dashboard-company-card">
                  <div className="company-card-header">
                    <div>
                      <h3>{company.name}</h3>
                      {company.role && <p>{company.role}</p>}
                    </div>
                    <span className={`status-badge status-${company.status.toLowerCase()}`}>{company.status}</span>
                  </div>

                  <div className="company-meta">
                    {company.lastContact && <span>Last contact: {company.lastContact}</span>}
                    {company.url && (
                      <a href={company.url} target="_blank" rel="noreferrer">
                        Open role
                      </a>
                    )}
                  </div>

                  {company.notes && <p className="company-notes">{company.notes}</p>}
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
