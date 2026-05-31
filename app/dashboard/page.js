import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

// The logged-in screen. Protected: if there's no user, bounce to /login.
export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use the part of the email before @ as a friendly name + initials.
  const name = user.email.split("@")[0];
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <>
      <div className="container">
        <nav className="nav">
          <span className="logo">
            <span className="logo-dot" />
            PickleClub
          </span>
          <div className="nav-actions">
            <LogoutButton />
          </div>
        </nav>
      </div>

      <div className="container">
        <div className="dash">
          <div className="avatar">{initials}</div>
          <h1>You&apos;re in</h1>
          <p>Welcome, {name}. This is where your dashboard will live.</p>
          <div className="placeholder">
            Training videos, events, and content are coming in milestone 2.
          </div>
        </div>
      </div>
    </>
  );
}
