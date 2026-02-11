import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google"; // Using Google Fonts properly
import "./globals.css";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FloatingNav } from "@/components/FloatingNav";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clae | Advanced Institutional Portal",
  description: "Secure Enrollment & Admissions System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <body className="font-rajdhani antialiased text-foreground bg-white selection:bg-emerald-500/30">
        <Providers>
          <AnimatedBackground />
          <main className="relative z-10 min-h-screen flex flex-col">
            {children}
          </main>
          <FloatingNav />
        </Providers>
      </body>
    </html>
  );
}
