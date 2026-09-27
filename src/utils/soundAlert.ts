/**
 * Web Audio API synthesized notification & emergency report sound generator
 * Zero external audio assets required, 100% reliable, zero latency.
 */

let audioCtx: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    return audioCtx
  } catch {
    return null
  }
}

export const isSoundEnabled = (): boolean => {
  try {
    const setting = localStorage.getItem('admin_sound_alert')
    return setting !== 'false' // default true
  } catch {
    return true
  }
}

export const setSoundEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem('admin_sound_alert', enabled ? 'true' : 'false')
  } catch {
    // ignore
  }
}

/**
 * Play a high-priority / emergency report alert sound (two harmonic pulses)
 */
export const playEmergencyReportSound = (): void => {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime

    // Tone 1
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now) // A5
    osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15) // D6

    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.03)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.22)

    // Tone 2 (High urgent accent)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(1046.5, now + 0.18) // C6
    osc2.frequency.exponentialRampToValueAtTime(1396.91, now + 0.35) // F6

    gain2.gain.setValueAtTime(0, now + 0.18)
    gain2.gain.linearRampToValueAtTime(0.15, now + 0.21)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.18)
    osc2.stop(now + 0.48)
  } catch (err) {
    console.warn('Audio alert error:', err)
  }
}

/**
 * Play a gentle standard notification chime
 */
export const playNotificationSound = (): void => {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.28)
  } catch {
    // ignore
  }
}
