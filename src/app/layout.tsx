import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lucid",
  description:
    "Turns vague, contradictory stakeholder input into a quality-scored backlog.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
