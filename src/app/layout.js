import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
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
      <body className={`${playfair.className} ${pixelFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
