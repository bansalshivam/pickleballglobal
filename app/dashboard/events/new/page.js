"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../lib/supabase-client";

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // created_by is filled automatically by the column default (auth.uid()).
    const { error } = await supabase.from("events").insert({
      title,
      location: location || null,
      event_date: eventDate || null,
      description: description || null,
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
      <h1>Add an event</h1>

      {error && <div className="message message-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Event title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Saturday morning doubles"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Court 3, Riverside Club"
          />
        </div>

        <div className="field">
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Open to all levels. Bring water!"
            rows={4}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Add event"}
        </button>
      </form>
    </div>
  );
}
