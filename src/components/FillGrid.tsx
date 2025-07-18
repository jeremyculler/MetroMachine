import React from 'react';
import { DrumGrid } from './DrumGrid';
import { DrumPattern, DrumConfig } from '../types';

interface FillGridProps {
  drums: DrumConfig[];
  fillPattern: DrumPattern;
  beatsPerMeasure: number;
  subdivision: number;
  currentBeat: number;
  currentSubBeat: number;
  currentMeasure: number;
  totalMeasures: number;
  fillEnabled: boolean;
  isPlaying: boolean;
  onToggleDrum: (drumId: string, beatPosition: string) => void;
  onToggleAccent: (drumId: string, beatPosition: string) => void;
  onToggleBeatAccent: (beat: number) => void;
  onToggleColumnAccent: (beatPosition: string) => void;
  onDrumPreview: (drumId: string) => void;
}

export const FillGrid: React.FC<FillGridProps> = ({
  drums,
  fillPattern,
  beatsPerMeasure,
  subdivision,
  currentBeat,
  currentSubBeat,
  currentMeasure,
  totalMeasures,
  fillEnabled,
  isPlaying,
  onToggleDrum,
  onToggleAccent,
  onToggleBeatAccent,
  onToggleColumnAccent,
  onDrumPreview,
}) => {
  const isLastMeasure = currentMeasure === totalMeasures;
  const showAsActive = isPlaying && fillEnabled && isLastMeasure;

  return (
    <div className="fill-grid">
      <h3>Fill Pattern (Final Measure)</h3>
      <DrumGrid
        drums={drums}
        pattern={fillPattern}
        beatsPerMeasure={beatsPerMeasure}
        subdivision={subdivision}
        currentBeat={showAsActive ? currentBeat : 0}
        currentSubBeat={showAsActive ? currentSubBeat : 0}
        currentMeasure={currentMeasure}
        isPlaying={showAsActive}
        onToggleDrum={onToggleDrum}
        onToggleAccent={onToggleAccent}
        onToggleBeatAccent={onToggleBeatAccent}
        onToggleColumnAccent={onToggleColumnAccent}
        onDrumPreview={onDrumPreview}
      />
    </div>
  );
};