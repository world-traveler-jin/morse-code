import { textToMorseSegments } from './morseCode';

// AudioContext와 OfflineAudioContext 모두에서 동작하는 신호 스케줄러
export function scheduleMorse(ctx, segments, { frequency, unit, startTime }) {
  let cursor = startTime;
  const oscillators = [];

  segments.forEach((segment) => {
    const duration = segment.units * unit;
    if (segment.tone) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const rampTime = Math.min(0.005, duration / 4);

      osc.type = 'sine';
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0, cursor);
      gain.gain.linearRampToValueAtTime(0.3, cursor + rampTime);
      gain.gain.setValueAtTime(0.3, cursor + duration - rampTime);
      gain.gain.linearRampToValueAtTime(0, cursor + duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(cursor);
      osc.stop(cursor + duration);
      oscillators.push(osc);
    }
    cursor += duration;
  });

  return { oscillators, endTime: cursor };
}

// 실시간 스피커 재생 (AudioContext 사용)
export function playMorseLive(ctx, text, { wpm, frequency }) {
  const segments = textToMorseSegments(text);
  if (segments.length === 0) return null;

  const unit = 1.2 / wpm;
  const startTime = ctx.currentTime + 0.05;
  const { oscillators, endTime } = scheduleMorse(ctx, segments, { frequency, unit, startTime });

  return { oscillators, durationMs: (endTime - ctx.currentTime) * 1000 };
}

// AudioBuffer -> WAV(PCM16) ArrayBuffer 인코딩
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numFrames = buffer.length;
  const dataSize = numFrames * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  const writeString = (s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
    offset += s.length;
  };
  const writeUint32 = (v) => { view.setUint32(offset, v, true); offset += 4; };
  const writeUint16 = (v) => { view.setUint16(offset, v, true); offset += 2; };

  writeString('RIFF');
  writeUint32(36 + dataSize);
  writeString('WAVE');
  writeString('fmt ');
  writeUint32(16);
  writeUint16(1); // PCM
  writeUint16(numChannels);
  writeUint32(sampleRate);
  writeUint32(sampleRate * blockAlign);
  writeUint16(blockAlign);
  writeUint16(bitDepth);
  writeString('data');
  writeUint32(dataSize);

  const channelData = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

// 모스부호 신호를 WAV 파일(Blob)로 렌더링 (다운로드용)
export async function renderMorseWavBlob(text, { wpm, frequency }) {
  const segments = textToMorseSegments(text);
  if (segments.length === 0) return null;

  const unit = 1.2 / wpm;
  const padding = 0.15;
  const totalDuration = segments.reduce((sum, s) => sum + s.units * unit, 0) + padding * 2;
  const sampleRate = 44100;

  const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const offlineCtx = new OfflineCtx(1, Math.ceil(sampleRate * totalDuration), sampleRate);

  scheduleMorse(offlineCtx, segments, { frequency, unit, startTime: padding });

  const renderedBuffer = await offlineCtx.startRendering();
  const wavArrayBuffer = audioBufferToWav(renderedBuffer);
  return new Blob([wavArrayBuffer], { type: 'audio/wav' });
}
