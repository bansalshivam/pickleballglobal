"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase-client";

// Toggles the current member's RSVP for one event and shows the count.
// Props:
//   eventId        - the event's id
//   initialGoing   - is the current user already going? (bool)
//   initialCount   - how many people are going (number)
export default function RsvpButton({ eventId, initialGoing, initialCount }) {
  const supabase = createClient();
  const [going, setGoing] = useState(initialGoing);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);

    if (going) {
      // Remove this user's RSVP for this event.
      const { error } = await supabase
        .from("rsvps")
        .delete()
        .eq("event_id", eventId);
      if (!error) {
        setGoing(false);
        setCount((c) => Math.max(0, c - 1));
      }
    } else {
      // Add an RSVP. user_id is filled by the column default (auth.uid()).
      const { error } = await supabase
        .from("rsvps")
        .insert({ event_id: eventId });
      if (!error) {
        setGoing(true);
        setCount((c) => c + 1);
      }
    }

    setBusy(false);
  }

  return (
    <div className="rsvp">
      <button
        onClick={toggle}
        disabled={busy}
        className={`btn btn-sm ${going ? "btn-going" : "btn-primary"}`}
      >
        {going ? "Going ✓" : "I'm going"}
      </button>
      <span className="rsvp-count">
        {count} {count === 1 ? "going" : "going"}
      </span>
    </div>
  );
}
