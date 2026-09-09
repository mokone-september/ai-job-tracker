"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const storageKey = "ai-job-tracker-calendar";

type EventType = "Interview" | "Follow-up" | "Deadline" | "Reminder";
type ReminderOffset = "15 minutes before" | "1 hour before" | "1 day before";

type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  notes: string;
  reminderEnabled: boolean;
  reminderEmail: string;
  reminderOffset: ReminderOffset;
  createdAt: string;
};

const defaultDraft = {
  title: "",
  type: "Interview" as EventType,
  date: "",
  time: "",
  notes: "",
  reminderEnabled: false,
  reminderEmail: "",
  reminderOffset: "1 day before" as ReminderOffset,
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [draft, setDraft] = useState(defaultDraft);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as CalendarEvent[];
        if (Array.isArray(parsed)) {
          setEvents(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(events));
    }
  }, [events, hasLoaded]);

  const upcoming = useMemo(
    () => [...events].sort((a, b) => new Date(`${a.date}T${a.time || "00:00"}`).getTime() - new Date(`${b.date}T${b.time || "00:00"}`).getTime()),
    [events],
  );

  function updateDraft(field: keyof typeof defaultDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.date) {
      return;
    }

    const nextEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      type: draft.type,
      date: draft.date,
      time: draft.time,
      notes: draft.notes.trim(),
      reminderEnabled: draft.reminderEnabled,
      reminderEmail: draft.reminderEmail.trim() || user?.email || "",
      reminderOffset: draft.reminderOffset,
      createdAt: new Date().toISOString(),
    };

    setEvents((current) => [nextEvent, ...current]);
    setDraft(defaultDraft);
  }

  function removeEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return (
    <main className="calendar-shell">
      <header className="analysis-header">
        <div>
          <Link className="auth-back" href="/">← Back to home</Link>
          <p className="eyebrow">AI Job Tracker</p>
          <h1>Calendar</h1>
          <p className="analysis-subtitle">Track interviews, follow-ups, and key job-search deadlines.</p>
        </div>
        {user && <span className="account-chip">{user.username}</span>}
      </header>

      <div className="calendar-layout">
        <section className="company-form-panel calendar-form-panel">
          <h2>Add a reminder</h2>
          <form className="company-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Product design panel interview" />
            </label>
            <label>
              Type
              <select value={draft.type} onChange={(event) => updateDraft("type", event.target.value)}>
                <option value="Interview">Interview</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Deadline">Deadline</option>
                <option value="Reminder">Reminder</option>
              </select>
            </label>
            <div className="calendar-row">
              <label>
                Date
                <input type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
              </label>
              <label>
                Time
                <input type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} />
              </label>
            </div>
            <label>
              Notes
              <textarea value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} rows={5} placeholder="Zoom link, prep notes, hiring manager details..." />
            </label>
            <label className="checkbox-field">
              <input type="checkbox" checked={draft.reminderEnabled} onChange={(event) => setDraft((current) => ({ ...current, reminderEnabled: event.target.checked }))} />
              <span>Configure an email reminder</span>
            </label>
            {draft.reminderEnabled && (
              <div className="reminder-options">
                <label>
                  Reminder email
                  <input type="email" value={draft.reminderEmail || user?.email || ""} onChange={(event) => updateDraft("reminderEmail", event.target.value)} placeholder="you@example.com" required />
                </label>
                <label>
                  Send
                  <select value={draft.reminderOffset} onChange={(event) => updateDraft("reminderOffset", event.target.value)}>
                    <option value="15 minutes before">15 minutes before</option>
                    <option value="1 hour before">1 hour before</option>
                    <option value="1 day before">1 day before</option>
                  </select>
                </label>
                <p className="reminder-note">Reminder preferences are saved locally. Email delivery will be available after a provider and server scheduler are connected.</p>
              </div>
            )}
            <button type="submit">Add event</button>
          </form>
        </section>

        <section className="company-list-panel calendar-panel">
          <h2>Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="company-empty">
              <span className="analysis-mark">✦</span>
              <h2>No events yet</h2>
              <p>Add your next interview or follow-up to keep your schedule organized.</p>
            </div>
          ) : (
            <div className="calendar-list">
              {upcoming.map((event) => (
                <article key={event.id} className="calendar-item">
                  <div className="calendar-item-header">
                    <div>
                      <h3>{event.title}</h3>
                      <p>{event.type}</p>
                    </div>
                    <span className={`status-badge status-${event.type.toLowerCase()}`}>{event.type}</span>
                  </div>

                  <div className="company-meta">
                    <span>{event.date}</span>
                    {event.time && <span>{event.time}</span>}
                  </div>

                  {event.notes && <p className="company-notes">{event.notes}</p>}

                  {event.reminderEnabled && (
                    <p className="reminder-status">
                      Email reminder configured for {event.reminderEmail || user?.email || "your account"}, {event.reminderOffset}.
                    </p>
                  )}

                  <button type="button" className="danger-button" onClick={() => removeEvent(event.id)}>Remove</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
