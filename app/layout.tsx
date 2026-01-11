import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glean English Review",
  description: "Teacher Tools for Classroom Interaction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
