'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioConfig {
  volume: number;
  intensity: number;
  theme: string;
  escalationMode: boolean;
}

// Extend Window to include webkit audio context
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const useAmbientAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  // Initialize Web Audio Context
  const initAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('AudioContext not supported');
      audioContextRef.current = new AudioContextClass();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = 0.1; // Start very quiet
      
      setIsEnabled(true);
      return true;
    } catch (error) {
      console.warn('Audio not supported:', error);
      return false;
    }
  }, []);

  // Create white noise for texture
  const createNoiseBuffer = useCallback((audioContext: AudioContext) => {
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // White noise
    }
    
    return buffer;
  }, []);

  // Generate theme-based frequencies
  const getThemeFrequencies = useCallback((theme: string, intensity: number): number[] => {
    const baseFrequencies = {
      loneliness: [55, 82.5, 110], // Low, melancholic tones
      regret: [73.5, 98, 147], // Minor, haunting frequencies  
      love: [65.5, 98, 196], // Warm but sad tones
      self_doubt: [61.5, 92, 184], // Unstable, wavering frequencies
      meta: [69.5, 104, 207] // Slightly dissonant, unsettling
    };
    
    const base = baseFrequencies[theme as keyof typeof baseFrequencies] || baseFrequencies.loneliness;
    
    // Add intensity-based harmonics and dissonance
    const frequencies = [...base];
    
    if (intensity >= 3) {
      frequencies.push(base[0] * 1.618); // Golden ratio harmony
      frequencies.push(base[1] * 0.707); // Subdued harmony
    }
    
    if (intensity >= 4) {
      frequencies.push(base[0] * 2.414); // Dissonant interval
      frequencies.push(base[2] * 0.841); // Tension
    }
    
    if (intensity >= 5) {
      frequencies.push(base[0] * 3.732); // High tension
      frequencies.push(base[1] * 1.189); // Unsettling harmony
    }
    
    return frequencies;
  }, []);

  // Create and start oscillators
  const createOscillators = useCallback((config: AudioConfig) => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    
          // Stop existing oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (_) { /* ignore */ }
      });
    oscillatorsRef.current = [];
    
    const frequencies = getThemeFrequencies(config.theme, config.intensity);
    
    frequencies.forEach((freq, index) => {
      if (!audioContextRef.current || !masterGainRef.current) return;
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const filterNode = audioContextRef.current.createBiquadFilter();
      
      // Configure oscillator
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = freq;
      
      // Add subtle detuning for organic feel
      const detuning = (Math.random() - 0.5) * 4;
      oscillator.detune.value = detuning;
      
      // Configure filter for warmth
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 800 + (config.intensity * 200);
      filterNode.Q.value = 0.5;
      
      // Configure gain
      const baseVolume = config.volume * 0.15;
      const layerVolume = baseVolume / (index + 1); // Decrease volume for higher layers
      gainNode.gain.value = layerVolume;
      
      // Add slow LFO modulation
      const lfo = audioContextRef.current.createOscillator();
      const lfoGain = audioContextRef.current.createGain();
      
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (index * 0.05); // Very slow modulation
      lfoGain.gain.value = layerVolume * 0.3;
      
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();
      
      // Connect the chain
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      oscillator.start();
      oscillatorsRef.current.push(oscillator);
    });
  }, [getThemeFrequencies]);

  // Create noise layer for texture
  const createNoiseLayer = useCallback((config: AudioConfig) => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    
    // Stop existing noise
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (e) { /* ignore */ }
    }
    
    const noiseBuffer = createNoiseBuffer(audioContextRef.current);
    const noiseSource = audioContextRef.current.createBufferSource();
    const noiseGain = audioContextRef.current.createGain();
    const noiseFilter = audioContextRef.current.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    // Configure noise filter based on theme and intensity
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 100 + (config.intensity * 50);
    noiseFilter.Q.value = 5 + config.intensity;
    
    // Very quiet noise for texture
    const noiseVolume = config.volume * 0.02 * (config.intensity / 5);
    noiseGain.gain.value = noiseVolume;
    
    // Escalation mode makes noise more prominent
    if (config.escalationMode) {
      noiseGain.gain.value *= 2;
      noiseFilter.Q.value *= 1.5;
    }
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGainRef.current);
    
    noiseSource.start();
    noiseSourceRef.current = noiseSource;
  }, [createNoiseBuffer]);

  // Update audio based on current phrase and user state
  const updateAudio = useCallback((config: AudioConfig) => {
    if (!isEnabled || !audioContextRef.current) return;
    
    // Update master volume with smooth transition
    if (masterGainRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
      masterGainRef.current.gain.setTargetAtTime(
        config.volume * 0.1, 
        audioContextRef.current.currentTime, 
        1 // 1 second transition
      );
    }
    
    // Recreate oscillators with new configuration
    createOscillators(config);
    createNoiseLayer(config);
  }, [isEnabled, createOscillators, createNoiseLayer]);

  // Start audio
  const startAudio = useCallback(async () => {
    if (isPlaying) return;
    
    const initialized = await initAudio();
    if (!initialized || !audioContextRef.current) return;
    
    // Resume audio context if suspended (required by Chrome)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    setIsPlaying(true);
  }, [isPlaying, initAudio]);

  // Stop audio
  const stopAudio = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) { /* ignore */ }
    });
    oscillatorsRef.current = [];
    
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (e) { /* ignore */ }
      noiseSourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsPlaying(false);
    setIsEnabled(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    isPlaying,
    isEnabled,
    startAudio,
    stopAudio,
    updateAudio
  };
}; 