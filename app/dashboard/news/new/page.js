"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../lib/supabase-client";

export default function NewNewsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("news").insert({
      title,
      body: body || null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="container form-page">
      <Link href="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>
      <h1>Post club news</h1>

      {error && <div className="message message-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Headline</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New courts opening next month"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="body">Details</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share the news with the club…"
            rows={5}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Posting…" : "Post news"}
        </button>
      </form>
    </div>
  );
}
