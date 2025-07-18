import { useState, useEffect } from 'react';
import { DrumMachineState, DrumPattern, Preset, DrumConfig } from '../types';
import drumsConfig from '../config/drums.json';
import presetsConfig from '../config/presets.json';

const convertPatternToPresetFormat = (pattern: DrumPattern): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  
  Object.entries(pattern).forEach(([drumId, beats]) => {
    const enabledPositions: string[] = [];
    
    Object.entries(beats).forEach(([beatPosition, cellData]) => {
      if (cellData.enabled) {
        enabledPositions.push(beatPosition);
      }
    });
    
    if (enabledPositions.length > 0) {
      result[drumId] = enabledPositions.sort();
    }
  });
  
  return result;
};

const createEmptyPattern = (drums: DrumConfig[], beatsPerMeasure: number, subdivision: number): DrumPattern => {
  const pattern: DrumPattern = {};
  
  drums.forEach(drum => {
    pattern[drum.id] = {};
    for (let beat = 1; beat <= beatsPerMeasure; beat++) {
      for (let sub = 1; sub <= subdivision; sub++) {
        const beatPosition = `${beat}.${sub}`;
        pattern[drum.id][beatPosition] = {
          enabled: false,
          accent: false,
        };
      }
    }
  });
  
  return pattern;
};

const createPatternFromPreset = (
  drums: DrumConfig[],
  preset: Preset,
  isFill: boolean = false
): DrumPattern => {
  const pattern = createEmptyPattern(drums, preset.beatsPerMeasure, preset.subdivision);
  const sourcePattern = isFill ? preset.fill : preset.pattern;
  
  Object.entries(sourcePattern).forEach(([drumId, positions]) => {
    if (pattern[drumId]) {
      positions.forEach(beatPosition => {
        if (pattern[drumId][beatPosition]) {
          pattern[drumId][beatPosition].enabled = true;
          // Extract beat number from position string (e.g., "1.1" -> 1, "2.3" -> 2)
          const beatNumber = parseInt(beatPosition.split('.')[0]);
          // Check if it's on a strong beat (subdivision 1) and if that beat is accented
          const subdivision = parseInt(beatPosition.split('.')[1]);
          const isOnBeat = subdivision === 1;
          pattern[drumId][beatPosition].accent = isOnBeat && preset.accents.includes(beatNumber);
        }
      });
    }
  });
  
  return pattern;
};

const getInitialState = (): DrumMachineState => {
  const rockPreset = presetsConfig.presets.find(p => p.id === 'rock');
  if (!rockPreset) {
    throw new Error('Rock preset not found');
  }

  const initialPattern = createPatternFromPreset(drumsConfig.drums, rockPreset, false);
  const initialFillPattern = createPatternFromPreset(drumsConfig.drums, rockPreset, true);

  return {
    isPlaying: false,
    currentBeat: 1,
    currentMeasure: 1,
    currentSubBeat: 1,
    bpm: 120, // BPM is decoupled from presets
    measures: rockPreset.measures,
    beatsPerMeasure: rockPreset.beatsPerMeasure,
    subdivision: rockPreset.subdivision,
    currentKit: 'basic',
    currentPreset: 'rock',
    fillEnabled: false,
    countInEnabled: true, // Default to enabled
    pattern: initialPattern,
    fillPattern: initialFillPattern,
    accentVolumeReduction: 6, // Default to 6dB reduction (roughly 50% volume)
  };
};

