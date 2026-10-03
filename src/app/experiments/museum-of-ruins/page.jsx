import Museum from "./museum";
const description =
  "The unraveling of public institutions and our collective civic life. An immersive exhibition by Rekha Tenjarla.";

export const metadata = {
  title: "Museum of Ruins",
  description,
  alternates: { canonical: "/experiments/museum-of-ruins" },
  openGraph: {
    type: "website",
    title: "Museum of Ruins",
    description,
    url: "/experiments/museum-of-ruins",
    images: [{
      url: "/museum-of-ruins/share.png",
      width: 1200,
      height: 630,
      alt: "Museum of Ruins — An exploration of loss. An immersive exhibition by Rekha Tenjarla.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Museum of Ruins",
    description,
    images: ["/museum-of-ruins/share.png"],
  },
};
export default function Page() {
  return <Museum />;
}
