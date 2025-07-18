import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { DrumPattern, DrumKit, DrumConfig } from '../types';

export const useAudioEngine = (
  drums: DrumConfig[],
  currentKit: DrumKit | null,
  pattern: DrumPattern,
  fillPattern: DrumPattern,
  bpm: number,
  beatsPerMeasure: number,
  subdivision: number,
  measures: number,
  fillEnabled: boolean,
  countInEnabled: boolean,
  accentVolumeReduction: number,
  onBeatChange: (beat: number, measure: number, subBeat: number) => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [currentMeasure, setCurrentMeasure] = useState(1);
  const [currentSubBeat, setCurrentSubBeat] = useState(1);
  const [isCountingIn, setIsCountingIn] = useState(false);
  
  const playersRef = useRef<{ [key: string]: Tone.Player }>({});
  const loopRef = useRef<Tone.Loop | null>(null);
  const transportRef = useRef<boolean>(false);
  const isRecreatingRef = useRef<boolean>(false);
  const stepCounterRef = useRef<number>(0);
  const measureCounterRef = useRef<number>(1);
  const currentPatternRef = useRef<DrumPattern>(pattern);
  const currentFillPatternRef = useRef<DrumPattern>(fillPattern);
  const accentVolumeReductionRef = useRef<number>(accentVolumeReduction);
  const fillEnabledRef = useRef<boolean>(fillEnabled);
  const measuresRef = useRef<number>(measures);
  const subdivisionRef = useRef<number>(subdivision);
  const beatsPerMeasureRef = useRef<number>(beatsPerMeasure);

  useEffect(() => {
    if (!currentKit) return;

    const loadPlayers = async () => {
      const newPlayers: { [key: string]: Tone.Player } = {};
      
      for (const drum of drums) {
        const soundFile = currentKit.sounds[drum.id];
        if (soundFile) {
          try {
            const fullPath = `${currentKit.path}${soundFile}`;
            console.log(`Loading sound for ${drum.id} from: ${fullPath}`);
            
            // Create a simple synthesized drum sound for testing
            const player = new Tone.Player().connect(Tone.getDestination());
            
            // Generate a simple drum-like sound based on drum type
            let freq = 200; // default frequency
            let decay = 0.1;
            
            switch (drum.id) {
              case 'bass':
                freq = 60; // Low frequency for bass
                decay = 0.3;
                break;
              case 'snare':
                freq = 200; // Mid frequency for snare
                decay = 0.1;
                break;
              case 'hihat-closed':
              case 'hihat-open':
                freq = 1000; // High frequency for hi-hat
                decay = 0.05;
                break;
              default:
                freq = 440;
                decay = 0.2;
            }
            
            console.log(`Created test tone for ${drum.id} at ${freq}Hz`);
            newPlayers[drum.id] = player;
          } catch (error) {
            console.error(`Failed to create sound for ${drum.id}:`, error);
            console.error('Error details:', (error as Error).message);
          }
        }
      }
      
      playersRef.current = newPlayers;
    };

    loadPlayers();

    return () => {
      Object.values(playersRef.current).forEach(player => player.dispose());
      playersRef.current = {};
    };
  }, [currentKit, drums]);

  useEffect(() => {
    // Set BPM directly on the Transport - Loop will inherit this tempo
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    // Update pattern refs for live updates during playback
    currentPatternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    // Update fill pattern refs for live updates during playback
    currentFillPatternRef.current = fillPattern;
  }, [fillPattern]);

  useEffect(() => {
    // Update accent volume reduction ref for live updates during playback
    accentVolumeReductionRef.current = accentVolumeReduction;
  }, [accentVolumeReduction]);

  useEffect(() => {
    // Update fill enabled ref for live updates during playback
    fillEnabledRef.current = fillEnabled;
  }, [fillEnabled]);

  useEffect(() => {
    // Update measures ref for live updates during playback
    measuresRef.current = measures;
    
    // If current measure is now beyond the new total, wrap back to 1
    if (measureCounterRef.current > measures) {
      measureCounterRef.current = 1;
    }
  }, [measures]);

  useEffect(() => {
    // Update subdivision ref for live updates during playback
    subdivisionRef.current = subdivision;
  }, [subdivision]);

  useEffect(() => {
    // Update beatsPerMeasure ref for live updates during playback
    beatsPerMeasureRef.current = beatsPerMeasure;
  }, [beatsPerMeasure]);

  // Helper function for consistent beat position calculations
  const stepToPosition = (step: number, subdivision: number) => {
    const beat = Math.floor(step / subdivision) + 1;  // Convert to 1-based
    const subBeat = (step % subdivision) + 1;         // Convert to 1-based
    return { beat, subBeat, beatPosition: `${beat}.${subBeat}` };
  };

  const playCountInClick = () => {
    // Create a distinct count-in sound - higher pitched beep
    const countInSound = new Tone.Oscillator(1200, "sine").connect(Tone.getDestination());
    countInSound.volume.value = -6; // Moderate volume
    countInSound.start();
    countInSound.stop("+0.05"); // Short, crisp sound
  };

  const playDrum = (drumId: string, isAccent: boolean = false) => {
    // For now, create a simple synthesized drum sound
    const volume = isAccent ? 0 : -accentVolumeReductionRef.current; // Dynamic volume reduction
    // Debug logging (commented out)
    // console.log(`Playing ${drumId}: accent=${isAccent}, volume=${volume}dB (reduction=${accentVolumeReductionRef.current})`);
    
    switch (drumId) {
      case 'bass':
        const bass = new Tone.Oscillator(60, "sine").connect(Tone.getDestination());
        bass.volume.value = volume;
        bass.start();
        bass.stop("+0.3");
        break;
      case 'snare':
        const snare = new Tone.Noise("white").connect(Tone.getDestination());
        snare.volume.value = volume;
        snare.start();
        snare.stop("+0.1");
        break;
      case 'hihat-closed':
      case 'hihat-open':
        const hihat = new Tone.Noise("white").connect(Tone.getDestination());
        hihat.volume.value = volume - 10;
        hihat.start();
        hihat.stop(drumId === 'hihat-open' ? "+0.2" : "+0.05");
        break;
      case 'crash':
        const crash = new Tone.Noise("white").connect(Tone.getDestination());
        crash.volume.value = volume;
        crash.start();
        crash.stop("+0.5");
        break;
      case 'ride':
        const ride = new Tone.Oscillator(800, "sine").connect(Tone.getDestination());
        ride.volume.value = volume - 5;
        ride.start();
        ride.stop("+0.3");
        break;
      case 'tom1':
        const tom1 = new Tone.Oscillator(150, "sine").connect(Tone.getDestination());
        tom1.volume.value = volume;
        tom1.start();
        tom1.stop("+0.2");
        break;
      case 'tom2':
        const tom2 = new Tone.Oscillator(100, "sine").connect(Tone.getDestination());
        tom2.volume.value = volume;
        tom2.start();
        tom2.stop("+0.2");
        break;
      default:
        const defaultSound = new Tone.Oscillator(440, "sine").connect(Tone.getDestination());
        defaultSound.volume.value = volume;
        defaultSound.start();
        defaultSound.stop("+0.1");
    }
  };

  const createCountInLoop = async () => {
    // For count-in, we'll use the main loop but with a special measure -1 (count-in measure)
    return createLoop(false, true); // preservePosition=false, withCountIn=true
  };

  const createLoop = async (preservePosition = false, withCountIn = false) => {
    if (isRecreatingRef.current) return;
    isRecreatingRef.current = true;

    try {
      // Save current position if preserving
      const savedMeasure = preservePosition ? measureCounterRef.current : 1;
      let savedStep = 0;
      
      if (preservePosition) {
        // Calculate step based on current beat position, accounting for new subdivision
        const currentBeatPos = Math.floor(stepCounterRef.current / subdivisionRef.current);
        const currentSubBeatPos = stepCounterRef.current % subdivisionRef.current;
        // Adjust for new subdivision, keeping same beat but adjusting sub-beat if needed
        const newSubBeat = Math.min(currentSubBeatPos, subdivision - 1);
        savedStep = currentBeatPos * subdivision + newSubBeat;
      }

      // Stop and dispose of existing loop
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current.dispose();
        loopRef.current = null;
      }

      // Reset counters, optionally preserving position
      // If withCountIn, start at measure 0 (count-in measure)
      stepCounterRef.current = savedStep;
      measureCounterRef.current = withCountIn ? 0 : savedMeasure;

      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      const totalSteps = beatsPerMeasure * subdivision;
      // Each step is 1/subdivision of a quarter note
      // For subdivision 2: "8n" (8th notes)
      // For subdivision 3: "8t" (8th note triplets)
      const stepDuration = subdivision === 2 ? "8n" : subdivision === 3 ? "8t" : `${subdivision * 4}n`;
      
      const loop = new Tone.Loop((time) => {
        try {
          const currentStep = stepCounterRef.current;
          const currentMeasureLocal = measureCounterRef.current;
          const currentSubdivision = subdivisionRef.current;
          
          // Use helper function for consistent position calculation
          const { beat, subBeat, beatPosition } = stepToPosition(currentStep, currentSubdivision);

          // Handle count-in measure (measure 0)
          if (currentMeasureLocal === 0) {
            // Count-in measure - only play on beat 1 of each subdivision
            if (subBeat === 1) {
              playCountInClick();
            }
            
            // Schedule UI updates for count-in
            requestAnimationFrame(() => {
              setCurrentBeat(beat);
              setCurrentMeasure(0); // Keep showing count-in
              setCurrentSubBeat(subBeat);
              onBeatChange(beat, 0, subBeat);
            });
            
            // After count-in measure, transition to measure 1
            if (stepCounterRef.current >= (beatsPerMeasureRef.current * currentSubdivision - 1)) {
              stepCounterRef.current = 0;
              measureCounterRef.current = 1;
              setIsCountingIn(false);
              setIsPlaying(true);
              return;
            }
          } else {
            // Normal drum pattern measures
            const isLastMeasure = currentMeasureLocal === measuresRef.current;
            const activePattern = (fillEnabledRef.current && isLastMeasure) ? currentFillPatternRef.current : currentPatternRef.current;
            
            drums.forEach((drum) => {
              const cellData = activePattern[drum.id]?.[beatPosition];
              if (cellData?.enabled) {
                playDrum(drum.id, cellData.accent);
              }
            });

            // Schedule UI updates for normal pattern
            requestAnimationFrame(() => {
              setCurrentBeat(beat);
              setCurrentMeasure(currentMeasureLocal);
              setCurrentSubBeat(subBeat);
              onBeatChange(beat, currentMeasureLocal, subBeat);
            });
          }

          stepCounterRef.current++;
          const currentBeatsPerMeasure = beatsPerMeasureRef.current;
          const totalStepsInMeasure = currentBeatsPerMeasure * currentSubdivision;
          
          if (stepCounterRef.current >= totalStepsInMeasure) {
            stepCounterRef.current = 0;
            measureCounterRef.current++;
            if (measureCounterRef.current > measuresRef.current) {
              measureCounterRef.current = 1;
            }
          }
        } catch (error) {
          console.error('Loop callback error:', error);
        }
      }, stepDuration);

      loopRef.current = loop;
    } finally {
      isRecreatingRef.current = false;
    }
  };

  const start = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    if (countInEnabled) {
      // Start with count-in (measure 0)
      setIsCountingIn(true);
      await createCountInLoop();
    } else {
      // Start directly with main pattern
      await createLoop();
      setIsPlaying(true);
    }
    
    if (loopRef.current) {
      loopRef.current.start();
      Tone.getTransport().start();
      transportRef.current = true;
    }
  };

  const startWithoutCountIn = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    // Always start directly with main pattern, ignoring count-in setting
    await createLoop();
    setIsPlaying(true);
    
    if (loopRef.current) {
      loopRef.current.start();
      Tone.getTransport().start();
      transportRef.current = true;
    }
  };

  const stop = () => {
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current.dispose();
      loopRef.current = null;
    }
    
    Tone.getTransport().stop();
    Tone.getTransport().cancel(); // This clears all scheduled events
    setIsPlaying(false);
    setIsCountingIn(false);
    setCurrentBeat(1);
    setCurrentMeasure(1);
    setCurrentSubBeat(1);
    transportRef.current = false;
    isRecreatingRef.current = false;
    // Reset counters
    stepCounterRef.current = 0;
    measureCounterRef.current = 1;
  };

  const pause = () => {
    if (loopRef.current) {
      loopRef.current.stop();
    }
    Tone.getTransport().pause();
    setIsPlaying(false);
    setIsCountingIn(false);
  };

  useEffect(() => {
    // Only recreate loop if not playing
    if (!isPlaying) {
      createLoop();
    }
    // During playback, pattern changes are automatically picked up by the running loop
  }, [pattern, fillPattern, measures, fillEnabled, isPlaying]);

  useEffect(() => {
    // For structural changes (subdivision, beatsPerMeasure), we need to recreate the loop
    // even during playback because these changes affect the loop timing
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      createLoop(true).then(() => { // preservePosition = true
        if (loopRef.current) {
          loopRef.current.start();
        }
      });
    } else {
      createLoop();
    }
  }, [subdivision, beatsPerMeasure]);

  useEffect(() => {
    return () => {
      stop();
      Object.values(playersRef.current).forEach(player => player.dispose());
    };
  }, []);

  return {
    isPlaying,
    isCountingIn,
    currentBeat,
    currentMeasure,
    currentSubBeat,
    start,
    startWithoutCountIn,
    stop,
    pause,
    playDrum,
  };
};