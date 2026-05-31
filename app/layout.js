import "./globals.css";

export const metadata = {
  title: "PickleClub",
  description: "Your local pickleball community — training, events, and players in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
