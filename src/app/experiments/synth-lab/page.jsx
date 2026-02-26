import Link from "next/link";
import SynthLab from "../../../components/SynthLab";

export default function SynthLabPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-16 text-black sm:px-12 lg:px-16">
      <nav className="geist-mono text-[11px] uppercase tracking-[0.35em] text-zinc-500">
        <Link href="/" className="hover:text-zinc-700">
          Home
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <Link href="/experiments" className="hover:text-zinc-700">
          Experiments
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-600">Polyphonic Synth</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Polyphonic Synth and Sequencer
        </h1>
        <p className="max-w-3xl text-base leading-7 text-zinc-700">
          Browser poly synth and sequencer with ADSR, filter shaping, delay/reverb
          FX, and playable keyboard controls.
        </p>
      </header>

      <SynthLab />
    </div>
  );
}
