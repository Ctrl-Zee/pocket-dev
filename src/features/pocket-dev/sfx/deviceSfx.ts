import { useCallback, useRef, useState } from 'react'

type AudioContextConstructor = typeof AudioContext

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: AudioContextConstructor
}

interface ToneStep {
  duration: number
  frequency: number
  gain: number
  type?: OscillatorType
}

const muteStorageKey = 'pocket-dev-device-muted'
const quietSystemGain = 0.018
const toneGapSeconds = 0.012
const silentGainFloor = 0.001
const soundSteps = {
  back: [{ duration: 0.055, frequency: 260, gain: 0.035, type: 'triangle' }],
  blip: [{ duration: 0.035, frequency: 620, gain: 0.032, type: 'square' }],
  confirm: [{ duration: 0.06, frequency: 880, gain: 0.038, type: 'square' }],
  error: [
    { duration: 0.055, frequency: 180, gain: 0.04, type: 'sawtooth' },
    { duration: 0.055, frequency: 140, gain: 0.034, type: 'sawtooth' },
  ],
  konami: [
    { duration: 0.045, frequency: 660, gain: 0.032, type: 'square' },
    { duration: 0.045, frequency: 880, gain: 0.034, type: 'square' },
    { duration: 0.075, frequency: 1320, gain: 0.038, type: 'triangle' },
  ],
  select: [{ duration: 0.035, frequency: 420, gain: quietSystemGain, type: 'triangle' }],
  start: [{ duration: 0.05, frequency: 520, gain: quietSystemGain, type: 'triangle' }],
} satisfies Record<string, ToneStep[]>

export type DeviceSfxName = keyof typeof soundSteps

export function useDeviceSfx() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isMuted, setIsMuted] = useState(readStoredMutePreference)

  const getAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current

    const AudioContextClass = getAudioContextClass()

    if (!AudioContextClass) return null

    audioContextRef.current = new AudioContextClass()

    return audioContextRef.current
  }, [])

  const playDeviceSfx = useCallback(
    (soundName: DeviceSfxName) => {
      if (isMuted) return

      const audioContext = getAudioContext()

      if (!audioContext) return

      void audioContext.resume?.()

      let startTime = audioContext.currentTime

      for (const toneStep of soundSteps[soundName]) {
        playToneStep(audioContext, toneStep, startTime)
        startTime += toneStep.duration + toneGapSeconds
      }
    },
    [getAudioContext, isMuted],
  )

  const toggleMute = useCallback(() => {
    setIsMuted((currentMuteState) => {
      const nextMuteState = !currentMuteState
      persistMutePreference(nextMuteState)

      return nextMuteState
    })
  }, [])

  return {
    isMuted,
    playDeviceSfx,
    toggleMute,
  }
}

function playToneStep(audioContext: AudioContext, toneStep: ToneStep, startTime: number) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  const endTime = startTime + toneStep.duration

  oscillator.type = toneStep.type ?? 'square'
  oscillator.frequency.setValueAtTime(toneStep.frequency, startTime)
  gainNode.gain.setValueAtTime(toneStep.gain, startTime)
  gainNode.gain.exponentialRampToValueAtTime(silentGainFloor, endTime)

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  oscillator.start(startTime)
  oscillator.stop(endTime)
}

function getAudioContextClass() {
  return window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext ?? null
}

function readStoredMutePreference() {
  try {
    return window.localStorage.getItem(muteStorageKey) === 'true'
  } catch {
    return false
  }
}

function persistMutePreference(isMuted: boolean) {
  try {
    window.localStorage.setItem(muteStorageKey, String(isMuted))
  } catch {
    // Sound is optional; storage failures should not affect navigation.
  }
}
