"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import nlp from "compromise";
import SyntaxOrchestraScene from "../../../components/SyntaxOrchestraScene";

const TAG_FREQUENCIES = {
  Verb: 330,
  Noun: 220,
  Adjective: 440,
  Adverb: 520,
  Pronoun: 260,
  Determiner: 200,
  Preposition: 300,
  Conjunction: 280,
  Value: 600,
  QuestionWord: 480,
  Other: 240,
};

const pickTag = (tags) => {
  if (!tags) return "Other";
  if (tags.Verb) return "Verb";
  if (tags.Noun) return "Noun";
  if (tags.Adjective) return "Adjective";
  if (tags.Adverb) return "Adverb";
  if (tags.Pronoun) return "Pronoun";
  if (tags.Determiner) return "Determiner";
  if (tags.Preposition) return "Preposition";
  if (tags.Conjunction) return "Conjunction";
  if (tags.Value) return "Value";
  if (tags.QuestionWord) return "QuestionWord";
  return "Other";
};

export default function SyntaxOrchestraPage() {
  const [text, setText] = useState(
    "Language is a structure you can hear if you let it speak."
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const timersRef = useRef([]);

  const terms = useMemo(() => {
    const doc = nlp(text || "");
    const json = doc.terms().json();
    return json.map((term) => ({
      text: term.text,
      tags: term.tags,
    }));
  }, [text]);

  const stop = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    setIsPlaying(false);
  };

  const play = async () => {
    stop();
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    setIsPlaying(true);

    terms.forEach((term, index) => {
      const timer = window.setTimeout(() => {
        const tag = pickTag(term.tags);
        const frequency = TAG_FREQUENCIES[tag] || TAG_FREQUENCIES.Other;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(
          0.25,
          audioContext.currentTime + 0.03
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime + 0.35
        );
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
      }, index * 160);
      timersRef.current.push(timer);
    });

    const doneTimer = window.setTimeout(() => {
      setIsPlaying(false);
    }, terms.length * 160 + 500);
    timersRef.current.push(doneTimer);
  };

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
        <span className="text-zinc-600">Syntax Orchestra</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Syntax Orchestra
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-700">
          A sentence becomes a constellation of parts of speech. Each note is
          pitched by grammar, each node by structure.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <textarea
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="geist-mono w-full max-w-2xl rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-zinc-500 focus:outline-none"
          placeholder="Type a sentence to score"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={play}
            disabled={isPlaying}
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
          >
            Play
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!isPlaying}
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </div>

      <SyntaxOrchestraScene terms={terms} />
    </div>
  );
}
