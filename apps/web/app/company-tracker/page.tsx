"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

type Draft = {
  name: string;
  role: string;
  status: CompanyStatus;
  notes: string;
  url: string;
  lastContact: string;
};

const defaultDraft: Draft = {
  name: "",
  role: "",
  status: "Interested",
  notes: "",
  url: "",
  lastContact: "",
};

const statusOrder: CompanyStatus[] = ["Interested", "Applied", "Interviewing", "Offer", "Rejected"];

export default function CompanyTrackerPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CompanyStatus>("All");

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

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(companies));
  }, [companies]);

  const visibleCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return companies.filter((company) => {
      const matchesSearch = !normalized || `${company.name} ${company.role} ${company.notes}`.toLowerCase().includes(normalized);
      const matchesStatus = statusFilter === "All" || company.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, query, statusFilter]);

  function updateDraft(field: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = draft.name.trim();
    if (!cleanName) {
      return;
    }

    const nextCompany: Company = {
      id: crypto.randomUUID(),
      name: cleanName,
      role: draft.role.trim(),
      status: draft.status,
      notes: draft.notes.trim(),
      url: draft.url.trim(),
      lastContact: draft.lastContact.trim(),
      createdAt: new Date().toISOString(),
    };

    setCompanies((current) => [nextCompany, ...current]);
    setDraft(defaultDraft);
  }

  function updateStatus(id: string, nextStatus: CompanyStatus) {
    setCompanies((current) =>
      current.map((company) =>
        company.id === id ? { ...company, status: nextStatus, lastContact: new Date().toISOString() } : company,
      ),
    );
  }

  function removeCompany(id: string) {
    setCompanies((current) => current.filter((company) => company.id !== id));
  }

  return (
    <main className="company-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>Company tracker</h1>
          <p className="analysis-subtitle">Keep tabs on employers, roles, and the actual status of each application.</p>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      <div className="company-layout">
        <section className="company-form-panel">
          <h2>Add a company</h2>
          <form className="company-form" onSubmit={handleSubmit}>
            <label>
              Company name
              <input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} placeholder="Acme Studio" />
            </label>
            <label>
              Role
              <input value={draft.role} onChange={(event) => updateDraft("role", event.target.value)} placeholder="Senior Product Designer" />
            </label>
            <label>
              Status
              <select value={draft.status} onChange={(event) => updateDraft("status", event.target.value as CompanyStatus)}>
                {statusOrder.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label>
              Role URL
              <input value={draft.url} onChange={(event) => updateDraft("url", event.target.value)} placeholder="https://company.com/jobs/123" />
            </label>
            <label>
              Last contact
              <input value={draft.lastContact} onChange={(event) => updateDraft("lastContact", event.target.value)} placeholder="2026-09-09" />
            </label>
            <label>
              Notes
              <textarea value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} rows={5} placeholder="Hiring manager, interview feedback, follow-up plan..." />
            </label>
            <button type="submit">Save company</button>
          </form>
        </section>

        <section className="company-list-panel">
          <div className="company-toolbar">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies or roles" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | CompanyStatus)}>
              <option value="All">All stages</option>
              {statusOrder.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="dashboard-actions company-dashboard-link">
            <Link href="/dashboard">Open dashboard</Link>
          </div>

          {visibleCompanies.length === 0 ? (
            <div className="company-empty">
              <span className="analysis-mark">✦</span>
              <h2>No companies yet</h2>
              <p>Add your first target company and keep the application pipeline moving.</p>
            </div>
          ) : (
            <div className="company-list">
              {visibleCompanies.map((company) => (
                <article key={company.id} className="company-card">
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

                  <div className="company-actions">
                    <select value={company.status} onChange={(event) => updateStatus(company.id, event.target.value as CompanyStatus)}>
                      {statusOrder.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button type="button" className="danger-button" onClick={() => removeCompany(company.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
