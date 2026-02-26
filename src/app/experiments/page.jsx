"use client";

import Link from "next/link";

export default function ExperimentsIndex() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16 text-black sm:px-12 lg:px-16">
      <nav className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        <Link href="/" className="hover:text-zinc-700">
          Home
        </Link>
      </nav>
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Experiments</h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-700">
          Small prototypes where I chase a feeling, test a system, or follow a
          question until it turns visual.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/experiments/synth-lab"
          className="group overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Audio
          </p>
          <h2 className="mt-3 text-lg font-semibold">Polyphonic Synth</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Browser poly synth with ADSR, filter shaping, and built-in FX.
          </p>
          <span className="mt-4 inline-flex text-sm text-zinc-800">
            Open →
          </span>
        </Link>
        <Link
          href="/experiments/spectrogram"
          className="group overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Audio
          </p>
          <h2 className="mt-3 text-lg font-semibold">Live Spectrogram</h2>
          <p className="mt-2 text-sm text-zinc-600">
            A realtime, shader-driven spectrogram that reacts to mic input or a
            demo track.
          </p>
          <span className="mt-4 inline-flex text-sm text-zinc-800">
            Open →
          </span>
        </Link>
      </div>
    </div>
  );
}
