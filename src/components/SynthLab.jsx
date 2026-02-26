"use client";

import { useEffect, useMemo, useRef, useState } from "react";
const SEQUENCER_STEPS = 16;

const KEYBOARD = [
  { note: "C4", key: "A", frequency: 261.63, type: "white", index: 0 },
  { note: "C#4", key: "W", frequency: 277.18, type: "black", between: 0 },
  { note: "D4", key: "S", frequency: 293.66, type: "white", index: 1 },
  { note: "D#4", key: "E", frequency: 311.13, type: "black", between: 1 },
  { note: "E4", key: "D", frequency: 329.63, type: "white", index: 2 },
  { note: "F4", key: "F", frequency: 349.23, type: "white", index: 3 },
  { note: "F#4", key: "T", frequency: 369.99, type: "black", between: 3 },
  { note: "G4", key: "G", frequency: 392.0, type: "white", index: 4 },
  { note: "G#4", key: "Y", frequency: 415.3, type: "black", between: 4 },
  { note: "A4", key: "H", frequency: 440.0, type: "white", index: 5 },
  { note: "A#4", key: "U", frequency: 466.16, type: "black", between: 5 },
  { note: "B4", key: "J", frequency: 493.88, type: "white", index: 6 },
  { note: "C5", key: "K", frequency: 523.25, type: "white", index: 7 },
];

const VARIATIONS = {
  velvet: {
    label: "Velvet",
    waveform: "triangle",
    attack: 0.03,
    decay: 0.24,
    sustain: 0.72,
    release: 0.36,
    reverbMix: 0.24,
    delayMix: 0.12,
    delayTime: 0.2,
    delayFeedback: 0.18,
    cutoff: 2600,
    resonance: 1.1,
    filterEnv: 1400,
    unisonDetune: 5,
    chorusMix: 0.38,
  },
  pulse: {
    label: "Pulse",
    waveform: "square",
    attack: 0.01,
    decay: 0.14,
    sustain: 0.34,
    release: 0.12,
    reverbMix: 0.08,
    delayMix: 0.26,
    delayTime: 0.22,
    delayFeedback: 0.38,
    cutoff: 1800,
    resonance: 2.2,
    filterEnv: 1800,
    unisonDetune: 9,
    chorusMix: 0.12,
  },
  glass: {
    label: "Glass",
    waveform: "sine",
    attack: 0.02,
    decay: 0.18,
    sustain: 0.58,
    release: 0.42,
    reverbMix: 0.34,
    delayMix: 0.16,
    delayTime: 0.31,
    delayFeedback: 0.26,
    cutoff: 5200,
    resonance: 0.9,
    filterEnv: 2500,
    unisonDetune: 3,
    chorusMix: 0.42,
  },
};

function createImpulseResponse(audioContext, seconds = 2.2, decay = 2.6) {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * seconds;
  const impulse = audioContext.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const n = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
    }
  }
  return impulse;
}

function Knob({ label, value, min, max, step, onChange, format }) {
  const normalized = (value - min) / (max - min);
  const deg = -135 + normalized * 270;
  return (
    <label className="synth-knob">
      <span>{label}</span>
      <div className="synth-knob-wrap">
        <input
          className="synth-knob-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <div
          className="synth-knob-face"
          style={{ "--knob-rotation": `${deg}deg` }}
          aria-hidden="true"
        />
      </div>
      <strong>{format(value)}</strong>
    </label>
  );
}

