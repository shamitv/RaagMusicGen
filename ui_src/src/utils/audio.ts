// Minimal utility to convert an AudioBuffer to a WAV ArrayBuffer
// Based on common implementations: interleave channels, write WAV headers
export function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM

  const samples = buffer.length;
  const blockAlign = numChannels * 2; // 16-bit
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * blockAlign;

  const bufferOut = new ArrayBuffer(44 + dataSize);
  const view = new DataView(bufferOut);

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  let offset = 0;
  writeString(view, offset, 'RIFF'); offset += 4;
  view.setUint32(offset, 36 + dataSize, true); offset += 4;
  writeString(view, offset, 'WAVE'); offset += 4;
  writeString(view, offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4; // Subchunk1Size
  view.setUint16(offset, format, true); offset += 2;
  view.setUint16(offset, numChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, byteRate, true); offset += 4;
  view.setUint16(offset, blockAlign, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2; // bitsPerSample
  writeString(view, offset, 'data'); offset += 4;
  view.setUint32(offset, dataSize, true); offset += 4;

  // write interleaved PCM samples
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let pos = 44;
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numChannels; c++) {
      // clamp and convert to 16-bit PCM
      let sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      pos += 2;
    }
  }

  return bufferOut;
}

export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const ab = audioBufferToWav(buffer);
  return new Blob([ab], { type: 'audio/wav' });
}
