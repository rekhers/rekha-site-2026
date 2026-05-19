export const metadata = {
  title: "Deploy Check",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DeployCheckPage() {
  return (
    <main className="min-h-screen bg-[#f7f1ec] px-6 py-12 text-[#171717]">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center">
        <p className="geist-mono mb-6 text-xs uppercase tracking-[0.18em] text-[#6f5f54]">
          private deploy check
        </p>
        <h1 className="text-5xl leading-none text-[#4a274f] sm:text-7xl">
          Rekha can see this.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#3a322d]">
          If this page is live after deploy, the computer-to-site pipeline is
          working. Route stamp: 2026-05-08.
        </p>
        <p className="geist-mono mt-6 text-sm text-[#6f5f54]">
          Last deploy test: 2026-05-11 18:02:25 EDT.
        </p>
      </section>
    </main>
  );
}
