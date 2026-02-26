"use client";

import { useState } from "react";
import Link from "next/link";
import WordFieldScene from "../../../components/WordFieldScene";

export default function WordFieldPage() {
  const [text, setText] = useState("ECHO");

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
        <span className="text-zinc-600">Word Field</span>
      </nav>
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Word Field</h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-700">
          Type a word and watch it become a sculpted field you can perturb with
          your cursor.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a word"
          className="geist-mono w-full max-w-sm rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <WordFieldScene text={text} />
    </div>
  );
}
