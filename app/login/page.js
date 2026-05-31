"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase-client";

// Login + signup on one screen. A toggle switches between the two modes.
// Both talk to Supabase Auth — no password handling code of our own.
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
      } else {
        setMessage({
          type: "info",
          text: "Check your email to confirm your account, then log in.",
        });
        setLoading(false);
      }
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link href="/" className="logo" style={{ marginBottom: "28px" }}>
          <span className="logo-dot" />
          PickleClub
        </Link>

        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-sub">
          {mode === "login"
            ? "Log in to your account"
            : "Join your local pickleball community"}
        </p>

        {message && (
          <div
            className={`message ${
              message.type === "error" ? "message-error" : "message-info"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        <div className="auth-foot">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button onClick={() => { setMode("signup"); setMessage(null); }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setMessage(null); }}>
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
