"use client";

import { useEffect, useRef, useState } from "react";
import SpectrogramScene from "../../components/SpectrogramScene";

export default function ExperimentsPage() {
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Mic off");

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startMic = async () => {
    try {
      setStatus("Requesting mic access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
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

  const stopMic = async () => {
    if (audioContextRef.current) {
      await audioContextRef.current.close();
    }
    analyserRef.current = null;
    audioContextRef.current = null;
    sourceRef.current = null;
    setIsActive(false);
    setStatus("Mic off");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16 text-black sm:px-12 lg:px-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Experiments
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Live Spectrogram
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-700">
          A shader-driven 3D spectrogram rendered in real time from your microphone.
          Click enable to let the system listen, then speak, tap, or play audio.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
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
          onClick={stopMic}
          disabled={!isActive}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-500 disabled:opacity-50"
        >
          Stop
        </button>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          {status}
        </span>
      </div>

      <SpectrogramScene analyserRef={analyserRef} isActive={isActive} />
    </div>
  );
}
