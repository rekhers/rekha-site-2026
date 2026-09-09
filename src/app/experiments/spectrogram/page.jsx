"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SpectrogramScene from "../../../components/SpectrogramScene";

export default function SpectrogramPage() {
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const requestRef = useRef(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [baseColor, setBaseColor] = useState("#2b0f5c");
  const [highlightColor, setHighlightColor] = useState("#d7a6ff");

  useEffect(() => {
    return () => {
      requestRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      analyserRef.current = null;
      const context = audioContextRef.current;
      audioContextRef.current = null;
      if (context && context.state !== "closed") context.close().catch(console.error);
    };
  }, []);

  const startMic = async () => {
    if (isStarting || isActive) return;
    const request = ++requestRef.current;
    let stream;
    let context;
    setIsStarting(true);
    setStatus("Requesting mic access...");
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (request !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      context = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = context;
      if (context.state === "suspended") await context.resume();
      if (request !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        if (context.state !== "closed") await context.close();
        return;
      }
      const analyser = context.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.2;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;
      sourceRef.current = source;
      setIsActive(true);
      setStatus("Listening");
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      if (context && context.state !== "closed") context.close().catch(console.error);
      if (request === requestRef.current) {
        streamRef.current = null;
        audioContextRef.current = null;
        sourceRef.current = null;
        analyserRef.current = null;
        setIsActive(false);
        setStatus("Could not start microphone");
        console.error(error);
      }
    } finally {
      if (request === requestRef.current) setIsStarting(false);
    }
  };

  const stopAudio = () => {
    requestRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context && context.state !== "closed") context.close().catch(console.error);
    setIsStarting(false);
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
          onClick={startMic}
          disabled={isActive || isStarting}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={stopAudio}
          disabled={!isActive && !isStarting}
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

      <SpectrogramScene
        analyserRef={analyserRef}
        isActive={isActive}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
    </div>
  );
}