function WaveIcon({ type }) {
  const paths = {
    sine: "M2 20 C8 6, 16 6, 22 20 S36 34, 42 20",
    square: "M2 20 L2 8 L14 8 L14 32 L30 32 L30 8 L42 8 L42 20",
    sawtooth: "M2 30 L12 10 L12 30 L22 10 L22 30 L32 10 L32 30 L42 10",
    triangle: "M2 30 L12 10 L22 30 L32 10 L42 30",
  };
  return (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

export default function SynthLab() {
  const [waveform, setWaveform] = useState("sawtooth");
  const [attack, setAttack] = useState(0.02);
  const [decay, setDecay] = useState(0.22);
  const [sustain, setSustain] = useState(0.62);
  const [release, setRelease] = useState(0.26);
  const [reverbMix, setReverbMix] = useState(0.28);
  const [delayMix, setDelayMix] = useState(0.18);
  const [delayTime, setDelayTime] = useState(0.24);
  const [delayFeedback, setDelayFeedback] = useState(0.34);
  const [cutoff, setCutoff] = useState(2200);
  const [resonance, setResonance] = useState(1.4);
  const [filterEnv, setFilterEnv] = useState(1800);
  const [unisonDetune, setUnisonDetune] = useState(8);
  const [chorusMix, setChorusMix] = useState(0.24);
  const [octaveShift, setOctaveShift] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeNotes, setActiveNotes] = useState([]);
  const [activePreset, setActivePreset] = useState("velvet");
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [holdMode, setHoldMode] = useState(false);
  const [sequence, setSequence] = useState(() =>
    Array.from({ length: SEQUENCER_STEPS }, () => []),
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isSequencerPlaying, setIsSequencerPlaying] = useState(false);
  const [isSequencerRecord, setIsSequencerRecord] = useState(false);
  const [sequencerBpm, setSequencerBpm] = useState(104);
  const [sequencerWriteNote, setSequencerWriteNote] = useState("A4");

  const audioRef = useRef(null);
  const chainRef = useRef(null);
  const voicesRef = useRef(new Map());
  const scopeRef = useRef(null);
  const demoTimersRef = useRef([]);
  const sequencerTimerRef = useRef(null);
  const sequencerGateRef = useRef([]);
  const sequencerStepRef = useRef(0);
  const sequenceRef = useRef(sequence);
  const bpmRef = useRef(sequencerBpm);

  const keyMap = useMemo(() => {
    const map = new Map();
    KEYBOARD.forEach((k) => map.set(k.key.toLowerCase(), k));
    return map;
  }, []);

  const whiteKeys = useMemo(
    () => KEYBOARD.filter((note) => note.type === "white"),
    [],
  );
  const blackKeys = useMemo(
    () => KEYBOARD.filter((note) => note.type === "black"),
    [],
  );

  const updateMixes = (reverbAmount, delayAmount, chorusAmount) => {
    if (!chainRef.current) return;
    const dry = Math.max(
      0.1,
      1 - reverbAmount * 0.7 - delayAmount * 0.7 - chorusAmount * 0.65,
    );
    chainRef.current.dry.gain.value = dry;
    chainRef.current.reverbWet.gain.value = reverbAmount;
    chainRef.current.delayWet.gain.value = delayAmount;
    chainRef.current.chorusWet.gain.value = chorusAmount;
  };

  const setupAudio = () => {
    if (audioRef.current && chainRef.current) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const audioContext = new AudioCtx();
    const master = audioContext.createGain();
    const dry = audioContext.createGain();
    const reverbWet = audioContext.createGain();
    const delayWet = audioContext.createGain();
    const chorusWet = audioContext.createGain();
    const convolver = audioContext.createConvolver();
    const delay = audioContext.createDelay(1.8);
    const feedback = audioContext.createGain();
    const chorusDelay = audioContext.createDelay(0.08);
    const chorusLfo = audioContext.createOscillator();
    const chorusLfoGain = audioContext.createGain();
    const analyser = audioContext.createAnalyser();

    convolver.buffer = createImpulseResponse(audioContext);
    analyser.fftSize = 2048;
    master.gain.value = 0.75;

    delay.delayTime.value = delayTime;
    feedback.gain.value = delayFeedback;

    chorusDelay.delayTime.value = 0.016;
    chorusLfo.type = "sine";
    chorusLfo.frequency.value = 0.35;
    chorusLfoGain.gain.value = 0.004;
    chorusLfo.connect(chorusLfoGain);
    chorusLfoGain.connect(chorusDelay.delayTime);
    chorusLfo.start();

    dry.connect(master);
    reverbWet.connect(master);
    delayWet.connect(master);
    chorusWet.connect(master);

    convolver.connect(reverbWet);

    delay.connect(delayWet);
    delay.connect(feedback);
    feedback.connect(delay);

    chorusDelay.connect(chorusWet);

    master.connect(analyser);
    analyser.connect(audioContext.destination);

    audioRef.current = audioContext;
    chainRef.current = {
      master,
      dry,
      reverbWet,
      delayWet,
      chorusWet,
      convolver,
      delay,
      feedback,
      chorusDelay,
      analyser,
    };

    updateMixes(reverbMix, delayMix, chorusMix);
    setIsReady(true);
  };

  useEffect(() => {
    updateMixes(reverbMix, delayMix, chorusMix);
  }, [reverbMix, delayMix, chorusMix]);

  useEffect(() => {
    if (!chainRef.current) return;
    chainRef.current.delay.delayTime.value = delayTime;
  }, [delayTime]);

  useEffect(() => {
    if (!chainRef.current) return;
    chainRef.current.feedback.gain.value = delayFeedback;
  }, [delayFeedback]);

  useEffect(() => {
    let raf = null;
    const canvas = scopeRef.current;
    if (!canvas || !chainRef.current?.analyser) return undefined;

    const analyser = chainRef.current.analyser;
    const ctx = canvas.getContext("2d");
    const buffer = new Uint8Array(analyser.fftSize);

    const render = () => {
      analyser.getByteTimeDomainData(buffer);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#121018";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 188, 108, 0.22)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i += 1) {
        const y = (i * height) / 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "#ffd08b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < buffer.length; i += 1) {
        const x = (i / (buffer.length - 1)) * width;
        const y = (buffer[i] / 255) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isReady]);

  const applyPreset = (presetKey) => {
    const preset = VARIATIONS[presetKey];
    if (!preset) return;

    setActivePreset(presetKey);
    setWaveform(preset.waveform);
    setAttack(preset.attack);
    setDecay(preset.decay);
    setSustain(preset.sustain);
    setRelease(preset.release);
    setReverbMix(preset.reverbMix);
    setDelayMix(preset.delayMix);
    setDelayTime(preset.delayTime);
    setDelayFeedback(preset.delayFeedback);
    setCutoff(preset.cutoff);
    setResonance(preset.resonance);
    setFilterEnv(preset.filterEnv);
    setUnisonDetune(preset.unisonDetune);
    setChorusMix(preset.chorusMix);
  };

  const applyToneMacro = (mode) => {
    if (mode === "dark") {
      setCutoff(900);
      setResonance(1.8);
      setFilterEnv(700);
      return;
    }
    if (mode === "warm") {
      setCutoff(2200);
      setResonance(1.4);
      setFilterEnv(1500);
      return;
    }
    setCutoff(5200);
    setResonance(0.9);
    setFilterEnv(2800);
  };

  const startNote = (noteConfig, paramsOverride = null) => {
    if (!audioRef.current || !chainRef.current) return;
    const audioContext = audioRef.current;
    if (voicesRef.current.has(noteConfig.note)) return;

    const params = paramsOverride || {
      waveform,
      attack,
      decay,
      sustain,
      cutoff,
      filterEnv,
      resonance,
      unisonDetune,
      octaveShift,
    };

    const oscillatorA = audioContext.createOscillator();
    const oscillatorB = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();
    const envelope = audioContext.createGain();

    oscillatorA.type = params.waveform;
    oscillatorB.type = params.waveform;
    const freq = noteConfig.frequency * Math.pow(2, params.octaveShift ?? 0);
    oscillatorA.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillatorB.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillatorA.detune.setValueAtTime(
      -(params.unisonDetune ?? 0),
      audioContext.currentTime,
    );
    oscillatorB.detune.setValueAtTime(
      params.unisonDetune ?? 0,
      audioContext.currentTime,
    );

    filter.type = "lowpass";
    filter.Q.setValueAtTime(params.resonance, audioContext.currentTime);

    const now = audioContext.currentTime;
    const startCutoff = Math.min(12000, params.cutoff + params.filterEnv);
    filter.frequency.cancelScheduledValues(now);
    filter.frequency.setValueAtTime(Math.max(80, startCutoff), now);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(80, params.cutoff),
      now + params.attack + params.decay,
    );

    envelope.gain.cancelScheduledValues(now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.linearRampToValueAtTime(1, now + params.attack);
    envelope.gain.linearRampToValueAtTime(
      Math.max(0.0001, params.sustain),
      now + params.attack + params.decay,
    );

    oscillatorA.connect(filter);
    oscillatorB.connect(filter);
    filter.connect(envelope);

    envelope.connect(chainRef.current.dry);
    envelope.connect(chainRef.current.convolver);
    envelope.connect(chainRef.current.delay);
    envelope.connect(chainRef.current.chorusDelay);

    oscillatorA.start();
    oscillatorB.start();

    voicesRef.current.set(noteConfig.note, {
      oscillators: [oscillatorA, oscillatorB],
      envelope,
    });
    setActiveNotes(Array.from(voicesRef.current.keys()));
  };

  const stopNote = (noteConfig, releaseOverride = null) => {
    if (!audioRef.current) return;
    const voice = voicesRef.current.get(noteConfig.note);
    if (!voice) return;

    const voiceRelease = releaseOverride ?? release;
    const now = audioRef.current.currentTime;
    voice.envelope.gain.cancelScheduledValues(now);
    voice.envelope.gain.setValueAtTime(
      Math.max(0.0001, voice.envelope.gain.value),
      now,
    );
    voice.envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      now + voiceRelease,
    );
    voice.oscillators.forEach((oscillator) =>
      oscillator.stop(now + voiceRelease + 0.03),
    );

    voicesRef.current.delete(noteConfig.note);
    setActiveNotes(Array.from(voicesRef.current.keys()));
  };

  const stopDemo = () => {
    demoTimersRef.current.forEach((id) => clearTimeout(id));
    demoTimersRef.current = [];
    setIsDemoPlaying(false);
  };

  const stopAllNotes = () => {
    const active = Array.from(voicesRef.current.keys());
    active.forEach((noteName) => {
      const note = KEYBOARD.find((n) => n.note === noteName);
      if (note) stopNote(note);
    });
  };

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  useEffect(() => {
    bpmRef.current = sequencerBpm;
  }, [sequencerBpm]);

  const writeNoteToCurrentStep = (noteName) => {
    const stepIndex = sequencerStepRef.current % SEQUENCER_STEPS;
    setSequence((previous) => {
      const next = previous.map((notes) => [...notes]);
      if (!next[stepIndex].includes(noteName)) {
        next[stepIndex].push(noteName);
      }
      return next;
    });
  };

  const handleLiveNoteOn = (noteConfig) => {
    setSequencerWriteNote(noteConfig.note);
    if (isSequencerRecord) writeNoteToCurrentStep(noteConfig.note);
  };

  const clearSequencerTimers = () => {
    if (sequencerTimerRef.current) {
      clearInterval(sequencerTimerRef.current);
      sequencerTimerRef.current = null;
    }
    sequencerGateRef.current.forEach((id) => clearTimeout(id));
    sequencerGateRef.current = [];
  };

  const pauseSequencer = () => {
    clearSequencerTimers();
    setIsSequencerPlaying(false);
    stopAllNotes();
  };

  const playSequencerStep = (stepIndex) => {
    const noteNames = sequenceRef.current[stepIndex] || [];
    const notes = noteNames
      .map((noteName) => KEYBOARD.find((n) => n.note === noteName))
      .filter(Boolean);
    if (!notes.length) return;
    notes.forEach((note) => startNote(note));
    const stepMs = 60000 / Math.max(50, bpmRef.current) / 4;
    const gateMs = Math.max(45, stepMs * 0.7);
    const gateId = setTimeout(() => {
      notes.forEach((note) => stopNote(note, Math.min(0.12, release)));
    }, gateMs);
    sequencerGateRef.current.push(gateId);
  };

  const startSequencer = () => {
    setupAudio();
    stopDemo();
    clearSequencerTimers();
    setHoldMode(false);
    setIsSequencerPlaying(true);
    const tick = () => {
      const step = sequencerStepRef.current % SEQUENCER_STEPS;
      setCurrentStep(step);
      playSequencerStep(step);
      sequencerStepRef.current = (step + 1) % SEQUENCER_STEPS;
    };
    tick();
    const stepMs = 60000 / Math.max(50, sequencerBpm) / 4;
    sequencerTimerRef.current = setInterval(tick, stepMs);
  };

  const toggleStep = (stepIndex) => {
    setSequence((previous) => {
      const next = previous.map((notes) => [...notes]);
      if (next[stepIndex].includes(sequencerWriteNote)) {
        next[stepIndex] = next[stepIndex].filter(
          (note) => note !== sequencerWriteNote,
        );
      } else {
        next[stepIndex].push(sequencerWriteNote);
      }
      return next;
    });
  };

  const playDemo = (demoKey) => {
    const sequence = DEMOS[demoKey];
    const preset = VARIATIONS[demoKey];
    if (!sequence) return;
    if (!preset) return;
    applyPreset(demoKey);
    setOctaveShift(0);
    setupAudio();
    stopDemo();
    setIsDemoPlaying(true);

    const demoParams = {
      waveform: preset.waveform,
      attack: preset.attack,
      decay: preset.decay,
      sustain: preset.sustain,
      cutoff: preset.cutoff,
      filterEnv: preset.filterEnv,
      resonance: preset.resonance,
      unisonDetune: preset.unisonDetune,
      octaveShift: 0,
    };

    let cursor = 0;
    sequence.forEach((step) => {
      const notes = (step.notes || [])
        .map((noteName) => KEYBOARD.find((n) => n.note === noteName))
        .filter(Boolean);
      if (!notes.length) {
        cursor += step.wait;
        return;
      }
      const startId = setTimeout(() => {
        notes.forEach((n) => startNote(n, demoParams));
      }, cursor + 30);
      const stopId = setTimeout(() => {
        notes.forEach((n) => stopNote(n, preset.release));
      }, cursor + step.hold);
      demoTimersRef.current.push(startId, stopId);
      cursor += step.wait;
    });
    const doneId = setTimeout(() => setIsDemoPlaying(false), cursor + 80);
    demoTimersRef.current.push(doneId);
  };

  useEffect(() => {
    const down = (event) => {
      const key = keyMap.get(event.key.toLowerCase());
      if (!key || event.repeat) return;
      setupAudio();
      if (holdMode) {
        if (activeNotes.includes(key.note)) stopNote(key);
        else {
          handleLiveNoteOn(key);
          startNote(key);
        }
      } else {
        handleLiveNoteOn(key);
        startNote(key);
      }
    };

    const up = (event) => {
      const key = keyMap.get(event.key.toLowerCase());
      if (!key) return;
      if (!holdMode) stopNote(key);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [
    keyMap,
    holdMode,
    activeNotes,
    waveform,
    attack,
    decay,
    sustain,
    release,
    reverbMix,
    delayMix,
    delayTime,
    delayFeedback,
    cutoff,
    resonance,
    filterEnv,
    unisonDetune,
    chorusMix,
  ]);

  useEffect(() => {
    if (!holdMode) stopAllNotes();
  }, [holdMode]);

  useEffect(() => {
    if (!isSequencerPlaying) return;
    pauseSequencer();
    startSequencer();
  }, [sequencerBpm]);

  useEffect(
    () => () => {
      clearSequencerTimers();
    },
    [],
  );

  return (
    <section className="synth-shell">
      <div className="synth-toolbar">
        <button type="button" onClick={setupAudio} className="synth-arm">
          {isReady ? "Audio ready" : "Enable audio"}
        </button>
        <p className="synth-hint">
          Play with mouse or keys: A W S E D F T G Y H U J K
        </p>
      </div>

      <div className="synth-actions">
        <div className="synth-performance-controls">
          <div className="synth-octave">
            <span>Octave</span>
            <button
              type="button"
              className="synth-octave-step"
              onClick={() => setOctaveShift((o) => Math.max(-2, o - 1))}
            >
              -
            </button>
            <strong>
              {octaveShift >= 0 ? `+${octaveShift}` : octaveShift}
            </strong>
            <button
              type="button"
              className="synth-octave-step"
              onClick={() => setOctaveShift((o) => Math.min(2, o + 1))}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="synth-module synth-wave-module synth-wave-top">
        <span>Wave</span>
        <div className="synth-wave-grid">
          {["sine", "square", "sawtooth", "triangle"].map((shape) => (
            <button
              key={shape}
              type="button"
              className={`synth-wave-btn ${waveform === shape ? "is-active" : ""}`}
              onClick={() => setWaveform(shape)}
              aria-label={`Set waveform ${shape}`}
            >
              <WaveIcon type={shape} />
              <small>{shape === "sawtooth" ? "saw" : shape}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="synth-tone-row">
        <span>Tone</span>
        <button type="button" onClick={() => applyToneMacro("dark")}>
          Dark
        </button>
        <button type="button" onClick={() => applyToneMacro("warm")}>
          Warm
        </button>
        <button type="button" onClick={() => applyToneMacro("bright")}>
          Bright
        </button>
      </div>

      <div className="synth-sequencer">
        <div className="synth-sequencer-head">
          <span>16-Step Sequencer</span>
          <div className="synth-sequencer-buttons">
            <button
              type="button"
              onClick={startSequencer}
              disabled={isSequencerPlaying}
            >
              Play
            </button>
            <button
              type="button"
              onClick={pauseSequencer}
              disabled={!isSequencerPlaying}
            >
              Pause
            </button>
            <button
              type="button"
              className={isSequencerRecord ? "is-active" : ""}
              onClick={() => setIsSequencerRecord((value) => !value)}
              aria-pressed={isSequencerRecord}
            >
              Record
            </button>
          </div>
        </div>
        <div className="synth-sequencer-meta">
          <label>
            BPM
            <input
              type="range"
              min={70}
              max={160}
              step={1}
              value={sequencerBpm}
              onChange={(event) => setSequencerBpm(Number(event.target.value))}
            />
            <strong>{sequencerBpm}</strong>
          </label>
          <p>Write note: {sequencerWriteNote}</p>
        </div>
        <div className="synth-sequencer-grid">
          {sequence.map((notes, stepIndex) => (
            <button
              key={stepIndex}
              type="button"
              className={`synth-seq-step ${notes.length ? "has-note" : ""} ${
                currentStep === stepIndex && isSequencerPlaying
                  ? "is-current"
                  : ""
              }`}
              onClick={() => toggleStep(stepIndex)}
            >
              <span>{String(stepIndex + 1).padStart(2, "0")}</span>
              <strong>{notes[0] || "—"}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="synth-presets">
        {Object.entries(VARIATIONS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            className={`synth-preset ${activePreset === key ? "is-active" : ""}`}
            onClick={() => applyPreset(key)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="synth-scope-wrap">
        <canvas
          ref={scopeRef}
          width="780"
          height="150"
          className="synth-scope"
        />
      </div>

      <div className="synth-controls">
        <div className="synth-module synth-knob-bank">
          <button
            type="button"
            className={`synth-hold ${holdMode ? "is-active" : ""}`}
            onClick={() => setHoldMode((value) => !value)}
            aria-pressed={holdMode}
          >
            Hold Note
          </button>
            <Knob
            label="Attack"
            value={attack}
            min={0.01}
            max={1}
            step={0.01}
            onChange={setAttack}
            format={(v) => `${v.toFixed(2)}s`}
          />
          <Knob
            label="Decay"
            value={decay}
            min={0.01}
            max={1}
            step={0.01}
            onChange={setDecay}
            format={(v) => `${v.toFixed(2)}s`}
          />
          <Knob
            label="Sustain"
            value={sustain}
            min={0.05}
            max={1}
            step={0.01}
            onChange={setSustain}
            format={(v) => v.toFixed(2)}
          />
          <Knob
            label="Release"
            value={release}
            min={0.02}
            max={1.5}
            step={0.01}
            onChange={setRelease}
            format={(v) => `${v.toFixed(2)}s`}
          />
          <Knob
            label="Reverb"
            value={reverbMix}
            min={0}
            max={1}
            step={0.01}
            onChange={setReverbMix}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <Knob
            label="Delay"
            value={delayMix}
            min={0}
            max={1}
            step={0.01}
            onChange={setDelayMix}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <Knob
            label="Dly Time"
            value={delayTime}
            min={0.03}
            max={1}
            step={0.01}
            onChange={setDelayTime}
            format={(v) => `${v.toFixed(2)}s`}
          />
          <Knob
            label="Feedback"
            value={delayFeedback}
            min={0}
            max={0.9}
            step={0.01}
            onChange={setDelayFeedback}
            format={(v) => v.toFixed(2)}
          />
          <Knob
            label="Cutoff"
            value={cutoff}
            min={120}
            max={10000}
            step={10}
            onChange={setCutoff}
            format={(v) => `${Math.round(v)}hz`}
          />
          <Knob
            label="Res"
            value={resonance}
            min={0.2}
            max={12}
            step={0.05}
            onChange={setResonance}
            format={(v) => v.toFixed(2)}
          />
          <Knob
            label="Filt Env"
            value={filterEnv}
            min={0}
            max={9000}
            step={10}
            onChange={setFilterEnv}
            format={(v) => `${Math.round(v)}hz`}
          />
          <Knob
            label="Detune"
            value={unisonDetune}
            min={0}
            max={28}
            step={0.1}
            onChange={setUnisonDetune}
            format={(v) => `${v.toFixed(1)}ct`}
          />
          <Knob
            label="Chorus"
            value={chorusMix}
            min={0}
            max={0.8}
            step={0.01}
            onChange={setChorusMix}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        </div>
      </div>

      <div className="synth-keys">
        <div className="synth-white-keys">
          {whiteKeys.map((k) => (
            <button
              key={k.note}
              type="button"
              className={`synth-key synth-key-white ${
                activeNotes.includes(k.note) ? "is-active" : ""
              }`}
              onPointerDown={() => {
                setupAudio();
                if (holdMode) {
                  if (activeNotes.includes(k.note)) stopNote(k);
                  else {
                    handleLiveNoteOn(k);
                    startNote(k);
                  }
                } else {
                  handleLiveNoteOn(k);
                  startNote(k);
                }
              }}
              onPointerUp={() => {
                if (!holdMode) stopNote(k);
              }}
              onPointerLeave={() => {
                if (!holdMode) stopNote(k);
              }}
              onPointerCancel={() => {
                if (!holdMode) stopNote(k);
              }}
            >
              <span>{k.note}</span>
              <span>{k.key}</span>
            </button>
          ))}
        </div>

        <div className="synth-black-keys">
          {blackKeys.map((k) => (
            <button
              key={k.note}
              type="button"
              className={`synth-key synth-key-black ${
                activeNotes.includes(k.note) ? "is-active" : ""
              }`}
              style={{ left: `${((k.between + 1) / whiteKeys.length) * 100}%` }}
              onPointerDown={() => {
                setupAudio();
                if (holdMode) {
                  if (activeNotes.includes(k.note)) stopNote(k);
                  else {
                    handleLiveNoteOn(k);
                    startNote(k);
                  }
                } else {
                  handleLiveNoteOn(k);
                  startNote(k);
                }
              }}
              onPointerUp={() => {
                if (!holdMode) stopNote(k);
              }}
              onPointerLeave={() => {
                if (!holdMode) stopNote(k);
              }}
              onPointerCancel={() => {
                if (!holdMode) stopNote(k);
              }}
            >
              <span>{k.note}</span>
              <span>{k.key}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
