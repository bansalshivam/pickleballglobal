import Link from "next/link";
import { createClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";

// Landing page. If someone is already logged in, send them to the dashboard.
export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="container">
        <nav className="nav">
          <span className="logo">
            <span className="logo-dot" />
            PickleClub
          </span>
          <div className="nav-actions">
            <Link href="/login">Log in</Link>
          </div>
        </nav>
      </div>

      <div className="container">
        <section className="hero">
          <h1>Your local pickleball community</h1>
          <p>
            Training, events, and players — all in one place. Join the club and
            stay connected with everyone on the court.
          </p>
          <Link href="/login" className="btn btn-primary">
            Get started
          </Link>

          <div className="photos">
            <div className="photo">Club photo</div>
            <div className="photo">Court action</div>
            <div className="photo">Community</div>
          </div>
        </section>
      </div>
    </>
  );
}
