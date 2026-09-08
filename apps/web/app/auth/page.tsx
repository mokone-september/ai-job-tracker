"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function AuthPage() {
  const router = useRouter();
  const { user, isLoading, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <main className="auth-shell">Loading your account...</main>;
  }

  if (user) {
    router.replace("/");
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ identifier, password });
      } else {
        await register({ username, email, password });
      }
      router.replace("/");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to authenticate. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="auth-title">
        <Link className="auth-back" href="/">← Back to home</Link>
        <p className="eyebrow">AI Job Tracker</p>
        <h1 id="auth-title">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="auth-intro">
          {mode === "login"
            ? "Sign in to keep your applications and next steps in one place."
            : "Start building a calmer, more organized job search."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <label>
              Username
              <input
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>
          )}

          {mode === "login" ? (
            <label>
              Email or username
              <input
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
              />
            </label>
          ) : (
            <label>
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
          )}

          <label>
            Password
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
