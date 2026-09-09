import localFont from "next/font/local";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Playfair_Display } from "next/font/google";

// Luciole: Laurent Bourcellier & Jonathan Perez, CC BY 4.0.
// License and attribution: public/fonts/luciole/LICENSE.txt
const luciole = localFont({
  src: [
    { path: "../../public/fonts/luciole/Luciole-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/luciole/Luciole-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-luciole",
  preload: true,
  display: "optional",
  adjustFontFallback: "Arial",
});

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  metadataBase: new URL("https://www.rekhatenjarla.com"),
  colorScheme: "light",
  title: {
    default: "Rekha Tenjarla",
    template: "%s | Rekha Tenjarla",
  },
  description:
    "Rekha Tenjarla is a creative technologist at Fathom Information Design, interested in storytelling, interaction, and systems.",
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
      "Creative technologist and journalist building stories and interactive tools",
    siteName: "Rekha Tenjarla",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Rekha Tenjarla",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rekha Tenjarla",
    description:
      "Creative technologist and journalist building stories and interactive tools",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html style={{ background: "#f7f1ec", color: "#171717" }} lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body className={`${luciole.variable} ${playfair.className} ${playfair.variable} ${geistSans.variable} ${geistMono.variable} ${pixelFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
