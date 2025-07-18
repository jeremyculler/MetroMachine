import React from 'react';
import { DrumPattern, DrumConfig } from '../types';

interface DrumGridProps {
  drums: DrumConfig[];
  pattern: DrumPattern;
  beatsPerMeasure: number;
  subdivision: number;
  currentBeat: number;
  currentSubBeat: number;
  currentMeasure: number;
  isPlaying: boolean;
  onToggleDrum: (drumId: string, beatPosition: string) => void;
  onToggleAccent: (drumId: string, beatPosition: string) => void;
  onToggleBeatAccent: (beat: number) => void;
  onToggleColumnAccent: (beatPosition: string) => void;
  onDrumPreview: (drumId: string) => void;
  id?: string;
}

export const DrumGrid: React.FC<DrumGridProps> = ({
  drums,
  pattern,
  beatsPerMeasure,
  subdivision,
  currentBeat,
  currentSubBeat,
  currentMeasure,
  isPlaying,
  onToggleDrum,
  onToggleAccent,
  onToggleBeatAccent,
  onToggleColumnAccent,
  onDrumPreview,
  id,
}) => {
  const totalSteps = beatsPerMeasure * subdivision;
  
  const getBeatPosition = (stepIndex: number): string => {
    const beat = Math.floor(stepIndex / subdivision) + 1;
    const subBeat = (stepIndex % subdivision) + 1;
    return `${beat}.${subBeat}`;
  };

  const isCurrentStep = (stepIndex: number): boolean => {
    if (!isPlaying) return false;
    const beat = Math.floor(stepIndex / subdivision) + 1;
    const subBeat = (stepIndex % subdivision) + 1;
    return beat === currentBeat && subBeat === currentSubBeat;
  };

  const isBeatAccented = (beat: number): boolean => {
    // Check if any drum has an accent on the first subdivision of this beat
    const mainBeatPosition = `${beat}.1`;
    return drums.some(drum => 
      pattern[drum.id]?.[mainBeatPosition]?.accent || false
    );
  };

  const isColumnAccented = (beatPosition: string): boolean => {
    // Check if any drum has an accent on this specific beat position
    return drums.some(drum => 
      pattern[drum.id]?.[beatPosition]?.accent || false
    );
  };

  return (
    <div className="drum-grid" id={id}>
      <div className="grid-header">
        <div className="drum-label-column"></div>
        {Array.from({ length: totalSteps }, (_, i) => {
          const beat = Math.floor(i / subdivision) + 1;
          const subBeat = (i % subdivision) + 1;
          const isBeatStart = subBeat === 1;
          const beatPosition = getBeatPosition(i);
          const columnAccented = isColumnAccented(beatPosition);
          
          return (
            <div 
              key={i}
              className={`step-header ${isBeatStart ? 'beat-start' : ''} ${isCurrentStep(i) ? 'current-step' : ''} ${columnAccented ? 'beat-accented' : ''}`}
              onClick={() => onToggleColumnAccent(beatPosition)}
              title={`Toggle accent for ${beatPosition}`}
            >
              <div className="beat-accent-btn">
                {isBeatStart ? beat : ''}
              </div>
            </div>
          );
        })}
      </div>
      
      {drums.map((drum, index) => (
        <div key={drum.id} className="drum-row">
          <div 
            className="drum-label clickable"
            onClick={() => onDrumPreview(drum.id)}
            title={`Click to preview ${drum.name} (Key: ${index + 1})`}
          >
            <span className="drum-key">{index + 1}</span>
            <span className="drum-name">{drum.name}</span>
          </div>
          {Array.from({ length: totalSteps }, (_, i) => {
            const beatPosition = getBeatPosition(i);
            const cellData = pattern[drum.id]?.[beatPosition];
            const isEnabled = cellData?.enabled || false;
            const isAccent = cellData?.accent || false;
            
            return (
              <div key={i} className={`drum-cell ${isCurrentStep(i) ? 'current-step' : ''}`}>
                <div className="accent-toggle">
                  <button
                    className={`accent-btn ${isAccent ? 'active' : ''}`}
                    onClick={() => {
                      console.log('Accent click:', drum.id, beatPosition, 'current accent:', isAccent);
                      onToggleAccent(drum.id, beatPosition);
                    }}
                    title={`${drum.name} - Beat ${beatPosition}${isAccent ? ' (ACCENT)' : ''}`}
                  >
                    A
                  </button>
                </div>
                <button
                  className={`drum-btn ${isEnabled ? 'active' : ''}`}
                  onClick={() => {
                    console.log('Drum click:', drum.id, beatPosition, 'current enabled:', isEnabled);
                    onToggleDrum(drum.id, beatPosition);
                  }}
                  title={`${drum.name} - Beat ${beatPosition}${isEnabled ? ' (ENABLED)' : ''}`}
                >
                  {isEnabled ? '●' : '○'}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};