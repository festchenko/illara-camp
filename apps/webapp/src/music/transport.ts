// Musical transport with tempo sync and quantization

export type Transport = {
  ctx: AudioContext;
  bpm: number;
  startedAt: number | null;
  getTime(): number;
  getBeat(): number;
  getBar(stepsPerBar?: number): number;
  schedule(cb: (at: number) => void, whenBeatsFromNow: number): void;
  start(at?: number): void;
  stop(): void;
};

export function createTransport(ctx: AudioContext, bpm: number = 96): Transport {
  let startedAt: number | null = null;
  let stopFlag = false;

  const getTime = (): number => ctx.currentTime;
  
  const getBeat = (): number => {
    if (startedAt === null) return 0;
    return (ctx.currentTime - startedAt) * bpm / 60;
  };
  
  const getBar = (stepsPerBar: number = 4): number => {
    return getBeat() / stepsPerBar;
  };

  const schedule = (cb: (at: number) => void, whenBeatsFromNow: number): void => {
    if (startedAt === null) return;
    
    const beatTime = startedAt + (getBeat() + whenBeatsFromNow) * 60 / bpm;
    const scheduleTime = Math.max(ctx.currentTime, beatTime);
    
    setTimeout(() => {
      if (!stopFlag) {
        cb(scheduleTime);
      }
    }, (scheduleTime - ctx.currentTime) * 1000);
  };

  const start = (at?: number): void => {
    stopFlag = false;
    const startTime = at || ctx.currentTime;
    startedAt = startTime;
  };

  const stop = (): void => {
    stopFlag = true;
    startedAt = null;
  };

  return {
    ctx,
    bpm,
    get startedAt() { return startedAt; },
    getTime,
    getBeat,
    getBar,
    schedule,
    start,
    stop,
  };
}

// Quantization helper
export function nextBarTime(transport: Transport, bars: number = 1): number {
  if (transport.startedAt === null) {
    return transport.ctx.currentTime;
  }
  
  const currentBeat = transport.getBeat();
  const beatsPerBar = 4; // 4/4 time signature
  const currentBar = Math.floor(currentBeat / beatsPerBar);
  const nextBarBeat = (currentBar + bars) * beatsPerBar;
  
  return transport.startedAt + (nextBarBeat * 60 / transport.bpm);
}

// Beat quantization helper
export function quantizeToBeat(transport: Transport, beatOffset: number = 0): number {
  if (transport.startedAt === null) {
    return transport.ctx.currentTime;
  }
  
  const currentBeat = transport.getBeat();
  const quantizedBeat = Math.ceil(currentBeat + beatOffset);
  
  return transport.startedAt + (quantizedBeat * 60 / transport.bpm);
}
