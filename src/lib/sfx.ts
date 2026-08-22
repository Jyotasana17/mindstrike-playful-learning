let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.06, delay = 0) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
  g.gain.setValueAtTime(0, ac.currentTime + delay);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + delay + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + dur + 0.02);
}

export const sfx = {
  tap: () => tone(660, 0.08, "triangle"),
  good: () => {
    tone(660, 0.12, "triangle");
    tone(880, 0.16, "triangle", 0.05, 0.08);
  },
  great: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, "triangle", 0.05, i * 0.07));
  },
  oops: () => tone(220, 0.18, "sawtooth", 0.035),
  click: () => tone(420, 0.05, "square", 0.03),
  hit: () => tone(180, 0.07, "square", 0.04),
  shoot: () => {
    tone(300, 0.1, "square", 0.05);
    tone(520, 0.08, "triangle", 0.04, 0.05);
  },
  pocket: () => {
    tone(784, 0.12, "sine", 0.06);
    tone(1175, 0.2, "sine", 0.05, 0.09);
  },
};
