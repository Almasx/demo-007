/*
  Updated haptic feedback utility to reuse a single AudioContext instance
*/

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  const AudioContextClass: { new (): AudioContext } | undefined =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: { new (): AudioContext } })
      .webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
};

export const playHapticFeedback = () => {
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  // Use a sine wave for a softer tone
  oscillator.type = "sine";
  // Set frequency to simulate an Apple-like subtle click
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  // Apply a quick gain envelope for a natural click sound
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.03
  );
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.03);
};
