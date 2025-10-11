import { audioBufferToWav } from './audio'
import { describe, it, expect } from 'vitest'

type FakeAudioBuffer = {
  numberOfChannels: number
  sampleRate: number
  length: number
  getChannelData: (c: number) => Float32Array
}

describe('audioBufferToWav', () => {
  it('produces a WAV ArrayBuffer with RIFF/WAVE header', () => {
    const samples = 32
    const sampleRate = 44100
    const channels = 2

    const data: Float32Array[] = []
    for (let c = 0; c < channels; c++) {
      const arr = new Float32Array(samples)
      // fill with a small ramp
      for (let i = 0; i < samples; i++) arr[i] = (i / samples) * (c ? 0.5 : 1.0)
      data.push(arr)
    }

    const fake: FakeAudioBuffer = {
      numberOfChannels: channels,
      sampleRate,
      length: samples,
      getChannelData: (c: number) => data[c]
    }

  const ab = audioBufferToWav(fake as unknown as AudioBuffer)
    const view = new DataView(ab)

    function readString(offset: number, len: number) {
      let s = ''
      for (let i = 0; i < len; i++) s += String.fromCharCode(view.getUint8(offset + i))
      return s
    }

    expect(readString(0, 4)).toBe('RIFF')
    expect(readString(8, 4)).toBe('WAVE')
    expect(readString(12, 4)).toBe('fmt ')
    expect(readString(36, 4)).toBe('data')
  })
})
