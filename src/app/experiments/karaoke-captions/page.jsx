"use client";

import Link from "next/link";
import KaraokeCaptions from "../../../components/KaraokeCaptions";

export default function KaraokeCaptionsPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16 text-black sm:px-12 lg:px-16">
      <nav className="geist-mono text-[11px] uppercase tracking-[0.35em] text-zinc-500">
        <Link href="/" className="hover:text-zinc-700">
          Home
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <Link href="/experiments" className="hover:text-zinc-700">
          Experiments
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-600">Karaoke Captions</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Karaoke Captions
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-700">
          A living transcript system: time-aligned, expressive, and tuned to
          voice.
        </p>
      </header>

      <KaraokeCaptions />
    </div>
  );
}
