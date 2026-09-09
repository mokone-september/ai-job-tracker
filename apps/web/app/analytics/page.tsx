"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const storageKey = "ai-job-tracker-companies";
const statusOrder = ["Interested", "Applied", "Interviewing", "Offer", "Rejected"] as const;
type CompanyStatus = (typeof statusOrder)[number];

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

function monthLabel(date: Date) {
  return date.toLocaleDateString("en", { month: "short" });
}

export default function AnalyticsPage() {
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

  const analytics = useMemo(() => {
    const counts = Object.fromEntries(statusOrder.map((status) => [status, 0])) as Record<CompanyStatus, number>;
    companies.forEach((company) => {
      if (company.status in counts) counts[company.status] += 1;
    });

    const appliedOrFurther = companies.filter((company) => statusOrder.indexOf(company.status) >= 1).length;
    const interviewingOrFurther = companies.filter((company) => statusOrder.indexOf(company.status) >= 2).length;
    const contacted = companies.filter((company) => company.lastContact.trim()).length;
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const count = companies.filter((company) => {
        const created = new Date(company.createdAt);
        return created.getFullYear() === date.getFullYear() && created.getMonth() === date.getMonth();
      }).length;
      return { label: monthLabel(date), count };
    });

    return {
      counts,
      months,
      total: companies.length,
      appliedRate: companies.length ? Math.round((appliedOrFurther / companies.length) * 100) : 0,
      interviewRate: appliedOrFurther ? Math.round((interviewingOrFurther / appliedOrFurther) * 100) : 0,
      offerRate: interviewingOrFurther ? Math.round((counts.Offer / interviewingOrFurther) * 100) : 0,
      contactRate: companies.length ? Math.round((contacted / companies.length) * 100) : 0,
    };
  }, [companies]);

  const maxMonthlyCount = Math.max(...analytics.months.map((month) => month.count), 1);

  return (
    <main className="analytics-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>Search analytics</h1>
          <p className="analysis-subtitle">See where your applications move, where they stall, and how consistently you follow up.</p>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      {analytics.total === 0 ? (
        <section className="dashboard-empty">
          <span className="analysis-mark">✦</span>
          <h2>Analytics will appear here</h2>
          <p>Add companies to your tracker to start measuring your job-search pipeline.</p>
          <div className="dashboard-actions"><Link href="/company-tracker">Add a company</Link></div>
        </section>
      ) : (
        <div className="analytics-content">
          <section className="analytics-metrics">
            <article className="metric-card"><span>Total tracked</span><strong>{analytics.total}</strong></article>
            <article className="metric-card"><span>Applied or beyond</span><strong>{analytics.appliedRate}%</strong><small>of tracked companies</small></article>
            <article className="metric-card"><span>Interview conversion</span><strong>{analytics.interviewRate}%</strong><small>of applications</small></article>
            <article className="metric-card"><span>Follow-up coverage</span><strong>{analytics.contactRate}%</strong><small>with contact notes</small></article>
          </section>

          <section className="analytics-panels">
            <div className="dashboard-panel analytics-panel">
              <h2>Pipeline distribution</h2>
              <div className="analytics-bars">
                {statusOrder.map((status) => (
                  <div className="analytics-bar-row" key={status}>
                    <div className="analytics-bar-label"><span>{status}</span><strong>{analytics.counts[status]}</strong></div>
                    <div className="analytics-bar-track"><span className={`analytics-bar-fill status-${status.toLowerCase()}`} style={{ width: `${analytics.total ? (analytics.counts[status] / analytics.total) * 100 : 0}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel analytics-panel">
              <h2>Conversion funnel</h2>
              <ul className="funnel-list">
                <li><span>Tracked</span><strong>{analytics.total}</strong></li>
                <li><span>Applied</span><strong>{analytics.appliedRate}%</strong></li>
                <li><span>Interviewing</span><strong>{analytics.interviewRate}%</strong></li>
                <li><span>Offer</span><strong>{analytics.offerRate}%</strong></li>
              </ul>
            </div>
          </section>

          <section className="dashboard-panel wide-panel analytics-panel">
            <h2>Applications added</h2>
            <div className="monthly-chart" aria-label="Applications added over the last six months">
              {analytics.months.map((month) => (
                <div className="monthly-column" key={`${month.label}-${month.count}`}>
                  <strong>{month.count}</strong>
                  <div className="monthly-track"><span style={{ height: `${(month.count / maxMonthlyCount) * 100}%` }} /></div>
                  <span>{month.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}