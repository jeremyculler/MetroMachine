import React from 'react';

interface MeasureCounterProps {
  currentMeasure: number;
  totalMeasures: number;
  currentBeat: number;
  beatsPerMeasure: number;
  isPlaying: boolean;
  isCountingIn: boolean;
}

export const MeasureCounter: React.FC<MeasureCounterProps> = ({
  currentMeasure,
  totalMeasures,
  currentBeat,
  beatsPerMeasure,
  isPlaying,
  isCountingIn,
}) => {
  return (
    <div className="measure-counter">
      <div className="measure-display">
        <span className="label">Measure:</span>
      </div>
      <div className="measure-indicators">
        {Array.from({ length: totalMeasures }, (_, i) => (
          <div
            key={i}
            className={`measure-indicator ${
              isPlaying && currentMeasure === i + 1 ? 'active' : ''
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};