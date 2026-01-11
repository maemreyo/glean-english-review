import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Glean English Review",
  description: "Teacher Tools for Classroom Interaction",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body
        className={`${nunito.variable} font-sans antialiased`}
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
          }}>
            <Header params={params} />
            <main>{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
