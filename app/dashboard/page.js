import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

// Format a date string like "Sat 14 Jun" (or empty if none).
function fmtDate(d) {
  if (!d) return "Date TBC";
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = user.email.split("@")[0];
  const initials = name.slice(0, 2).toUpperCase();

  // Fetch events (soonest first) and news (newest first).
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="container">
        <nav className="nav">
          <span className="logo">
            <span className="logo-dot" />
            PickleClub
          </span>
          <div className="nav-actions">
            <span className="avatar avatar-sm">{initials}</span>
            <LogoutButton />
          </div>
        </nav>
      </div>

      <div className="container dash-wrap">
        <header className="dash-head">
          <h1>Welcome back, {name}</h1>
          <p>Here's what's happening at the club.</p>
        </header>

        <section className="panel">
          <div className="panel-head">
            <h2>Upcoming events</h2>
            <Link href="/dashboard/events/new" className="btn btn-primary btn-sm">
              + Add event
            </Link>
          </div>

          {events && events.length > 0 ? (
            <ul className="list">
              {events.map((ev) => (
                <li key={ev.id} className="list-item">
                  <div className="list-date">{fmtDate(ev.event_date)}</div>
                  <div className="list-body">
                    <div className="list-title">{ev.title}</div>
                    {ev.location && (
                      <div className="list-meta">{ev.location}</div>
                    )}
                    {ev.description && (
                      <div className="list-desc">{ev.description}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">No events yet. Add the first one.</div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Club news</h2>
            <Link href="/dashboard/news/new" className="btn btn-primary btn-sm">
              + Add news
            </Link>
          </div>

          {news && news.length > 0 ? (
            <ul className="list">
              {news.map((n) => (
                <li key={n.id} className="list-item">
                  <div className="list-body">
                    <div className="list-title">{n.title}</div>
                    {n.body && <div className="list-desc">{n.body}</div>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">No news yet. Post the first update.</div>
          )}
        </section>
      </div>
    </>
  );
}
