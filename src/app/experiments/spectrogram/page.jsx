"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SpectrogramScene from "../../../components/SpectrogramScene";

export default function SpectrogramPage() {
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const audioRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Demo ready");
  const [mode, setMode] = useState("demo");
  const [baseColor, setBaseColor] = useState("#2b0f5c");
  const [highlightColor, setHighlightColor] = useState("#d7a6ff");

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const ensureContext = () => {
    if (audioContextRef.current) return audioContextRef.current;
    audioContextRef.current = new (
      window.AudioContext || window.webkitAudioContext
    )();
    return audioContextRef.current;
  };

  const startDemo = async () => {
    try {
      setMode("demo");
      setStatus("Loading demo audio...");
      const audioContext = ensureContext();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.2;

      const audioEl = audioRef.current;
      if (!audioEl) return;
      audioEl.crossOrigin = "anonymous";
      const source = audioContext.createMediaElementSource(audioEl);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyserRef.current = analyser;
      sourceRef.current = source;

      await audioEl.play();
      setIsActive(true);
      setStatus("Demo playing");
    } catch (error) {
      console.error(error);
      setStatus("Demo failed");
    }
  };

  const startMic = async () => {
    try {
      setMode("mic");
      setStatus("Requesting mic access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = ensureContext();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.2;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyserRef.current = analyser;
      audioContextRef.current = audioContext;
      sourceRef.current = source;

      setIsActive(true);
      setStatus("Listening");
    } catch (error) {
      console.error(error);
      setStatus("Mic blocked");
    }
  };

  const stopAudio = async () => {
    if (audioContextRef.current) {
      await audioContextRef.current.close();
    }
    analyserRef.current = null;
    audioContextRef.current = null;
    sourceRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsActive(false);
    setStatus("Stopped");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16 text-black sm:px-12 lg:px-16">
      <nav className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        <Link href="/" className="hover:text-zinc-700">
          Home
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <Link href="/experiments" className="hover:text-zinc-700">
          Experiments
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-600">Spectrogram</span>
      </nav>
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Live Spectrogram
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-700">
          A 3D spectrogram rendered in real time from your microphone using
          shaders.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={startDemo}
          disabled={isActive && mode === "demo"}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
        >
          Play demo
        </button>
        <button
          type="button"
          onClick={startMic}
          disabled={isActive}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
        >
          Enable mic
        </button>
        <button
          type="button"
          onClick={stopAudio}
          disabled={!isActive}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
        >
          Stop
        </button>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          {status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <label className="flex items-center gap-3">
          Base color
          <input
            type="color"
            value={baseColor}
            onChange={(event) => setBaseColor(event.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-zinc-300 bg-white"
            aria-label="Base color"
          />
        </label>
        <label className="flex items-center gap-3">
          Highlight
          <input
            type="color"
            value={highlightColor}
            onChange={(event) => setHighlightColor(event.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-zinc-300 bg-white"
            aria-label="Highlight color"
          />
        </label>
      </div>

      <audio ref={audioRef} src="/audio/only-shallow.mp3" />

      <SpectrogramScene
        analyserRef={analyserRef}
        isActive={isActive}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
    </div>
  );
}