export const useDrumMachine = () => {
  const [state, setState] = useState<DrumMachineState>(getInitialState);

  const loadPreset = (presetId: string) => {
    const preset = presetsConfig.presets.find(p => p.id === presetId);
    if (!preset) return;

    const newPattern = createPatternFromPreset(drumsConfig.drums, preset, false);
    const newFillPattern = createPatternFromPreset(drumsConfig.drums, preset, true);

    setState(prev => ({
      ...prev,
      currentPreset: presetId,
      beatsPerMeasure: preset.beatsPerMeasure,
      subdivision: preset.subdivision,
      measures: preset.measures,
      pattern: newPattern,
      fillPattern: newFillPattern,
      // BPM is preserved when switching presets
    }));
  };

  const toggleDrum = (drumId: string, beatPosition: string, isFill: boolean = false) => {
    setState(prev => {
      const patternKey = isFill ? 'fillPattern' : 'pattern';
      const newPattern = { ...prev[patternKey] };
      
      if (!newPattern[drumId]) {
        newPattern[drumId] = {};
      } else {
        newPattern[drumId] = { ...newPattern[drumId] };
      }
      
      if (!newPattern[drumId][beatPosition]) {
        newPattern[drumId][beatPosition] = { enabled: false, accent: false };
      } else {
        newPattern[drumId][beatPosition] = { ...newPattern[drumId][beatPosition] };
      }
      
      newPattern[drumId][beatPosition].enabled = !newPattern[drumId][beatPosition].enabled;
      
      console.log('Toggle drum result:', drumId, beatPosition, 'new enabled:', newPattern[drumId][beatPosition].enabled);
      
      // Log full fill pattern for preset updating
      if (isFill) {
        const fillForPreset = convertPatternToPresetFormat(newPattern);
        console.log('FILL PATTERN FOR PRESET:', JSON.stringify(fillForPreset, null, 2));
      }
      
      return {
        ...prev,
        [patternKey]: newPattern,
      };
    });
  };

  const toggleAccent = (drumId: string, beatPosition: string, isFill: boolean = false) => {
    setState(prev => {
      const patternKey = isFill ? 'fillPattern' : 'pattern';
      const newPattern = { ...prev[patternKey] };
      
      if (!newPattern[drumId]) {
        newPattern[drumId] = {};
      } else {
        newPattern[drumId] = { ...newPattern[drumId] };
      }
      
      if (!newPattern[drumId][beatPosition]) {
        newPattern[drumId][beatPosition] = { enabled: false, accent: false };
      } else {
        newPattern[drumId][beatPosition] = { ...newPattern[drumId][beatPosition] };
      }
      
      const currentAccent = newPattern[drumId][beatPosition].accent;
      newPattern[drumId][beatPosition].accent = !currentAccent;
      
      console.log('Toggle accent result:', drumId, beatPosition, 'new accent:', newPattern[drumId][beatPosition].accent, 'new enabled:', newPattern[drumId][beatPosition].enabled);
      
      // Log full fill pattern for preset updating
      if (isFill) {
        const fillForPreset = convertPatternToPresetFormat(newPattern);
        console.log('FILL PATTERN FOR PRESET:', JSON.stringify(fillForPreset, null, 2));
      }
      
      return {
        ...prev,
        [patternKey]: newPattern,
      };
    });
  };

  const toggleBeatAccent = (beat: number, isFill: boolean = false) => {
    setState(prev => {
      const patternKey = isFill ? 'fillPattern' : 'pattern';
      const newPattern = { ...prev[patternKey] };
      
      // Check if any drum has an accent on the main beat position
      const mainBeatPosition = `${beat}.1`;
      const hasAccent = drumsConfig.drums.some(drum => 
        newPattern[drum.id]?.[mainBeatPosition]?.accent || false
      );
      
      // Toggle accent for all drums on this beat (only subdivision 1)
      drumsConfig.drums.forEach(drum => {
        if (!newPattern[drum.id]) {
          newPattern[drum.id] = {};
        } else {
          newPattern[drum.id] = { ...newPattern[drum.id] };
        }
        
        if (!newPattern[drum.id][mainBeatPosition]) {
          newPattern[drum.id][mainBeatPosition] = { enabled: false, accent: false };
        } else {
          newPattern[drum.id][mainBeatPosition] = { ...newPattern[drum.id][mainBeatPosition] };
        }
        
        // Toggle accent (opposite of current state)
        newPattern[drum.id][mainBeatPosition].accent = !hasAccent;
      });
      
      console.log(`Toggle beat ${beat} accent: ${hasAccent} -> ${!hasAccent}`);
      
      return {
        ...prev,
        [patternKey]: newPattern,
      };
    });
  };

  const toggleColumnAccent = (beatPosition: string, isFill: boolean = false) => {
    setState(prev => {
      const patternKey = isFill ? 'fillPattern' : 'pattern';
      const newPattern = { ...prev[patternKey] };
      
      // Check if any drum has an accent on this specific beat position
      const hasAccent = drumsConfig.drums.some(drum => 
        newPattern[drum.id]?.[beatPosition]?.accent || false
      );
      
      // Toggle accent for all drums on this specific beat position
      drumsConfig.drums.forEach(drum => {
        if (!newPattern[drum.id]) {
          newPattern[drum.id] = {};
        } else {
          newPattern[drum.id] = { ...newPattern[drum.id] };
        }
        
        if (!newPattern[drum.id][beatPosition]) {
          newPattern[drum.id][beatPosition] = { enabled: false, accent: false };
        } else {
          newPattern[drum.id][beatPosition] = { ...newPattern[drum.id][beatPosition] };
        }
        
        // Toggle accent (opposite of current state)
        newPattern[drum.id][beatPosition].accent = !hasAccent;
      });
      
      console.log(`Toggle column ${beatPosition} accent: ${hasAccent} -> ${!hasAccent}`);
      
      // Log full fill pattern for preset updating
      if (isFill) {
        const fillForPreset = convertPatternToPresetFormat(newPattern);
        console.log('FILL PATTERN FOR PRESET:', JSON.stringify(fillForPreset, null, 2));
      }
      
      return {
        ...prev,
        [patternKey]: newPattern,
      };
    });
  };

  const updateBeatPosition = (beat: number, measure: number, subBeat: number) => {
    setState(prev => ({
      ...prev,
      currentBeat: beat,
      currentMeasure: measure,
      currentSubBeat: subBeat,
    }));
  };

  return {
    state,
    drums: drumsConfig.drums,
    kits: drumsConfig.kits,
    presets: presetsConfig.presets,
    actions: {
      setState,
      loadPreset,
      toggleDrum,
      toggleAccent,
      toggleBeatAccent,
      toggleColumnAccent,
      updateBeatPosition,
    },
  };
};