export interface DrumConfig {
  id: string;
  name: string;
  filename: string;
}

export interface DrumKit {
  id: string;
  name: string;
  path: string;
  sounds: Record<string, string>;
}

export interface Preset {
  id: string;
  name: string;
  beatsPerMeasure: number;
  subdivision: number;
  measures: number;
  accents: number[];
  pattern: Record<string, string[]>;
  fill: Record<string, string[]>;
}

export interface DrumMachineConfig {
  drums: DrumConfig[];
  kits: DrumKit[];
}

export interface PresetConfig {
  presets: Preset[];
}

export interface DrumPattern {
  [drumId: string]: {
    [beatPosition: string]: {
      enabled: boolean;
      accent: boolean;
    };
  };
}

export interface DrumMachineState {
  isPlaying: boolean;
  currentBeat: number;
  currentMeasure: number;
  currentSubBeat: number;
  bpm: number;
  measures: number;
  beatsPerMeasure: number;
  subdivision: number;
  currentKit: string;
  currentPreset: string;
  fillEnabled: boolean;
  countInEnabled: boolean;
  pattern: DrumPattern;
  fillPattern: DrumPattern;
  accentVolumeReduction: number; // 1-10 scale for volume reduction
}