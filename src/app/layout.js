import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.rekhatenjarla.com"),
  title: {
    default: "Rekha Tenjarla",
    template: "%s | Rekha Tenjarla",
  },
  description:
    "Rekha Tenjarla is a creative technologist and journalist building interactive, experimental stories at The Washington Post’s R&D Lab.",
  keywords: [
    "Rekha Tenjarla",
    "creative technologist",
    "interactive journalism",
    "data visualization",
    "storytelling",
    "Washington Post",
    "Lede Lab",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.rekhatenjarla.com",
    title: "Rekha Tenjarla",
    description:
      "Creative technologist and journalist crafting interactive stories at The Washington Post’s R&D Lab.",
    siteName: "Rekha Tenjarla",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rekha Tenjarla",
    description:
      "Creative technologist and journalist crafting interactive stories at The Washington Post’s R&D Lab.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html style={{ background: "black", color: "white" }} lang="en">
      <body className={playfair.className}>{children}</body>
    </html>
  );
}
